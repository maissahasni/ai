package tn.vermeg.eduvermeg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.vermeg.eduvermeg.dto.request.StudentRequest;
import tn.vermeg.eduvermeg.dto.response.StudentResponse;
import tn.vermeg.eduvermeg.entity.Student;
import tn.vermeg.eduvermeg.exceptions.ResourceNotFoundException;
import tn.vermeg.eduvermeg.repository.CourseRepository;
import tn.vermeg.eduvermeg.repository.StudentRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService{
    @Autowired
    private StudentRepository studentRepository;
    @Override
    public StudentResponse createStudent(StudentRequest request) {
        Student student = new Student();
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setRegistrationDate(LocalDate.now());
        Student savedStudent = studentRepository.save(student);
        return new StudentResponse(savedStudent);
    }

    @Override
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Student","Id",id));
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setDateOfBirth(request.getDateOfBirth());
        return new StudentResponse(studentRepository.save(student));
    }

    @Override
    public List<StudentResponse> getStudents() {
        return studentRepository.findAll().stream().map(StudentResponse::new).collect(Collectors.toList());
    }

    @Override
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Student","Id",id));
        return new StudentResponse(student);
    }

    @Override
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Student","Id",id));
        studentRepository.delete(student);
    }
}
