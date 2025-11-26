import CampaignDetailView from "@/components/Campaigns/CampaignDetailView";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <CampaignDetailView id={id} />
      </div>
    </main>
  );
}

