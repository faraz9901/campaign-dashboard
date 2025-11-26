"use client";

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

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const metricLayout: Array<{
  key: keyof CampaignInsight;
  label: string;
  icon: React.ElementType;
  formatter?: (value: number) => string;
  accent: string;
}> = [
  { key: "impressions", label: "Impressions", icon: Activity, accent: "bg-sky-50 text-sky-700" },
  { key: "clicks", label: "Clicks", icon: Signal, accent: "bg-emerald-50 text-emerald-700" },
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

    const eventSource = new EventSource(url);

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

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      setStatus("reconnecting");
      eventSource.close();
      // Attempt a lightweight retry after a delay
      setTimeout(() => {
        setStatus("offline");
      }, 4000);
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
    connecting: {
      label: "Connecting",
      tone: "bg-amber-50 text-amber-700",
    },
    live: {
      label: "Live",
      tone: "bg-emerald-50 text-emerald-700",
    },
    reconnecting: {
      label: "Reconnecting",
      tone: "bg-red-50 text-red-700",
    },
    offline: {
      label: "Offline",
      tone: "bg-zinc-100 text-zinc-600",
    },
  };

  return (
    <Card className="border-none bg-white shadow-xl shadow-primary/5">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold">
            Live campaign metrics
          </CardTitle>
          <CardDescription>
            Real-time stream powered by the campaign service
          </CardDescription>
        </div>
        <Badge className={`${statusConfig[status].tone} text-sm font-semibold`}>
          <Hourglass className="mr-2 h-3.5 w-3.5" />
          {statusConfig[status].label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {!insightMetrics ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={`stream-sk-${index}`} className="border bg-white">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {insightMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-muted/60 bg-gradient-to-br from-white to-white/80 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${metric.accent}`}
                  >
                    <metric.icon className="mr-1.5 h-3.5 w-3.5" />
                    Stream
                  </span>
                </div>
                <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        )}

        {insights && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs uppercase text-muted-foreground">
                CTR
              </p>
              <p className="mt-2 text-2xl font-semibold">
                {(insights.ctr * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Click through rate
              </p>
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs uppercase text-muted-foreground">CPC</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatCurrency.format(insights.cpc)}
              </p>
              <p className="text-xs text-muted-foreground">
                Cost per click
              </p>
            </div>
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs uppercase text-muted-foreground">CVR</p>
              <p className="mt-2 text-2xl font-semibold">
                {(insights.conversion_rate * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Conversion rate
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/20 p-4 text-sm text-muted-foreground">
          {lastUpdated ? (
            <p>
              Stream last updated{" "}
              <span className="font-medium text-foreground">
                {new Date(lastUpdated).toLocaleString()}
              </span>
            </p>
          ) : (
            <p>Waiting for the first insight event...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
