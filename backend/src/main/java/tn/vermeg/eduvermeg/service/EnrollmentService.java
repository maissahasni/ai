package tn.vermeg.eduvermeg.service;
import tn.vermeg.eduvermeg.dto.request.EnrollmentRequest;
import tn.vermeg.eduvermeg.dto.response.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {
    EnrollmentResponse createEnrollment (EnrollmentRequest request);
    EnrollmentResponse updateEnrollment(Long id,EnrollmentRequest request);
    List<EnrollmentResponse> getEnrollment();
    EnrollmentResponse getEnrollmentById(Long id);
    void deleteEnrollment(Long id);
}
