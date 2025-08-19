package tn.vermeg.eduvermeg.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.vermeg.eduvermeg.dto.request.CourseRequest;
import tn.vermeg.eduvermeg.dto.response.CourseResponse;
import tn.vermeg.eduvermeg.entity.Course;
import tn.vermeg.eduvermeg.exceptions.ResourceNotFoundException;
import tn.vermeg.eduvermeg.repository.CourseRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Override
    public CourseResponse createCourse(CourseRequest request) {
       Course course = new Course();
        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setDuration(request.getDuration());
        course.setStartDate(request.getStartDate());
        course.setEndDate(LocalDate.now());
        Course savedCourse = courseRepository.save(course);
        return new CourseResponse(savedCourse);

    }

    @Override
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Course","Id",id));
        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setDuration(request.getDuration());
        course.setStartDate(request.getStartDate());
        course.setEndDate(LocalDate.now());
        return new CourseResponse(courseRepository.save(course));
    }

    @Override
    public List<CourseResponse> getCourse() {
        return courseRepository.findAll().stream().map(CourseResponse::new).collect(Collectors.toList());
    }

    @Override
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Course","Id",id));
        return new CourseResponse(course);
    }

    @Override
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Course","Id",id));
        courseRepository.delete(course);


    }
}
