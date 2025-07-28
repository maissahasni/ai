package tn.vermeg.eduvermeg.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EnrollmentResponse {
    private Long studentId;
    private Long courseId;
    private LocalDate enrollDate;
    private String completionStatus;
    private Double grade;
}
