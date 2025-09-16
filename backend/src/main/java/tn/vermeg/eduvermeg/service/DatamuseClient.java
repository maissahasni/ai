package tn.vermeg.eduvermeg.service;


import lombok.Data;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DatamuseClient {

    private final RestTemplate http = new RestTemplate();

    @Data
    public static class DatamuseWord {
        private String word;
        private Integer score;
        private Integer numSyllables;
        private List<String> tags;
    }

    /**
     * Get top N synonyms/related terms for a query using Datamuse.
     * - We mix 'ml' (meaning like) + 'rel_syn' (synonyms)
     * - De-duplicated, lowercased
     */
    public List<String> expand(String query, int maxTerms) {
        if (query == null || query.isBlank()) return Collections.emptyList();
        String q = query.trim();

        List<DatamuseWord> ml = call("ml", q, maxTerms);
        List<DatamuseWord> syn = call("rel_syn", q, maxTerms);

        LinkedHashSet<String> terms = new LinkedHashSet<>();
        terms.add(q.toLowerCase());
        ml.forEach(w -> terms.add(w.getWord().toLowerCase()));
        syn.forEach(w -> terms.add(w.getWord().toLowerCase()));

        // drop the original at head, keep synonyms next (we’ll weight).
        return terms.stream().limit(Math.max(maxTerms + 1, 5)).collect(Collectors.toList());
    }

    private List<DatamuseWord> call(String key, String query, int max) {
        String url = UriComponentsBuilder.fromHttpUrl("https://api.datamuse.com/words")
                .queryParam(key, query)
                .queryParam("max", max)
                .toUriString();
        DatamuseWord[] res = http.getForObject(url, DatamuseWord[].class);
        return res == null ? List.of() : Arrays.asList(res);
    }
}