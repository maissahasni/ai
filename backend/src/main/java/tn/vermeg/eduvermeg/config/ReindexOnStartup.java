package tn.vermeg.eduvermeg.config;

import jakarta.persistence.EntityManagerFactory;
import org.hibernate.SessionFactory;
import org.hibernate.search.mapper.orm.Search;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class ReindexOnStartup {

    @Bean
    ApplicationRunner rebuildIndexes(EntityManagerFactory emf) {
        return args -> {
            var sf = emf.unwrap(SessionFactory.class);
            try (var session = sf.openSession()) {
                Search.session(session)
                        .massIndexer()                 // all indexed types; or .types(Course.class)
                        .typesToIndexInParallel(1)
                        .threadsToLoadObjects(4)
                        .startAndWait();
            }
        };
    }
}
