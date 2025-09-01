package com.valhko.postservice.post;

import com.valhko.postservice.post.util.PostStatus;
import com.valhko.postservice.post.util.PostType;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class PostSpecs {

    public static Specification<Post> containsContent(String providedContent) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("content")), "%" + providedContent.toLowerCase() + "%");
    }

    public static Specification<Post> belongsToUserId(String providedUserId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("postedById"), providedUserId);
    }

    public static Specification<Post> hasStatus(PostStatus postStatus) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), postStatus));
    }

    public static Specification<Post> hasPublicStatus() {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), PostStatus.PUBLIC));
    }

    public static Specification<Post> hasType(PostType postType) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("type"), postType));
    }

    public static Specification<Post> isDeleted(boolean value) {
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("deleted"), value));
    }

    public static Specification<Post> matchesAnyInterest(List<String> interests) {
        if (CollectionUtils.isEmpty(interests)) {
            return null;
        }
        return (root, query, cb) -> {
            var predicates = interests.stream()
                    .map(interest -> cb.like(cb.lower(root.get("content")), "%" + interest.toLowerCase() + "%"))
                    .toArray(Predicate[]::new);
            return cb.or(predicates);
        };
    }

    public static Specification<Post> isVisibleToUser(String currentUserId, Set<String> networkIds) {
        return (root, query, cb) -> {
            // Condition 1: Post is public (not networking-only)
            Predicate publicPost = cb.isFalse(root.get("isNetworkingOnly"));

            // Condition 2: Post is by the current user
            Predicate ownPost = cb.equal(root.get("postedById"), currentUserId);

            // Condition 3: Post is from someone in the user's network AND isNetworkingOnly = true
            Predicate networkPost = cb.and(
                    cb.isTrue(root.get("isNetworkingOnly")),
                    root.get("postedById").in(networkIds)
            );

            // A post is visible if it's the user's own post OR it's public OR it's a network post.
            // Note: ownPost check is implicitly covered by networkPost if user's own ID is in networkIds,
            // but making it explicit is clearer and safer.
            return cb.or(ownPost, publicPost, networkPost);
        };
    }

    public static Specification<Post> sortByPopularity() {
        return (root, query, cb) -> {
            // This check is crucial! It prevents adding ORDER BY to count queries used for pagination.
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                Expression<Integer> popularityScore = cb.sum(
                        cb.size(root.get("agrees")),
                        cb.size(root.get("comments"))
                );
                // Order by the calculated score, then by creation date as a tie-breaker.
                query.orderBy(cb.desc(popularityScore), cb.desc(root.get("createdAt")));
            }
            return cb.conjunction();
        };
    }

    public static Specification<Post> createdAfter(LocalDateTime since) {
        if (since == null) {
            return Specification.where(null); // Return a non-filtering spec if no date is provided
        }
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), since);
    }
}
