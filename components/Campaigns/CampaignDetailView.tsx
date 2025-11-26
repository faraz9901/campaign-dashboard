"use client";


import Link from "next/link";
import campaignService from "@/lib/services/campaign.service";
import { Campaign } from "@/types/campaign.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarClock, Globe, Layers3 } from "lucide-react";
import InsightsStream from "./InsightsStream";
import { useQuery } from "@tanstack/react-query";



export default function CampaignDetailView({ id }: { id: string }) {

  const { data, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignService.getCampaignById(id),
  });


  const campaign = data?.campaign as Campaign



  if (isLoading) {
    return (
      <div className="p-6 grid gap-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:py-8">
      <InsightsStream id={id} />
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center justify-between">
            {campaign?.name}
            <Badge className="uppercase px-3 py-1 text-xs">{campaign?.status}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 text-base">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-sm text-muted-foreground">Campaign ID</p>
              <p className="font-medium">{campaign?.id}</p>
            </div>

            <div className="p-4 rounded-xl bg-muted">
              <p className="text-sm text-muted-foreground">Brand ID</p>
              <p className="font-medium">{campaign?.brand_id}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-medium">
                ₹ {campaign?.budget.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted">
              <p className="text-sm text-muted-foreground">Daily Budget</p>
              <p className="font-medium">₹ {campaign?.daily_budget.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground">Platforms</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {campaign?.platforms?.map((p) => (
                <Badge key={p} variant="outline" className="px-3 py-1 text-xs">
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-medium">{new Date(campaign?.created_at).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );


}

