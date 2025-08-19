package tn.vermeg.eduvermeg.service;

import tn.vermeg.eduvermeg.dto.request.CourseRequest;
import tn.vermeg.eduvermeg.dto.response.CourseResponse;

import java.util.List;

public interface CourseService {
    CourseResponse createCourse (CourseRequest request);
   CourseResponse updateCourse (Long id,CourseRequest request);
    List<CourseResponse> getCourse();
   CourseResponse getCourseById(Long id);
    void deleteCourse(Long id);

}
