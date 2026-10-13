import { z } from "zod";
export const unknownPlate = () => z.string().min(1, "Campo obrigatório");
