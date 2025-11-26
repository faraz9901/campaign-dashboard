"use client"
import campaignService from '@/lib/services/campaign.service'
import React from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { SelectTrigger } from '@radix-ui/react-select'
import { ArrowUpRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

function CampaignTable() {

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["campaigns"],
        queryFn: campaignService.getCampaigns
    })


    const campaigns = React.useMemo(() => {
        const list = data?.campaigns ?? []

        return list
    }, [data])


    const statusVariant = (status: string) => {
        switch (status) {
            case "active":
                return "secondary"
            case "paused":
                return "default"
            case "completed":
                return "success"
            default:
                return "secondary"
        }
    }

    return (
        <div className="space-y-4" id="campaign-table">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Campaigns</h2>
                </div>
            </div>

            <Card className="border-none bg-white shadow-xl shadow-primary/5">
                <CardHeader>
                    <CardTitle className="text-xl">Overview</CardTitle>
                    <CardDescription>List of all campaigns with budget and platforms</CardDescription>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
                            <span className="text-destructive">Failed to load campaigns</span>
                            <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className='text-center'>Status</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Daily Budget</TableHead>
                                    <TableHead>Platforms</TableHead>
                                    <TableHead className="text-right">Created</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <TableRow key={`sk-${i}`}>
                                            <TableCell colSpan={8}>
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : campaigns.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            <div className="py-10 text-center text-sm text-muted-foreground">No campaigns found</div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    campaigns.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell className="text-xs text-muted-foreground">{c.id}</TableCell>
                                            <TableCell className="font-medium">
                                                <Link href={`/campaigns/${c.id}`} className="hover:underline">
                                                    {c.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell className='text-center'>
                                                <Badge variant={statusVariant(c.status)} className="capitalize">{c.status}</Badge>
                                            </TableCell>
                                            <TableCell>${c.budget.toLocaleString()}</TableCell>
                                            <TableCell>${c.daily_budget.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {c.platforms.map((p) => (
                                                        <Badge key={p} variant="secondary" className="capitalize">{p}</Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="outline" size="sm" className="gap-1">
                                                    <Link href={`/campaigns/${c.id}`}>
                                                        View
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default CampaignTable