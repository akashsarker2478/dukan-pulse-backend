import z from "zod";

const registerZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "name is required"
            : "name must be a string",
      })
      .min(2, { error: "name must me at least 2 character" }),

    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? "email is required"
          : "invalid email address",
    }),

    password: z
      .string({ error: "password is required" })
      .min(6, { error: "password at least 6 character" }),

    phone: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "phone number is required"
            : "invalid phone number",
      })
      .min(11, { error: "phone number must be eleven digits" }),

    storeName: z
      .string({
        error: "Store name is required",
      })
      .min(2, { error: "Store name must be at least 2 characters" }),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? "email is required"
          : "invalid email address",
    }),

    password: z
      .string({ error: "password is required" })
      .min(6, { error: "password at least 6 character" }),
  }),
});

export const authValidation = {
  registerZodSchema,
  loginZodSchema,
};
