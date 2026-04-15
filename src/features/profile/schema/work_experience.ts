import { z } from "zod";

const htmlDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const optionalShortText = z
  .string()
  .trim()
  .min(1, {
    message: "This field cannot be empty",
  })
  .max(120, {
    message: "Must be 120 characters or fewer",
  });

export const workExperienceSchema = z
  .object({
    company: optionalShortText,
    position: optionalShortText,
    role: optionalShortText,
    title: optionalShortText,
    description: z
      .string()
      .trim()
      .min(1, { message: "Description is required" }),
    start_date: z
      .string()
      .min(1, { message: "Start date is required" })
      .regex(htmlDatePattern, { message: "Use a valid date" }),
    end_date: z
      .string()
      .regex(htmlDatePattern, { message: "Use a valid date" })
      .or(z.literal(""))
      .nullable(),
  })
  .refine((value) => !value.end_date || value.end_date >= value.start_date, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type WorkExperienceSchemaValues = z.infer<typeof workExperienceSchema>;
