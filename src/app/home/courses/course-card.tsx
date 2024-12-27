import type { Course } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="w-full max-w-[350px]">
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription>{course.code}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* start date - end date */}
        <div>
          <p>
            {course.startDate.toLocaleDateString()} -
            {course.endDate.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex space-x-3">
        {/* edit and delete buttons */}
        <Button className="flex-1">Edit</Button>
        <Button className="flex-1" variant="neutral">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
