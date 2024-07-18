import { z } from "zod";

export const loginSchema = z.object({
  roomId: z.string({
    required_error: "Room ID is required",
  }),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, {
      message: "Name should be a minimum of 1 character.",
    })
    .max(20, {
      message: "Name can have up to 20 characters.",
    }),
  pin: z
    .string({
      required_error: "PIN is required",
      invalid_type_error: "Only numbers are allowed.",
    })
    .length(4, {
      message: "PIN should have exactly 4 numbers",
    })
    .refine((val) => /^\d+$/.test(val), {
      message: "PIN should only contain numbers",
    }),
});
