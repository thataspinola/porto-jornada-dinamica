import { callService } from "@/services";
export async function callMultipleServices(
	requests: { name: string; input: unknown }[],
) {
	return Promise.all(requests.map((r) => callService(r.name, r.input)));
}
export { useJourneyService as useMultipleService } from "./useJourneyService";
