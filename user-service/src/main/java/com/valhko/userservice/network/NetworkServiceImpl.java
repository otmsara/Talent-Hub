package com.valhko.userservice.network;

import com.valhko.common.event.notification.NotificationEventType;
import com.valhko.common.outbox.OutboxEventService;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.userservice.user.User;
import com.valhko.userservice.user.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class NetworkServiceImpl implements NetworkService {
    private final NetworkRepo repo;
    private final UserRepo userRepo;
    private final OutboxEventService outboxEventService;

    @Override
    @Transactional
    public void connect(String userId) {
        var networkedId = UserContextHolder.userId();

        validate(networkedId, userId);

        if (repo.existsByNetworkedIdAndNetworkingId(networkedId, userId))
            throw new InvalidArgumentsException("Already connected");

        var network = new Network();
        network.setNetworked(User.builder().id(networkedId).build());
        network.setNetworking(User.builder().id(userId).build());

        Network savedNetwork = repo.save(network);

        outboxEventService.saveNotificationEvent(savedNetwork.getId(), NotificationEventType.USER_CONNECT, networkedId, userId);
    }

    @Override
    @Transactional
    public void disconnect(String userId) {
        var networkedId = UserContextHolder.userId();

        validate(networkedId, userId);

        Network foundNetwork = repo.findByNetworkedIdAndNetworkingId(networkedId, userId)
                .orElseThrow(() -> new InvalidArgumentsException("You are not connected to this user"));

        repo.delete(foundNetwork);
    }

    private void validate(String networkedId, String networkingId) {
        if (networkedId.equals(networkingId))
            throw new InvalidArgumentsException("You can't connect with your self");

        if (!userRepo.existsById(networkedId) || !userRepo.existsById(networkingId))
            throw new ResourceNotFoundException("Couldn't find the user");
    }
}
