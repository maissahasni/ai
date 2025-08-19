package tn.vermeg.eduvermeg.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@AllArgsConstructor
@Getter
@Setter
public class EnrollmentRequest {
    private Long studentId;
    private Long courseId;
    private LocalDate enrollDate;
    private String completionStatus;
    private Double grade;
}
