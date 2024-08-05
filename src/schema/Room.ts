import { z } from "zod";

export const EmailBase = z
  .string({ required_error: "Email ID is required" })
  .email({
    message: "Please enter a valid email address.",
  });

export const CreateRoomSchema = (userEmail: string) => {
  return EmailBase.refine((email) => email !== userEmail, {
    message: "Invitee's email ID cannot be the same your email ID",
  });
};

export const JoinRoomSchema = z
  .string()
  .regex(/^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/, {
    message: "The room ID format should be xxx-xxx-xxx.",
  });
