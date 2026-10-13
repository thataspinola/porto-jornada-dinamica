import { callService } from "@/services";
export async function prefetchActions(
	actions: { service: string; input?: unknown }[],
) {
	return Promise.all(
		actions.map((action) => callService(action.service, action.input)),
	);
}
