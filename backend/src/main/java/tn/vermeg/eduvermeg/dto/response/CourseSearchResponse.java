package tn.vermeg.eduvermeg.dto.response;

import lombok.AllArgsConstructor; import lombok.Data;
import java.util.List;

@Data @AllArgsConstructor
public class CourseSearchResponse {
    private long totalHits;
    private int page;
    private int size;
    private List<CourseSearchHit> hits;
}
