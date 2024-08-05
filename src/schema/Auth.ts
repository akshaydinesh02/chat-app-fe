import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Email is invalid" }),

  password: z.string().min(1, { message: "This is required" }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    const errObj = {
      upperCase: {
        pass: true,
        message: "Password must contain at least one uppercase letter.",
      },
      lowerCase: {
        pass: true,
        message: "Password must contain at least one lowercase letter.",
      },
      specialCh: {
        pass: true,
        message: "Password must contain at least one special character.",
      },
      totalNumber: {
        pass: true,
        message: "Password must contain at least one number.",
      },
    };

    if (countOfLowerCase < 1) {
      errObj.lowerCase.pass = false;
    }
    if (countOfNumbers < 1) {
      errObj.totalNumber.pass = false;
    }
    if (countOfUpperCase < 1) {
      errObj.upperCase.pass = false;
    }
    if (countOfSpecialChar < 1) {
      errObj.specialCh.pass = false;
    }

    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    if (password !== confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });
