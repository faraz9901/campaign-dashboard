import CampaignInsightsDashboard from "@/components/Campaigns/CampaignInsightsDashboard";
import CampaignTable from "@/components/Campaigns/CampaignTable";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto container space-y-10 px-4 py-10 md:px-8">
        <h1 className="text-2xl font-semibold">Campaigns Dashboard</h1>
        <CampaignInsightsDashboard />
        <CampaignTable />
      </div>
    </main>
  );
}
