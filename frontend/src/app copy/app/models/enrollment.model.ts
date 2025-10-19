import { Course } from "./course.model";
import { Student } from "./student.model";

export interface Enrollment {
    id?: number;
    studentId?: number;
    courseId?: number;
    student?: Student;
    course?: Course;
    enrollDate: string;
    completionStatus?: string;
    grade?: number;
}
