import { z } from "zod";
export const plate = () => z.string().min(1, "Campo obrigatório");
