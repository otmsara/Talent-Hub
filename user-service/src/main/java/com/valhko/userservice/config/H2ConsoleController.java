package com.valhko.userservice.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class H2ConsoleController {

    @GetMapping("/h2-console")
    public String redirectToH2Console() {
        return "forward:/h2-console/";
    }

    @GetMapping("/h2-console/**")
    public String redirectToH2ConsoleSubPaths() {
        return "forward:/h2-console/";
    }
}