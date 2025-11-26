 "use client";
 
 import type { ElementType } from "react";
 import { useEffect, useMemo, useState } from "react";
 
 import { CampaignInsight } from "@/types/campaign.types";
 import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Skeleton } from "@/components/ui/skeleton";
 import { Activity, BarChart3, Hourglass, Signal, Wallet } from "lucide-react";
 
 type ConnectionState = "connecting" | "live" | "reconnecting" | "offline";
 
 const formatNumber = new Intl.NumberFormat("en-US", {
   notation: "compact",
   maximumFractionDigits: 1,
 });
 
 const formatCurrency = new Intl.NumberFormat("en-IN", {
   style: "currency",
   currency: "INR",
   maximumFractionDigits: 0,
 });
 
 type MetricItem = {
   key: keyof CampaignInsight;
   label: string;
   icon: ElementType;
   formatter?: (value: number) => string;
   accent: string;
 };
 
 const metricLayout: MetricItem[] = [
   {
     key: "impressions",
     label: "Impressions",
     icon: Activity,
     accent: "bg-sky-50 text-sky-700",
   },
   {
     key: "clicks",
     label: "Clicks",
     icon: Signal,
     accent: "bg-emerald-50 text-emerald-700",
   },
   {
     key: "conversions",
     label: "Conversions",
     icon: BarChart3,
     accent: "bg-violet-50 text-violet-700",
   },
   {
     key: "spend",
     label: "Spend",
     icon: Wallet,
     formatter: (value) => formatCurrency.format(value),
     accent: "bg-amber-50 text-amber-700",
   },
 ];
 
 export default function InsightsStream({
   id,
   initialInsights,
 }: {
   id: string;
   initialInsights?: CampaignInsight | null;
 }) {
   const [insights, setInsights] = useState<CampaignInsight | null>(
     initialInsights ?? null
   );
   const [status, setStatus] = useState<ConnectionState>("connecting");
   const [lastUpdated, setLastUpdated] = useState<string | null>(
     initialInsights?.timestamp ?? null
   );
 
   useEffect(() => {
     const url =
       process.env.NEXT_PUBLIC_API_URL + `/campaigns/${id}/insights/stream`;
 
     let eventSource = new EventSource(url);
 
     eventSource.onopen = () => setStatus("live");
 
     eventSource.onmessage = (event) => {
       try {
         const data = JSON.parse(event.data) as CampaignInsight;
         setInsights(data);
         setLastUpdated(data.timestamp ?? new Date().toISOString());
         setStatus("live");
       } catch (err) {
         console.error("JSON parse error:", err);
       }
     };
 
     eventSource.onerror = () => {
       setStatus("reconnecting");
       eventSource.close();
       setTimeout(() => {
         setStatus("offline");
         eventSource = new EventSource(url);
       }, 2000);
     };
 
     return () => eventSource.close();
   }, [id]);
 
   const insightMetrics = useMemo(() => {
     if (!insights) return null;
 
     return metricLayout.map((metric) => {
       const rawValue = insights[metric.key];
       const isNumeric = typeof rawValue === "number";
 
       return {
         ...metric,
         value: isNumeric
           ? metric.formatter
             ? metric.formatter(rawValue)
             : formatNumber.format(rawValue)
           : "—",
       };
     });
   }, [insights]);
 
   const statusConfig: Record<
     ConnectionState,
     { label: string; tone: string }
   > = {
     connecting: { label: "Connecting", tone: "bg-amber-50 text-amber-700" },
     live: { label: "Live", tone: "bg-emerald-50 text-emerald-700" },
     reconnecting: { label: "Reconnecting", tone: "bg-red-50 text-red-700" },
     offline: { label: "Offline", tone: "bg-zinc-100 text-zinc-600" },
   };
 
   return (
     <Card className="rounded-3xl border bg-white shadow-sm">
       <CardHeader className="gap-4">
         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
           <div>
             <CardTitle className="text-2xl text-slate-900">
               Live campaign metrics
             </CardTitle>
            
           </div>
           <Badge
             className={`inline-flex items-center gap-2 text-sm font-semibold ${statusConfig[status].tone}`}
           >
             <Hourglass className="h-4 w-4" />
             {statusConfig[status].label}
           </Badge>
         </div>
       </CardHeader>
 
       <CardContent className="space-y-6">
         {!insightMetrics ? (
           <div className="grid gap-4 sm:grid-cols-2">
             {Array.from({ length: 4 }).map((_, index) => (
               <div
                 key={`metric-skeleton-${index}`}
                 className="rounded-2xl border bg-slate-50 p-4"
               >
                 <Skeleton className="h-4 w-1/2" />
                 <Skeleton className="mt-4 h-8 w-2/3" />
               </div>
             ))}
           </div>
         ) : (
           <div
             className="grid gap-4 sm:grid-cols-2"
             aria-live="polite"
             aria-busy={!insightMetrics}
           >
             {insightMetrics.map((metric) => (
               <MetricCard key={metric.label} metric={metric} />
             ))}
           </div>
         )}
 
         {insights && (
           <div className="grid gap-4 md:grid-cols-3">
             <SecondaryStat label="CTR" value={`${(insights.ctr * 100).toFixed(2)}%`} />
             <SecondaryStat label="CPC" value={formatCurrency.format(insights.cpc)} />
             <SecondaryStat
               label="CVR"
               value={`${(insights.conversion_rate * 100).toFixed(2)}%`}
             />
           </div>
         )}
 
         <div className="rounded-2xl border border-dashed bg-slate-50 p-4 text-sm text-slate-600">
           {lastUpdated ? (
             <>
               Last updated{" "}
               <span className="font-semibold text-slate-900">
                 {new Date(lastUpdated).toLocaleString()}
               </span>
             </>
           ) : (
             "Waiting for first insight event..."
           )}
         </div>
       </CardContent>
     </Card>
   );
 }
 
 function MetricCard({ metric }: { metric: MetricItem & { value: string } }) {
   const Icon = metric.icon;
 
   return (
     <div className="rounded-2xl border bg-white p-4 shadow-sm">
       <div className="flex items-center justify-between">
         <p className="text-sm text-slate-500">{metric.label}</p>
         <span
           className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${metric.accent}`}
         >
           <Icon className="h-3.5 w-3.5" />
           Stream
         </span>
       </div>
       <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
     </div>
   );
 }
 
 function SecondaryStat({ label, value }: { label: string; value: string }) {
   return (
     <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
       <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
       <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
     </div>
   );
 }
