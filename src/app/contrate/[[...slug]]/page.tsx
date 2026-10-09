import { JourneyBuilder } from "@/components/Core/JourneyBuilder";
import { injectProgressToSteps, readJourneyContent } from "@/utils";

export default async function Page({ params }) {
	const resolvedParam = await params;
	const slug = resolvedParam.slug[0];
	const journeyContent = await readJourneyContent(slug);
	const parsedJourneyContent = JSON.parse(journeyContent);

	const sampleJourneyWithProgress = injectProgressToSteps(parsedJourneyContent);
	return <JourneyBuilder journey={sampleJourneyWithProgress} />;
}
