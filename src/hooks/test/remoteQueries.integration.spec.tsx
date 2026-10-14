import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	QueryClientProvider,
	useQueryClient,
} from "@/contexts/QueryClientProvider";
import { QueryClient, queryClient } from "@/lib/queryClient";
import { apiService } from "@/services/apiService";
import { useRemoteQuery } from "@/hooks/queries/useRemoteQuery";
import { useAddress } from "@/hooks/queries/useAddress";
import { useAddresses } from "@/hooks/queries/useAddresses";
import { useLocalities } from "@/hooks/queries/useLocalities";
import { useStates } from "@/hooks/queries/useStates";
import { useSelectOptions } from "@/hooks/queries/useSelectOptions";
import { useProducts } from "@/hooks/useProducts";
import { useAddressSearchController } from "@/components/Elements/CepElement/components/ModalWithoutCep/hooks";
vi.mock("@/services/apiService", () => ({ apiService: vi.fn() }));
afterEach(() => queryClient.clear());
describe("cache e consultas remotas", () => {
	it("cache compartilha requisição, invalida chave e invalida todas", async () => {
		const client = new QueryClient({
				defaultOptions: { queries: { retry: false, staleTime: 30000 } },
			}),
			load = vi.fn(async () => ({ id: 1 }));
		expect(await client.fetch("key", load)).toEqual({ id: 1 });
		await client.fetch("key", load);
		expect(load).toHaveBeenCalledOnce();
		await client.invalidate("key");
		await client.fetch("key", load);
		expect(load).toHaveBeenCalledTimes(2);
		await client.invalidate();
		await client.fetch("key", load);
		expect(load).toHaveBeenCalledTimes(3);
		client.clear();
	});
	it("provider preserva cliente em re-render, fallback é estável e isolado", () => {
		const provided = renderHook(() => useQueryClient(), {
			wrapper: QueryClientProvider,
		});
		const first = provided.result.current;
		provided.rerender();
		expect(provided.result.current).toBe(first);
		const fallback = renderHook(() => useQueryClient());
		const second = fallback.result.current;
		fallback.rerender();
		expect(fallback.result.current).toBe(second);
		expect(second).not.toBe(first);
	});
	it.each([
		useRemoteQuery,
		useAddress,
		useAddresses,
		useLocalities,
		useStates,
		useSelectOptions,
		useProducts,
	])("carrega dados com o adaptador real de cache", async (useQuery) => {
		vi.mocked(apiService).mockResolvedValue([{ id: "001" }]);
		const { result } = renderHook(() => useQuery("/options"), {
			wrapper: QueryClientProvider,
		});
		expect(result.current.isLoading).toBe(true);
		await waitFor(() => expect(result.current.data).toEqual([{ id: "001" }]));
		expect(result.current.isLoading).toBe(false);
		expect(apiService).toHaveBeenCalledWith({ url: "/options" });
	});
	it.each([
		new Error("Falha"),
		"opaque",
	])("propaga erro e libera loading", async (error) => {
		vi.mocked(apiService).mockRejectedValue(error);
		const { result } = renderHook(() => useRemoteQuery("/error"), {
			wrapper: QueryClientProvider,
		});
		await waitFor(() =>
			expect(result.current.error?.message).toBe(
				error instanceof Error ? "Falha" : "Falha ao carregar dados",
			),
		);
		expect(result.current.isLoading).toBe(false);
	});
	it("sem URL não chama o serviço e resposta obsoleta não altera estado", async () => {
		let release!: (value: unknown) => void;
		vi.mocked(apiService).mockImplementation(
			() =>
				new Promise((resolve) => {
					release = resolve;
				}),
		);
		const { result, rerender } = renderHook(({ url }) => useRemoteQuery(url), {
			initialProps: { url: undefined as string | undefined },
			wrapper: QueryClientProvider,
		});
		expect(result.current).toEqual({ isLoading: false });
		expect(apiService).not.toHaveBeenCalled();
		rerender({ url: "/slow" });
		await waitFor(() => expect(apiService).toHaveBeenCalledOnce());
		rerender({ url: undefined });
		await act(async () => {
			release({ stale: true });
			await Promise.resolve();
		});
		expect(result.current).toEqual({ isLoading: false });
	});
	it("controller de busca combina resultado e abertura do modal", async () => {
		vi.mocked(apiService).mockResolvedValue([]);
		const { result } = renderHook(
			() => useAddressSearchController("/addresses"),
			{ wrapper: QueryClientProvider },
		);
		await waitFor(() => expect(result.current.data).toEqual([]));
		act(() => result.current.open());
		expect(result.current.isOpen).toBe(true);
		act(() => result.current.close());
		expect(result.current.isOpen).toBe(false);
	});
});
