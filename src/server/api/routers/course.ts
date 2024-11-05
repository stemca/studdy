import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { coursesTable } from "~/server/db/schema";
import { courseSchema } from "~/server/validators/course";
import { authedProcedure, createTRPCRouter } from "../trpc";

/**
 * Update course (protected)
 * Delete course (protected)
 */
export const courseRouter = createTRPCRouter({
  getCourses: authedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    // @TODO: pagination
    const courses = await db.query.coursesTable.findMany({
      where: eq(coursesTable.userId, user.id),
    });

    return courses;
  }),
  getCourseById: authedProcedure
    .input(
      z.object({
        courseId: z.string().cuid2(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;

      const course = await db.query.coursesTable.findFirst({
        where: and(
          eq(coursesTable.id, input.courseId),
          eq(coursesTable.userId, user.id),
        ),
      });

      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }

      return course;
    }),
  createCourse: authedProcedure
    .input(courseSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("Creating course in server", input);
      const { db, user } = ctx;

      const courses = await db
        .insert(coursesTable)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();
      console.log(courses);
      return courses[0];
    }),
});
