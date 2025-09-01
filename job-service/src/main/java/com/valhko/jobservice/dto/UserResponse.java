package com.valhko.jobservice.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private String preferences;
    private LocalDate birthDate;
    private BigDecimal balance;
    private Integer networking;
    private Integer networked;
    private String title;
    private String country;
    private String city;
    private String jobCompany;
    private String bannerImageUrl;
    private String provider;
    private String providerId;
    private Boolean disabled;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public Long extractCompanyId() {
        if (jobCompany != null) {
            try {
                java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("\\((\\d+)\\)")
                        .matcher(jobCompany);
                if (matcher.find()) {
                    return Long.parseLong(matcher.group(1));
                }
            } catch (Exception e) {
                // Log warning
            }
        }

        if (preferences != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode node = mapper.readTree(preferences);
                if (node.has("companyId")) {
                    return node.get("companyId").asLong();
                }
            } catch (Exception e) {
                // Log warning
            }
        }

        return null;
    }

    public boolean isEnabled() {
        return Boolean.TRUE.equals(active) && !Boolean.TRUE.equals(disabled);
    }
}