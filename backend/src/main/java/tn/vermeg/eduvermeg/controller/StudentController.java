package tn.vermeg.eduvermeg.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.vermeg.eduvermeg.dto.request.StudentRequest;
import tn.vermeg.eduvermeg.dto.response.StudentResponse;
import tn.vermeg.eduvermeg.service.StudentService;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin("*")
public class StudentController {
    @Autowired
    private StudentService studentService;
    @PostMapping
    public StudentResponse addStudent(@RequestBody StudentRequest studentRequest) {
        return studentService.createStudent(studentRequest);
    }
    @PutMapping("/{id}")
    public StudentResponse updateStudent(@PathVariable Long id, @RequestBody StudentRequest studentRequest) {
        return studentService.updateStudent(id, studentRequest);
    }
    @GetMapping
    public List<StudentResponse> getAllStudents() {
        return studentService.getStudents();
    }
    @GetMapping("/{id}")
    public StudentResponse getStudent(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}
