package tn.vermeg.eduvermeg.config;

import org.apache.lucene.analysis.core.LowerCaseFilterFactory;
import org.apache.lucene.analysis.standard.StandardTokenizerFactory;
import org.hibernate.search.backend.lucene.analysis.LuceneAnalysisConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SearchAnalysisConfig {

    @Bean(name = "myLuceneConfigurer")
    public LuceneAnalysisConfigurer luceneAnalysisConfigurer() {
        return context -> {
            // Normalizer for Keyword fields (used in sorting): lowercase only
            context.normalizer("lowercase")
                    .custom()
                    .tokenFilter(LowerCaseFilterFactory.class);

            // Analyzer for FullText fields (your FullTextField "standard")
            context.analyzer("standard")
                    .custom()
                    .tokenizer(StandardTokenizerFactory.class)
                    .tokenFilter(LowerCaseFilterFactory.class);
        };
    }
}
