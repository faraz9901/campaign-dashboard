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
    <div className="p-6 max-w-3xl mx-auto">
      <Card className="shadow-md rounded-2xl p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center justify-between">
            {campaign?.name}
            <Badge className="uppercase px-3 py-1 text-xs">{campaign?.status}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 text-base">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-sm">Campaign ID</p>
              <p className="font-medium">{campaign?.id}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-sm">Brand ID</p>
              <p className="font-medium">{campaign?.brand_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-sm">Budget</p>
              <p className="font-medium">₹ {campaign?.budget.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-sm">Daily Budget</p>
              <p className="font-medium">₹ {campaign?.daily_budget.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-sm">Platforms</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {campaign?.platforms?.map((p) => (
                <Badge key={p} variant="outline" className="px-3 py-1 text-xs">
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-sm">Created At</p>
            <p className="font-medium">{new Date(campaign?.created_at).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <InsightsStream id={id} />
    </div>
  );


}

