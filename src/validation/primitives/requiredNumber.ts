import { z } from "zod";
export const requiredNumber = () =>
	z.number({ error: "Campo obrigatório" }).finite();
