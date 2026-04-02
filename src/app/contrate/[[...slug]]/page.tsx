import { JourneyBuilder } from "@/components/Core/JourneyBuilder";
import { leadJourney } from "@/mock/lead";
import { injectProgressToSteps } from "@/utils";

export default async function Page() {
	const sampleJourneyWithProgress = injectProgressToSteps(leadJourney);
	return <JourneyBuilder journey={sampleJourneyWithProgress} />;
}
