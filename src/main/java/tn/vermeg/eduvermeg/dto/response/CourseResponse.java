package tn.vermeg.eduvermeg.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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
}
