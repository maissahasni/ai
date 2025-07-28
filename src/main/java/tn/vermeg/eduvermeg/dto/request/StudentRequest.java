package tn.vermeg.eduvermeg.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@AllArgsConstructor
@Getter
@Setter
public class StudentRequest {
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
}
