package tn.vermeg.eduvermeg.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import tn.vermeg.eduvermeg.entity.Course;

import java.time.LocalDate;

@Getter
@Setter
public class CourseResponse {
    private Long id;
    private String courseName;
    private String description;
    private int duration;
    private LocalDate startDate;
    private LocalDate endDate;

    public CourseResponse(Course course) {
        this.id = course.getId();
        this.courseName = course.getCourseName();
        this.description = course.getDescription();
        this.duration =course.getDuration() ;
        this.startDate = course.getStartDate();
        this.endDate = course.getEndDate();
    }
}
