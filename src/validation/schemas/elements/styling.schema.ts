import { z } from "zod";
export const elementStyleSchema = z.record(z.string(), z.union([z.string(), z.number()]));
