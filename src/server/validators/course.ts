import { z } from "zod";

export const courseSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required and cannot be empty" }),
    description: z.string().optional(),
    startDate: z.coerce.date({ required_error: "Start date is required" }),
    endDate: z.coerce.date({ required_error: "End date is required" }),
    credits: z.coerce.number().optional(),
    code: z.string().optional(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

export type CreateCourse = z.infer<typeof courseSchema>;
