package tn.vermeg.eduvermeg.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.vermeg.eduvermeg.dto.request.CourseRequest;
import tn.vermeg.eduvermeg.dto.request.CourseSearchRequest;
import tn.vermeg.eduvermeg.dto.response.CourseResponse;
import tn.vermeg.eduvermeg.dto.response.CourseSearchResponse;
import tn.vermeg.eduvermeg.service.CourseSearchService;
import tn.vermeg.eduvermeg.service.CourseService;

import java.util.List;

@RestController
@RequestMapping("/api/course")
@CrossOrigin("*")
public class CourseController {

     @Autowired
    private CourseService courseService;
     @Autowired
    private CourseSearchService service;
    @PostMapping
    public CourseResponse addCourse(@RequestBody CourseRequest courseRequest) {
        return courseService.createCourse(courseRequest);
    }
    @PutMapping("/{id}")
    public CourseResponse updateCourse(@PathVariable Long id, @RequestBody CourseRequest courseRequest) {
        return courseService.updateCourse(id, courseRequest);
    }
    @GetMapping
    public List<CourseResponse> getAllCourse() {
        return courseService.getCourse();
    }
    @GetMapping("/{id}")
    public CourseResponse getCourse(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }
    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }


    @PostMapping("/search")
    public CourseSearchResponse searchCourses(@RequestBody CourseSearchRequest req) {
        return service.search(req);
    }

}
