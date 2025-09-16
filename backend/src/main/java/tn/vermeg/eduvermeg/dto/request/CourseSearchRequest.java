package tn.vermeg.eduvermeg.dto.request;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

@Data
public class CourseSearchRequest {
    private String q;                 // search text

    private Integer minDuration;      // numeric filters
    private Integer maxDuration;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startFrom;      // date filters

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startTo;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endFrom;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endTo;

    private Integer page = 0;
    private Integer size = 12;
}