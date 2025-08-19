package tn.vermeg.eduvermeg.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import tn.vermeg.eduvermeg.entity.Course;
import tn.vermeg.eduvermeg.entity.Enrollment;
import tn.vermeg.eduvermeg.entity.Student;

import java.time.LocalDate;

@Getter
@Setter
public class EnrollmentResponse {
    private Long id;
    private StudentResponse student;
    private CourseResponse course;
    private LocalDate enrollDate;
    private String completionStatus;
    private Double grade;

    public EnrollmentResponse(Enrollment enrollment) {
        this.student = new StudentResponse(enrollment.getStudent());
        this.course = new CourseResponse(enrollment.getCourse());
        this.id = enrollment.getId() ;
        this.enrollDate = enrollment.getEnrollDate();
        this.completionStatus =enrollment.getCompletionStatus() ;
        this.grade = enrollment.getGrade() ;
    }
}
