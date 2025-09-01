package com.valhko.userservice.user;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecs {

    public static Specification<User> containsFirstName(String providedFirstName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), "%" + providedFirstName.toLowerCase() + "%");
    }

    public static Specification<User> containsLastName(String providedLastName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), "%" + providedLastName.toLowerCase() + "%");
    }

    public static Specification<User> containsFullName(String providedFullName) {
        return (root, query, criteriaBuilder) ->
        {
            String pattern = "%" + providedFullName.toLowerCase() + "%";

            Expression<String> expression = criteriaBuilder.lower(
                    criteriaBuilder.concat(
                            criteriaBuilder.concat(root.get("firstName"), " "),
                            root.get("lastName")
                    )
            );
            return criteriaBuilder.like(expression, pattern);
        };
    }

    public static Specification<User> containsUsername(String providedUsername) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .like(criteriaBuilder.lower(root.get("username")), "%" + providedUsername.toLowerCase() + "%");
    }
}
