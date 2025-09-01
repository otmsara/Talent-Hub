package com.valhko.postservice.reaction;

import com.valhko.postservice.reaction.util.ReactionType;
import com.valhko.postservice.reaction.util.ReactionItemType;

public interface ReactionService {
    void create(String itemId, ReactionItemType itemType, ReactionType reactionType);

    void delete(String id, ReactionType reactionType);
}
