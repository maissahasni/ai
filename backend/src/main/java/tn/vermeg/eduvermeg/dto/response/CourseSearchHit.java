package tn.vermeg.eduvermeg.dto.response;

import lombok.AllArgsConstructor; import lombok.Data;
import tn.vermeg.eduvermeg.entity.Course;

@Data @AllArgsConstructor
public class CourseSearchHit {
    private Long id;
    private String courseName;
    private String description;
    private int duration;
    private String startDate;
    private String endDate;
    private float score; // relevance score

    public static CourseSearchHit of(Course c, float score) {
        return new CourseSearchHit(
                c.getId(), c.getCourseName(), c.getDescription(),
                c.getDuration(),
                c.getStartDate() == null ? null : c.getStartDate().toString(),
                c.getEndDate() == null ? null : c.getEndDate().toString(),
                score
        );
    }
}
