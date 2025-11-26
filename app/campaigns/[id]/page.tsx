import CampaignDetailView from "@/components/Campaigns/CampaignDetailView";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <CampaignDetailView id={id} />
      </div>
    </main>
  );
}

