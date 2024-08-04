import { z } from "zod";

export const roomIdSchema = z
  .string()
  .regex(/^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/, {
    message: "The room ID format should be xxx-xxx-xxx.",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Email is invalid" }),

  password: z.string().min(1, { message: "This is required" }),
});
