"use server";

import { TRPCError } from "@trpc/server";

import type { CreateCourse } from "~/server/validators/course";
import { api } from "~/trpc/server";

export const createCourseAction = async (data: CreateCourse) => {
  console.log("Creating course", data);
  try {
    const body = { ...data };
    const response = await api.course.createCourse(body);
    if (!response) {
      return { message: "Failed to create course" };
    }

    return { message: undefined };
  } catch (error) {
    if (error instanceof TRPCError) {
      return { message: error.message };
    }

    return { message: "Something went wrong, please try again later." };
  }
};
