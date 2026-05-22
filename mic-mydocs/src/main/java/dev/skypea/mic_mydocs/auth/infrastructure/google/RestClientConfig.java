package dev.skypea.mic_mydocs.auth.infrastructure.google;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
class RestClientConfig {

    @Bean
    RestClient restClient() {
        return RestClient.create();
    }
}
