package tn.vermeg.eduvermeg.service;

import tn.vermeg.eduvermeg.dto.request.StudentRequest;
import tn.vermeg.eduvermeg.dto.response.StudentResponse;
import tn.vermeg.eduvermeg.entity.Student;

import java.util.List;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(Long id,StudentRequest request);
    List<StudentResponse> getStudents();
    StudentResponse getStudentById(Long id);
    void deleteStudent(Long id);
}
