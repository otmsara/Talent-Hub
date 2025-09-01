package com.valhko.api_gateway.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final String baseUrl = "/v1";
    @Value("${jwt.secret}")
    private String jwtSecret;
    private final JwtAuthenticationFilter JwtAuthenticationFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;
    private final RestApiAuthenticationEntryPoint restApiAuthenticationEntryPoint;
    private final String ADMIN_ROLE = "ADMIN";

    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) {
        return http
                .authorizeExchange(authorizeHttpRequests -> authorizeHttpRequests
                        .pathMatchers(baseUrl + "/users/auth/**").permitAll()
                        .pathMatchers(HttpMethod.POST, baseUrl + "/users").permitAll()
                        .pathMatchers(HttpMethod.GET, baseUrl + "/reports").hasRole(ADMIN_ROLE)
                        .pathMatchers(HttpMethod.GET, baseUrl + "/badges/requests").hasRole(ADMIN_ROLE)
                        .pathMatchers(HttpMethod.PATCH, baseUrl + "/badges/requests/**").hasRole(ADMIN_ROLE)
                        .pathMatchers(baseUrl + "/admin/**").hasRole(ADMIN_ROLE)
                        .pathMatchers("/ws-messages/**").permitAll()
                        .anyExchange().authenticated()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(restApiAuthenticationEntryPoint)
                )
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .cors(Customizer.withDefaults())
                .securityContextRepository(NoOpServerSecurityContextRepository.getInstance())
                .oauth2Login((oauth2) -> {
                    oauth2.authenticationSuccessHandler(oAuth2LoginSuccessHandler);
                    oauth2.authenticationFailureHandler(oAuth2LoginFailureHandler);
                })
                .addFilterBefore(JwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOriginPatterns(Collections.singletonList("*"));
        corsConfig.setAllowCredentials(true);
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/v1/**", corsConfig);

        return source;
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        SecretKeySpec secretKey = new SecretKeySpec(jwtSecret.getBytes(), "HS256");
        return NimbusReactiveJwtDecoder
                .withSecretKey(secretKey)
                .build();
    }

}