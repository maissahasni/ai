package tn.vermeg.eduvermeg.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@AllArgsConstructor
@Getter
@Setter
public class CourseRequest {
    private String courseName;
    private String description;
    private int duration;
    private LocalDate startDate;
    private LocalDate endDate;
}
