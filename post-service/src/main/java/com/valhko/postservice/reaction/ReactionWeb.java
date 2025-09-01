package com.valhko.postservice.reaction;

import com.valhko.common.system.dto.response.Result;
import com.valhko.postservice.reaction.util.ReactionType;
import com.valhko.postservice.reaction.util.ReactionItemType;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/reactions")
@RequiredArgsConstructor
public class ReactionWeb {
    private final ReactionService service;

    @PostMapping
    public Result<?> create(@RequestParam String itemId, @RequestParam ReactionType reactionType, @RequestParam ReactionItemType itemType) {
        service.create(itemId, itemType, reactionType);
        return Result.success();
    }

    @DeleteMapping
    public Result<?> delete(@RequestParam String itemId, @RequestParam ReactionType reactionType) {
        service.delete(itemId, reactionType);
        return Result.success();
    }
}
