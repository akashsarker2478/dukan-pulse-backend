import z from "zod";

const nameRule = z
  .string({ error: "Store name is required" })
  .min(2, { error: "Store name must be at least 2 characters" });

const addressRule = z
  .string({ error: "Store address is required" })
  .min(5, { error: "Address must be at least 5 characters" });

const phoneRule = z
  .string({ error: "Phone number is required" })
  .regex(/^\d{11}$/, { error: "Phone number must be exactly 11 digits" });

const businessTypeRule = z.enum(
  ["GROCERY", "PHARMACY", "COSMETICS", "HARDWARE", "ELECTRONICS", "CLOTHING", "OTHER"],
  { error: "Business type is required and must be valid" },
);

const logoRule = z.url({ error: "Logo must be a valid URL" });

const vatRateRule = z
  .number({ error: "VAT rate must be a number" })
  .min(0, { error: "VAT rate cannot be negative" })
  .max(100, { error: "VAT rate cannot exceed 100" });

const createStoreZodSchema = z.object({
  body: z.object({
    name: nameRule,
    address: addressRule,
    phone: phoneRule,
    businessType: businessTypeRule,
    logo: logoRule.optional(),
    vatRate: vatRateRule.optional(),
  }),
});


const updateStoreZodSchema = z.object({
  body: z
    .object({
      name: nameRule,
      address: addressRule,
      phone: phoneRule,
      businessType: businessTypeRule,
      logo: logoRule,
      vatRate: vatRateRule,
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      error: "At least one field is required to update",
    }),
});

export const storeValidation = {
  createStoreZodSchema,
  updateStoreZodSchema,
};