package tn.vermeg.eduvermeg.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.vermeg.eduvermeg.dto.request.EnrollmentRequest;
import tn.vermeg.eduvermeg.dto.response.EnrollmentResponse;
import tn.vermeg.eduvermeg.entity.Course;
import tn.vermeg.eduvermeg.entity.Enrollment;
import tn.vermeg.eduvermeg.entity.Student;
import tn.vermeg.eduvermeg.exceptions.ResourceNotFoundException;
import tn.vermeg.eduvermeg.repository.CourseRepository;
import tn.vermeg.eduvermeg.repository.EnrollmentRepository;
import tn.vermeg.eduvermeg.repository.StudentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;
    @Override
    public EnrollmentResponse createEnrollment(EnrollmentRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "Id", request.getStudentId()));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "Id", request.getCourseId()));

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollDate(request.getEnrollDate());
        enrollment.setCompletionStatus(request.getCompletionStatus());
        enrollment.setGrade(request.getGrade());
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return new EnrollmentResponse(savedEnrollment);
    }

    @Override
    public EnrollmentResponse updateEnrollment(Long id, EnrollmentRequest request) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "Id", id));
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "Id", request.getStudentId()));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "Id", request.getCourseId()));

        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollDate(request.getEnrollDate());
        enrollment.setCompletionStatus(request.getCompletionStatus());
        enrollment.setGrade(request.getGrade());

        Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);
        return new EnrollmentResponse(updatedEnrollment);
    }

    @Override
    public List<EnrollmentResponse> getEnrollment() {
        return enrollmentRepository.findAll()
                .stream()
                .map(EnrollmentResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    public EnrollmentResponse getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "Id", id));
        return new EnrollmentResponse(enrollment);
    }

    @Override
    public void deleteEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "Id", id));
        enrollmentRepository.delete(enrollment);
    }
}
