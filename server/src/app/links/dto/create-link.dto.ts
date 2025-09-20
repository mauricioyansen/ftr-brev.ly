import { z } from "zod";

export const createLinkSchema = z.object({
  url: z.url({ message: "URL fornecida é inválida." }),
  code: z
    .string()
    .min(3, { message: "O código deve ter no mínimo 3 caracteres." })
    .max(50, { message: "O código pode ter no máximo 50 caracteres." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "O código pode conter apenas letras, números, _ e -.",
    })
    .optional(),
});

export type CreateLinkDto = z.infer<typeof createLinkSchema>;
