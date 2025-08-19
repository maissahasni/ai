package tn.vermeg.eduvermeg.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.vermeg.eduvermeg.dto.request.EnrollmentRequest;
import tn.vermeg.eduvermeg.dto.response.EnrollmentResponse;
import tn.vermeg.eduvermeg.service.EnrollmentService;

import java.util.List;

@RestController
@RequestMapping("/api/enrollment")
@CrossOrigin("*")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;
    @PostMapping
    public EnrollmentResponse addEnrollment(@RequestBody EnrollmentRequest enrollmentRequest) {
        return enrollmentService.createEnrollment(enrollmentRequest);
    }
    @PutMapping("/{id}")
    public EnrollmentResponse updateEnrollment(@PathVariable Long id, @RequestBody EnrollmentRequest enrollmentRequest) {
        return enrollmentService.updateEnrollment(id, enrollmentRequest);
    }
    @GetMapping
    public List<EnrollmentResponse> getAllEnrollment() {
        return enrollmentService.getEnrollment();
    }
    @GetMapping("/{id}")
    public EnrollmentResponse getEnrollment(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id);
    }
    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }

}
