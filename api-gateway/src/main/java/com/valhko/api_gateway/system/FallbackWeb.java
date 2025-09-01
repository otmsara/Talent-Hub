package com.valhko.api_gateway.system;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/fallback")
public class FallbackWeb {

    private static final String message = "The service is currently unavailable. Please try again later.";

    @GetMapping
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Mono<String> fallbackGet() {
        return Mono.just(message);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Mono<String> fallbackPost() {
        return Mono.just(message);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Mono<String> fallbackPut() {
        return Mono.just(message);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Mono<String> fallbackDelete() {
        return Mono.just(message);
    }

    @PatchMapping
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Mono<String> fallbackPatch() {
        return Mono.just(message);
    }
}
