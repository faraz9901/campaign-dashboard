"use client";

import campaignService from "@/lib/services/campaign.service";
import { AllCampaignInsights } from "@/types/campaign.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";


export default function CampaignInsightsDashboard() {

  const { data, isLoading } = useQuery({
    queryKey: ["insights"],
    queryFn: campaignService.getCampaignInsights,
  });



  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    )
  }

  const insights = data?.insights as AllCampaignInsights


  return (
    <div className="space-y-4 grid lg:grid-cols-3 gap-5">
      {Object.entries(insights).map(([key, value]) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{key}</CardTitle>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Activity className="mr-2 h-4 w-4" /> {value}
            </div>
          </CardHeader>
          <CardContent className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-center space-y-1">
              <div className="text-2xl font-bold">{value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

  )



}

