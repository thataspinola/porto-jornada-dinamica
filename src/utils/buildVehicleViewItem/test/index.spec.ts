import { buildVehicleViewItem } from "@/utils/buildVehicleViewItem/index";
test("buildVehicleViewItem: transforma entrada sem incluir dados extras", () => {
	expect(
		buildVehicleViewItem({ id: "1", model: "Uno", brand: "Fiat" }),
	).toEqual({ item_id: "1", item_name: "Uno", item_brand: "Fiat" });
});
