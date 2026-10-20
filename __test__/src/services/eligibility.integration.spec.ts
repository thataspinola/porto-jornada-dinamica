// @vitest-environment node
import { createServer, type Server } from "node:http";
import { once } from "node:events";
import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { callService } from "@/services/serviceRegistry";

let server: Server;
let url: string;
let status = 200;
let payload: unknown = { eligible: false };
let received: unknown;
beforeAll(async () => {
	server = createServer(async (request, response) => {
		let body = "";
		for await (const chunk of request) body += chunk;
		received = JSON.parse(body);
		response.writeHead(status, { "Content-Type": "application/json" });
		response.end(JSON.stringify(payload));
	});
	server.listen(0, "127.0.0.1");
	await once(server, "listening");
	const address = server.address();
	if (!address || typeof address === "string")
		throw new Error("Endereço indisponível");
	url = `http://127.0.0.1:${address.port}/eligibility`;
});
afterEach(() => {
	vi.unstubAllEnvs();
	status = 200;
	payload = { eligible: false };
});
afterAll(async () => {
	await new Promise<void>((resolve, reject) =>
		server.close((error) => (error ? reject(error) : resolve())),
	);
});
describe("registry → elegibilidade → HTTP", () => {
	it("propaga negativa CPF e envia dados reais ao adaptador HTTP", async () => {
		vi.stubEnv("ELIGIBILITY_URL", url);
		const input = { fields: { taxvat: "52998224725" } };
		expect(await callService("eligibility", input)).toMatchObject({
			success: false,
			code: "NOT_ELIGIBLE",
		});
		expect(received).toEqual(input);
	});
	it("aceita elegibilidade positiva", async () => {
		vi.stubEnv("ELIGIBILITY_URL", url);
		payload = { eligible: true, id: "test" };
		expect(await callService("eligibility", {})).toEqual({
			success: true,
			data: payload,
		});
	});
	it("rejeita resposta sem elegibilidade explícita", async () => {
		vi.stubEnv("ELIGIBILITY_URL", url);
		payload = {};
		expect(await callService("eligibility", {})).toMatchObject({
			success: false,
			code: "INVALID_RESPONSE",
		});
	});
	it("reconhece NOT_ELIGIBLE em erro HTTP", async () => {
		vi.stubEnv("ELIGIBILITY_URL", url);
		status = 422;
		payload = { code: "NOT_ELIGIBLE", message: "Indisponível" };
		expect(await callService("eligibility", {})).toMatchObject({
			success: false,
			code: "NOT_ELIGIBLE",
			message: "Indisponível",
		});
	});
	it("propaga falha HTTP sem simular aprovação", async () => {
		vi.stubEnv("ELIGIBILITY_URL", url);
		status = 500;
		payload = { code: "UNAVAILABLE" };
		expect(await callService("eligibility", {})).toMatchObject({
			success: false,
			code: "SERVICE_ERROR",
		});
	});
});
