import { z } from "zod";

const htmlDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const educationSchema = z
  .object({
    major: z
      .string()
      .trim()
      .min(1, { message: "Major is required" })
      .max(120, { message: "Must be 120 characters or fewer" }),
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
    path: ["end_date"],
  });

export type EducationSchemaValues = z.infer<typeof educationSchema>;
