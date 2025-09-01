package com.valhko.api_gateway.security;

import com.valhko.api_gateway.auth.dto.AuthResponse;
import com.valhko.api_gateway.auth.dto.SsoLoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.net.URI;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements ServerAuthenticationSuccessHandler {

    private final RestTemplate restTemplate;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public Mono<Void> onAuthenticationSuccess(WebFilterExchange webFilterExchange, Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // (e.g., "google", "azure")
        String provider = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

        String providerId = oAuth2User.getName();
        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        // If first/last name isn't provided, parse the full name
        if (firstName == null) {
            String fullName = oAuth2User.getAttribute("name");
            if (fullName != null) {
                int firstSpace = fullName.indexOf(" ");
                if (firstSpace != -1) {
                    firstName = fullName.substring(0, firstSpace);
                    lastName = fullName.substring(firstSpace + 1);
                } else {
                    firstName = fullName;
                }
            }
        }

        SsoLoginRequest ssoRequest = new SsoLoginRequest(providerId, email, firstName, lastName, provider);

        return Mono.fromCallable(() -> {
                    String url =  "http://user-service/internal/auth/sso-login";
                    return restTemplate.postForObject(url, ssoRequest, AuthResponse.class);
                })
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(tokenResponse -> {
                    String jwt = tokenResponse.getAccessToken();
                    URI redirect = UriComponentsBuilder.fromUriString(redirectUri)
                            .queryParam("token", jwt)
                            .build().toUri();

                    var response = webFilterExchange.getExchange().getResponse();
                    response.setStatusCode(HttpStatus.SEE_OTHER);
                    response.getHeaders().setLocation(redirect);
                    return response.setComplete();
                });
    }
}