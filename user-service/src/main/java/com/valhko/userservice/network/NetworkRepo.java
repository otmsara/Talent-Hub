package com.valhko.userservice.network;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface NetworkRepo extends JpaRepository<Network, String> {
    Optional<Network> findByNetworkedIdAndNetworkingId(String networkedId, String networkingId);

    boolean existsByNetworkedIdAndNetworkingId(String networkedId, String networkingId);

    int deleteByNetworkedIdAndNetworkingId(String networkedId, String networkingId);

    @Query("SELECT n.networking.id FROM Network n WHERE n.networked.id = :networkedId AND n.networking.id IN :networkingIds")
    Set<String> findNetworkingIdsWhereNetworkedIs(@Param("networkedId") String networkedId, @Param("networkingIds") Collection<String> networkingIds);

    @Query("SELECT n.networked.id FROM Network n WHERE n.networked.id IN :networkedIds AND n.networking.id = :networkingId")
    Set<String> findNetworkedIdsWhereNetworkingIs(@Param("networkedIds") Collection<String> networkedIds, @Param("networkingId") String networkingId);

    List<Network> findByNetworkedIdAndNetworkingIdIn(String currentUser, Set<String> users);

    default Map<String, Boolean> findByNetworkedIdAndNetworkingIdInDefault(String currentUser, Set<String> users) {
        var map = new HashMap<String, Boolean>();
        var items = findByNetworkedIdAndNetworkingIdIn(currentUser, users);
        var mapKeyAsUserId = new HashMap<String, Network>();

        items.forEach(e -> {
            mapKeyAsUserId.put(e.getNetworking().getId(), e);
        });

        users.forEach(e -> {
            map.put(e, mapKeyAsUserId.get(e) != null);
        });

        return map;
    }

    List<Network> findByNetworkedId(String userId);
}