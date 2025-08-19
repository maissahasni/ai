package tn.vermeg.eduvermeg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.vermeg.eduvermeg.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
}
