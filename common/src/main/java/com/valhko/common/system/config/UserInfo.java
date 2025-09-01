package com.valhko.common.system.config;

import java.util.Set;

public record UserInfo(String userId, String email, Set<String> roles) {
}