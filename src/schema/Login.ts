import { z } from "zod";

export const roomIdSchema = z
  .string()
  .regex(/^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/, {
    message: "The room ID format should be xxx-xxx-xxx.",
  });
