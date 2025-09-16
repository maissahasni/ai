package tn.vermeg.eduvermeg.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

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
@Indexed
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @FullTextField(analyzer = "standard")
    @KeywordField(name = "courseName_sort", normalizer = "lowercase", sortable = Sortable.YES)
    private String courseName;
    @FullTextField(analyzer = "standard")
    private String description;
    @GenericField
    private int duration;
    @GenericField
    private LocalDate startDate;
    @GenericField
    private LocalDate endDate;
    @OneToMany(mappedBy = "course")
    private Set<Enrollment> enrollments;

}
