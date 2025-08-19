package tn.vermeg.eduvermeg.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import tn.vermeg.eduvermeg.entity.Student;

import java.time.LocalDate;

@Getter
@Setter
public class StudentResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private LocalDate registrationDate;
    public StudentResponse(Student student) {
        this.id = student.getId();
        this.firstName = student.getFirstName();
        this.lastName = student.getLastName();
        this.email = student.getEmail();
        this.registrationDate = student.getRegistrationDate();
        this.dateOfBirth=student.getDateOfBirth();
    }
}
