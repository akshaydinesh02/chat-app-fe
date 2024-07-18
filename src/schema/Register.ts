import { z } from "zod";

export const registerSchema = z
  .object({
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
    confirmPin: z
      .string({
        required_error: "Confirm PIN is required",
        invalid_type_error: "Only numbers are allowed.",
      })
      .length(4, {
        message: "Confirm PIN should have exactly 4 numbers",
      })
      .refine((val) => /^\d+$/.test(val), {
        message: "Confirm PIN should only contain numbers",
      }),
  })
  .refine((data) => data.pin === data.confirmPin, {
    path: ["confirmPin"],
    message: "Oops! PIN and Confirm PIN don't match",
  });
