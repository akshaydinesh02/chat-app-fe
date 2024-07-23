import { z } from "zod";

export const emailSchemaBase = z
  .string({ required_error: "Email ID is required" })
  .email({
    message: "Please enter a valid email address.",
  });

export const createEmailComparisonSchema = (userEmail: string) => {
  return emailSchemaBase.refine((email) => email !== userEmail, {
    message: "Invitee's email ID cannot be the same your email ID",
  });
};
