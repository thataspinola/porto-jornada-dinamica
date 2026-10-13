import { useJourneyStore } from "@/store";
export function REFFResumeElementController() {
	const { fields, business, services } = useJourneyStore();
	return { fields, business, services, print: () => window.print() };
}
