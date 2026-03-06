import { JourneyBuilder } from "@/components/JourneyBuilder";
import { sampleJourney } from "@/mock/sampleJourney";
import { injectProgressToSteps } from "@/utils";

export default async function Page() {
  const sampleJourneyWithProgress = injectProgressToSteps(sampleJourney);
  console.log("Sample Journey with Progress:", sampleJourneyWithProgress);
  return <JourneyBuilder journey={sampleJourneyWithProgress} />;
}
