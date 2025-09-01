package com.valhko.jobservice.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor feignRequestInterceptor() {
        return template -> {
            // Configuration vide - pas d'en-tête Authorization
            // Les appels internes n'ont pas besoin d'authentification
        };
    }
}