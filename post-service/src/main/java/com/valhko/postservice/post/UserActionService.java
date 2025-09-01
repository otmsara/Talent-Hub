package com.valhko.postservice.post;

import com.valhko.postservice.reaction.AgreeRepo;
import com.valhko.postservice.reaction.DisagreeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Optional, but good practice for reads

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserActionService {
    private final AgreeRepo agreeRepository;
    private final DisagreeRepo disagreeRepository;

    public record ActionStatus(boolean agreed, boolean disagreed) {
        public ActionStatus(boolean agreed, boolean disagreed) {
            this.agreed = agreed;
            this.disagreed = !agreed && disagreed;
        }
    }

    @Transactional(readOnly = true)
    public ActionStatus getUserActionForPost(String userId, String postId) {
        if (userId == null || postId == null) {
            return new ActionStatus(false, false);
        }
        boolean agreed = agreeRepository.existsByActivityIdAndUserId(postId, userId);
        boolean disagreed = !agreed && disagreeRepository.existsByActivityIdAndUserId(postId, userId);
        return new ActionStatus(agreed, disagreed);
    }

    @Transactional(readOnly = true)
    public Map<String, ActionStatus> getUserActionsForPosts(String userId, Set<String> postIds) {
        if (userId == null || postIds == null || postIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Set<String> agreedPostIds = agreeRepository.findPostIdsByUserIdAndPostIdIn(userId, postIds);
        Set<String> disagreedPostIds = disagreeRepository.findPostIdsByUserIdAndPostIdIn(userId, postIds);

        Map<String, ActionStatus> results = new HashMap<>();
        for (String postId : postIds) {
            boolean isAgreed = agreedPostIds.contains(postId);
            boolean isDisagreed = !isAgreed && disagreedPostIds.contains(postId);
            results.put(postId, new ActionStatus(isAgreed, isDisagreed));
        }
        return results;
    }
}