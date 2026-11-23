import z from "zod";

const nameRule = z
.string({error: "Category name is required"})
.trim()
.min(2,{ error: "Category name must be at least 2 characters" })
.max(50,{ error: "Category name cannot exceed 50 characters" });

const createCategoryZodSchema = z.object({
    body:z.object({
        name : nameRule
    }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    name: nameRule,
  }),
});

export const categoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};