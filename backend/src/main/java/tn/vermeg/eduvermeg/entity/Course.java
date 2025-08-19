package tn.vermeg.eduvermeg.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Locale;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String courseName;
    private String description;
    private int duration;
    private LocalDate startDate;
    private LocalDate endDate;
    @OneToMany(mappedBy = "course")
    private Set<Enrollment> enrollments;

}
