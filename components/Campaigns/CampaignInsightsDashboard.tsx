"use client";

import type { ElementType } from "react";

import campaignService from "@/lib/services/campaign.service";
import { AllCampaignInsights } from "@/types/campaign.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  IndianRupee,
  Percent,
  Target,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const iconMap: Partial<Record<keyof AllCampaignInsights, ElementType>> = {
  avg_ctr: Percent,
  avg_conversion_rate: Target,
  avg_cpc: IndianRupee,
  total_spend: TrendingUp,
};

export default function CampaignInsightsDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["insights"],
    queryFn: campaignService.getCampaignInsights,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError || !data?.insights) {
    return (
      <div className="rounded-3xl border border-dashed bg-white p-6 text-center text-sm text-muted-foreground">
        Failed to load campaign insights.
      </div>
    );
  }

  const insights = data.insights as AllCampaignInsights;

  const formatKey = (key: string) =>
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const formatValue = (key: string, value: number) => {
    if (key === "avg_ctr" || key === "avg_conversion_rate") {
      return `${(value * 100).toFixed(2)}%`;
    }
    if (key === "avg_cpc" || key === "total_spend") {
      return `₹${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-live="polite"
      aria-busy={isLoading}
    >
      {Object.entries(insights).map(([key, value]) => (
        <StatCard
          key={key}
          label={formatKey(key)}
          value={formatValue(key, value as number)}
          icon={iconMap[key as keyof AllCampaignInsights] ?? Activity}
        />
      ))}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  icon: ElementType;
};

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="rounded-2xl border bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {label}
        </CardTitle>
        <span className="rounded-full bg-slate-100 p-2 text-slate-500">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}
