package com.valhko.common.client.userservice.network;

import com.valhko.common.client.userservice.UserServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class NetworkClientService {
    private final UserServiceClient userServiceClient;

    public Boolean existsByNetworkedIdAndNetworkingId(String currentUser, String otherUser) {
        var result = userServiceClient.existsByNetworkedIdAndNetworkingId(currentUser, otherUser);
        return result.getData();
    }

    public Map<String, Boolean> findByNetworkedIdAndNetworkingIdIn(String currentUser, Set<String> users) {
        var result = userServiceClient.findByNetworkedIdAndNetworkingIdIn(currentUser, users);
        return result.getData();
    }

    public List<String> getNetworking(String userId) {
        return userServiceClient.getNetworking(userId).getData();
    }
}
