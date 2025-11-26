"use client";

import Link from "next/link";
import campaignService from "@/lib/services/campaign.service";
import { Campaign } from "@/types/campaign.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import InsightsStream from "./InsightsStream";
import { useQuery } from "@tanstack/react-query";

export default function CampaignDetailView({ id }: { id: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignService.getCampaignById(id),
  });

  const campaign = data?.campaign as Campaign | undefined;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-3 rounded-3xl border bg-white p-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full rounded-full" />
        ))}
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-dashed bg-white p-6 text-center text-sm text-muted-foreground">
        Failed to load campaign details.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Campaign detail
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">{campaign.name}</h1>
     
        </div>
        <Button asChild variant="outline" className="w-full md:w-auto">
          <Link href="/">Back to all campaigns</Link>
        </Button>
      </div>

      <InsightsStream id={id} />

      <Card className="rounded-3xl border bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex flex-col gap-3 text-2xl text-slate-900 sm:flex-row sm:items-center sm:justify-between">
            Overview
            <Badge variant="secondary" className="uppercase tracking-wide">
              {campaign.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBox label="Brand ID" value={campaign.brand_id} />
            <InfoBox
              label="Created"
              value={new Date(campaign.created_at).toLocaleString()}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBox
              label="Budget"
              value={`₹${campaign.budget.toLocaleString()}`}
            />
            <InfoBox
              label="Daily budget"
              value={`₹${campaign.daily_budget.toLocaleString()}`}
            />
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Platforms</p>
            {campaign.platforms?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {campaign.platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="capitalize">
                    {platform}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No platforms assigned.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
