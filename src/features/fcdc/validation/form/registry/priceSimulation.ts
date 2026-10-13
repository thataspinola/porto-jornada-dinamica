import { z } from "zod";
export const priceSimulation = () =>
	z.number().positive("Informe um valor positivo");
