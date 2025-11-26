import CampaignDetailView from "@/components/Campaigns/CampaignDetailView";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <CampaignDetailView id={id} />
      </div>
    </main>
  );
}

