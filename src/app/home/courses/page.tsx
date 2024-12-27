import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/server";
import CourseCard from "./course-card";
import CreateCourseForm from "./create-course-form";

// @TODO: Auto close dialog after creating course
// @TODO: optimistic updates after creatng course
export default async function CoursesPage() {
  const courses = await api.course.getCourses();

  return (
    <div className="h-full w-full px-4">
      {courses.length === 0 ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-4">
          <h1 className="text-2xl">No courses, add one!</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create course</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a course</DialogTitle>
                <DialogDescription>
                  Creating a course allows you to organize and manage the
                  content, schedule, and resources for a specific subject.
                </DialogDescription>
              </DialogHeader>
              <CreateCourseForm />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="h-full w-full">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create course</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a course</DialogTitle>
                <DialogDescription>
                  Creating a course allows you to organize and manage the
                  content, schedule, and resources for a specific subject.
                </DialogDescription>
              </DialogHeader>
              <CreateCourseForm />
            </DialogContent>
          </Dialog>

          <ul className="mt-4 flex flex-wrap space-x-3">
            {courses.map((course) => (
              <CourseCard course={course} key={course.id} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
