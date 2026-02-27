import { Journey } from "@/components";
import { getJourneyConfig } from "@/services";
import { getStepData } from "@/utils";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const [journeySlug, slug] = resolvedParams.slug;
  const pageConfig = await getJourneyConfig(journeySlug);

  const journeyData = getStepData(pageConfig.steps, slug);

  return <Journey slug={journeySlug} data={journeyData} />;
}
