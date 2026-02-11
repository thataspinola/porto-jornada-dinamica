import { Journey } from "@/components";
import { getJourneyConfig } from "@/service";

interface PageProps {
  params: { slug: string[] };
}

export default async function Page({ params }: PageProps) {
  const [journeySlug, slug] = params.slug;
  const pageConfig = await getJourneyConfig(journeySlug);

  const step = pageConfig.steps.find(
    (step) => step.slug === slug,
  );

  return (
    <Journey
      journeySlug={journeySlug}
      currentStepName={slug}
      step={step}
    />
  );
}
