import CampaignInsightsDashboard from "@/components/Campaigns/CampaignInsightsDashboard";
import CampaignTable from "@/components/Campaigns/CampaignTable";


export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        

        <section id="insights" className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Live stream
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Campaign insights
              </h2>
              
            </div>
            <p className="text-xs text-slate-500">Auto-refreshing feed</p>
          </div>
          <CampaignInsightsDashboard />
        </section>

        <section id="campaigns" className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Campaign roster
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                All campaigns
              </h2>
            
            </div>
            <p className="text-xs text-slate-500">Sorted by creation date</p>
          </div>
          <CampaignTable />
        </section>
      </div>
    </main>
  );
}
