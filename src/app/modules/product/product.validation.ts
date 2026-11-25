import z from "zod";

const nameRule = z
  .string({ error: "product name is required" })
  .trim()
  .min(2, { error: "Product name must be at least 2 characters" })
  .max(100, { error: "Product name cannot exceed 100 characters" });

const descriptionRule = z
  .string({ error: "Description must be text" })
  .max(500, { error: "Description cannot exceed 500 characters" });

const skuRule = z
  .string({ error: "SKU is required" })
  .trim()
  .min(2, { error: "SKU must be at least 2 characters" })
  .max(50, { error: "SKU cannot exceed 50 characters" });

const priceRule = (label: string) =>
  z
    .number({ error: `${label} must be a number` })
    .min(0, { error: `${label} cannot be negative` });

const stockRule = z
  .number({ error: "Stock must be a number" })
  .int({ error: "Stock must be a whole number" })
  .min(0, { error: "Stock cannot be negative" });

const lowStockThresholdRule = z
  .number({ error: "Low stock threshold must be a number" })
  .int({ error: "Low stock threshold must be a whole number" })
  .min(0, { error: "Low stock threshold cannot be negative" });

const categoryIdRule = z.uuid({ error: "A valid categoryId is required" });

const createProductZodSchema = z.object({
  body: z.object({
    name: nameRule,
    description: descriptionRule.optional(),
    sku: skuRule,
    buyPrice: priceRule("Buy price"),
    sellPrice: priceRule("Sell price"),
    stock: stockRule.optional(),
    lowStockThreshold: lowStockThresholdRule.optional(),
    categoryId: categoryIdRule

  }),
});

const updateProductZodSchema = z.object({
  body: z
    .object({
      name: nameRule,
      description: descriptionRule,
      sku: skuRule,
      buyPrice: priceRule("Buy price"),
      sellPrice: priceRule("Sell price"),
      lowStockThreshold: lowStockThresholdRule,
      categoryId: categoryIdRule,
      isActive: z.boolean({ error: "isActive must be true or false" }),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      error: "At least one field is required to update",
    }),
});

export const productValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};