import { parseGoogleClientId } from "./index";
test("parseGoogleClientId: transforma entrada sem incluir dados extras", () => {
	expect(parseGoogleClientId("GA1.1.123.456")).toEqual("123.456");
});
