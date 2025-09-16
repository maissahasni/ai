package tn.vermeg.eduvermeg.service;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.hibernate.search.engine.search.predicate.SearchPredicate;
import org.hibernate.search.engine.search.predicate.dsl.BooleanPredicateClausesStep;
import org.hibernate.search.engine.search.predicate.dsl.SearchPredicateFactory;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.stereotype.Service;
import tn.vermeg.eduvermeg.dto.request.CourseSearchRequest;
import tn.vermeg.eduvermeg.dto.response.CourseSearchHit;
import tn.vermeg.eduvermeg.dto.response.CourseSearchResponse;
import tn.vermeg.eduvermeg.entity.Course;


import java.time.LocalDate;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseSearchService {

    private final EntityManager em;
    private final DatamuseClient datamuse;

    public CourseSearchResponse search(CourseSearchRequest req) {
        SearchSession session = Search.session(em.unwrap(Session.class));

        // 1) Semantic expansion (Datamuse)
        List<String> expanded = datamuse.expand(req.getQ(), 8); // original + ~8 related terms
        String original = (req.getQ() == null) ? null : req.getQ().trim();

        // 2) Build weighted boolean predicate using a factory
        var scope = session.scope(Course.class);
        SearchPredicateFactory f = scope.predicate();

        SearchPredicate predicate = f.bool(b -> {
            // Text clause (weighted)
            if (original != null && !original.isEmpty()) {
                b.must(textClause(f, original, 3.5f, 2.5f)); // exact outranks
            }
            // Synonyms as SHOULD with lower boosts
            for (String syn : expanded) {
                if (original != null && syn.equalsIgnoreCase(original)) continue;
                b.should(textClause(f, syn, 1.2f, 0.8f));
            }

            // Numeric/date filters
            rangeInt(b, "duration", req.getMinDuration(), req.getMaxDuration());
            rangeDate(b, "startDate", req.getStartFrom(), req.getStartTo());
            rangeDate(b, "endDate",   req.getEndFrom(),   req.getEndTo());
        }).toPredicate();

        // 3) Execute (relevance + tie-break by courseName_sort)
        int page = req.getPage() == null ? 0 : req.getPage();
        int size = req.getSize() == null ? 12 : req.getSize();

        var result = session.search(Course.class)
                .select(sf -> sf.composite(
                        (course, score) -> new AbstractMap.SimpleEntry<>(course, score),
                        sf.entity(),
                        sf.score()
                ))
                .where(predicate)
                .sort(sf -> sf.composite()
                        .add(sf.score())                     // relevance first
                        .add(sf.field("courseName_sort").asc())    // deterministic alpha for ties
                )
                .fetch(page * size, size);

        // Build DTOs
        List<CourseSearchHit> hits = new ArrayList<>(result.hits().size());
        for (var entry : result.hits()) {
            Course c = entry.getKey();
            Float score = entry.getValue(); // nullable Float
            hits.add(CourseSearchHit.of(c, score == null ? 0f : score));
        }

        return new CourseSearchResponse(result.total().hitCount(), page, size, hits);
    }

    /** Text clause: name > description, with phrase boost on name */
    private SearchPredicate textClause(SearchPredicateFactory f, String text,
                                       float nameBoost, float descBoost) {
        return f.bool(b -> {
            b.should(
                    f.match().field("courseName").matching(text).boost(nameBoost)
            );
            b.should(
                    f.match().field("description").matching(text).boost(descBoost)
            );
            // phrase/proximity boost on courseName
            b.should(
                    f.phrase().field("courseName").matching(text).slop(2).boost(nameBoost + 1.0f)
            );
        }).toPredicate();
    }

    /** Integer range helper (inclusive) */
    private void rangeInt(BooleanPredicateClausesStep<?> b, String field, Integer min, Integer max) {
        if (min == null && max == null) return;

        if (min != null && max != null) {
            b.filter(f -> f.range().field(field).between(min, max));   // inclusive
        } else if (min != null) {
            b.filter(f -> f.range().field(field).atLeast(min));        // >= min
        } else {
            b.filter(f -> f.range().field(field).atMost(max));         // <= max
        }
    }

    /** LocalDate range helper (inclusive) */
    private void rangeDate(BooleanPredicateClausesStep<?> b, String field, LocalDate from, LocalDate to) {
        if (from == null && to == null) return;

        if (from != null && to != null) {
            b.filter(f -> f.range().field(field).between(from, to));   // inclusive
        } else if (from != null) {
            b.filter(f -> f.range().field(field).atLeast(from));       // >= from
        } else {
            b.filter(f -> f.range().field(field).atMost(to));          // <= to
        }
    }
}