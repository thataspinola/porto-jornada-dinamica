import { Journey } from "@/components";
import { getJourneyConfig } from "@/services";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const [journeySlug, slug] = resolvedParams.slug;
  const pageConfig = await getJourneyConfig(journeySlug);

  const step = pageConfig.steps.find(
    (step) => step.slug === slug,
  );

  return (
    <Journey
      journeySlug={journeySlug}
      step={step}
    />
  );
}
