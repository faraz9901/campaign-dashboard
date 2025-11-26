import CampaignInsightsDashboard from "@/components/Campaigns/CampaignInsightsDashboard";
import CampaignTable from "@/components/Campaigns/CampaignTable";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative isolate overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="absolute -top-16 right-0 h-56 w-56 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.55), transparent 50%)",
          }}
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(14, 165, 233, 0.4), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
          <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/0 p-8 shadow-2xl shadow-sky-900/60 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Campaign Observatory
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Campaign intelligence, now polished
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300">
              A clean, consistent control room for campaign performance. Dive into
              live insights and curated summaries without hunting through raw data.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="rounded-full border border-white/20 px-3 py-1">
                Live data stream
              </span>
              <span className="rounded-full border border-white/20 px-3 py-1">
                Unified visual language
              </span>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Live insight stream
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Campaign insights dashboard
                </h2>
                <p className="text-sm text-slate-400">
                  Real-time metrics pulled directly from the streaming endpoint.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Auto-refreshing feed
              </p>
            </div>
            <CampaignInsightsDashboard />
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Campaign inventory
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Campaign roster
                </h2>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Sorted by creation date
              </p>
            </div>
            <CampaignTable />
          </section>
        </div>
      </div>
    </main>
  );
}
