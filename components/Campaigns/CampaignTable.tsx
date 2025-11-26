"use client";

import React from "react";
import Link from "next/link";
import campaignService from "@/lib/services/campaign.service";
import { Campaign } from "@/types/campaign.types";
import { useQuery } from "@tanstack/react-query";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { ArrowUpRight, RefreshCcw } from "lucide-react";

export default function CampaignTable() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["campaigns"],
    queryFn: campaignService.getCampaigns,
  });

  const campaigns: Campaign[] = React.useMemo(() => {
    return data?.campaigns ?? [];
  }, [data]);

  const statusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "secondary";
      case "paused":
        return "default";
      case "completed":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="rounded-3xl border bg-white shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl text-slate-900">Campaign list</CardTitle>
            
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full gap-2 md:w-auto"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive md:flex-row md:items-center md:justify-between">
            <span>Failed to load campaigns.</span>
            <Button size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <div className="overflow-x-auto rounded-2xl border">
                <Table>
                  <TableHeader>
                    <TableRow className="text-sm text-slate-500">
                      <TableHead className="min-w-[120px]">ID</TableHead>
                      <TableHead className="min-w-[200px]">Name</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Daily Budget</TableHead>
                      <TableHead>Platforms</TableHead>
                      <TableHead className="text-right">Created</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading &&
                      Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={`sk-${i}`}>
                          <TableCell colSpan={8}>
                            <Skeleton className="h-6 w-full rounded-full" />
                          </TableCell>
                        </TableRow>
                      ))}

                    {!isLoading && campaigns.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <div className="py-10 text-center text-sm text-muted-foreground">
                            No campaigns found
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {!isLoading &&
                      campaigns.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="text-xs text-muted-foreground">
                            {c.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            <Link href={`/campaigns/${c.id}`} className="hover:underline">
                              {c.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={statusVariant(c.status)} className="capitalize">
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell>₹{c.budget.toLocaleString()}</TableCell>
                          <TableCell>₹{c.daily_budget.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {c.platforms.map((p) => (
                                <Badge key={p} variant="secondary" className="capitalize">
                                  {p}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {new Date(c.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="outline" size="sm" className="gap-1">
                              <Link href={`/campaigns/${c.id}`}>
                                View
                                <ArrowUpRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={`mobile-sk-${index}`} className="rounded-2xl border p-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="mt-3 h-6 w-2/3" />
                    <Skeleton className="mt-4 h-4 w-1/2" />
                  </Card>
                ))}

              {!isLoading && campaigns.length === 0 && (
                <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No campaigns found
                </div>
              )}

              {!isLoading &&
                campaigns.map((campaign) => (
                  <MobileCampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    statusVariant={statusVariant}
                  />
                ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function MobileCampaignCard({
  campaign,
  statusVariant,
}: {
  campaign: Campaign;
  statusVariant: (status: string) => "default" | "secondary" | "success";
}) {
  return (
    <Card className="rounded-2xl border bg-slate-50 p-4 shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-slate-500">#{campaign.id}</p>
          <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
        </div>
        <Badge variant={statusVariant(campaign.status)} className="capitalize">
          {campaign.status}
        </Badge>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-slate-600">
        <div>
          <dt className="text-xs uppercase text-slate-500">Budget</dt>
          <dd className="font-medium text-slate-900">
            ₹{campaign.budget.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">Daily</dt>
          <dd className="font-medium text-slate-900">
            ₹{campaign.daily_budget.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">Platforms</dt>
          <dd className="flex flex-wrap gap-2">
            {campaign.platforms.map((platform) => (
              <Badge key={platform} variant="outline" className="capitalize">
                {platform}
              </Badge>
            ))}
          </dd>
        </div>
        <div className="text-xs text-slate-500">
          Created {new Date(campaign.created_at).toLocaleDateString()}
        </div>
      </dl>

      <Button asChild variant="secondary" className="mt-4 w-full gap-2">
        <Link href={`/campaigns/${campaign.id}`}>
          View details
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
}
