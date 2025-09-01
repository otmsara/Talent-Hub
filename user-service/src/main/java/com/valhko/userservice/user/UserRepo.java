package com.valhko.userservice.user;

import io.micrometer.observation.annotation.Observed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource
@Observed
public interface UserRepo extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Page<User> findByNetworkedNetworkedId(String id, Pageable pageable);

    Page<User> findByNetworkingNetworkingId(String id, Pageable pageable);

    @Query(value = """
            SELECT suggestion.id
            FROM Network n1
            JOIN n1.networked personCurrentUserFollows
            JOIN personCurrentUserFollows.networking n2
            JOIN n2.networked suggestion
            LEFT JOIN suggestion.networked order_metric_collection
            WHERE n1.networking.id = :currentUserId
              AND suggestion.id <> :currentUserId
              AND suggestion.id NOT IN (
                  SELECT nw_inner.networked.id
                  FROM Network nw_inner
                  WHERE nw_inner.networking.id = :currentUserId
              )
            GROUP BY suggestion.id, suggestion.createdAt
            ORDER BY
                COUNT(DISTINCT order_metric_collection.id) DESC,
                suggestion.createdAt DESC
            """)
    Page<String> findFriendsOfFriendsSuggestionIdsByUserId(
            @Param("currentUserId") String currentUserId,
            Pageable pageable
    );

    @Query(value = """
            SELECT u
            FROM User u
            LEFT JOIN Network existing_follow
                ON existing_follow.networking.id = :currentUserId AND existing_follow.networked.id = u.id
            WHERE u.id <> :currentUserId
            ORDER BY
                SIZE(u.networked) DESC,
                u.createdAt DESC
            """)
    Page<User> findPopularUsers(
            @Param("currentUserId") String currentUserId,
            Pageable pageable
    );

    Optional<User> findByUsernameOrId(String username, String s);

    List<User> findByIdIn(List<String> ids);
}