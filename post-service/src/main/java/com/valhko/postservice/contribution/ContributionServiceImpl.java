package com.valhko.postservice.contribution;

import com.valhko.common.client.media.MediaClientService;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.ForbiddenRequestException;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.postservice.post.Post;
import com.valhko.postservice.post.PostRepo;
import com.valhko.postservice.post.util.PostType;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContributionServiceImpl implements ContributionService {
    private final ContributionRepo repo;
    private final PostRepo postRepo;
    private final MediaClientService mediaClient;

    @Override
    public Contribution create(Contribution item) {
        Post post = postRepo.findById(item.getPost().getId())
                .orElseThrow(() -> new ResourceNotFoundException("The requested project was not found."));

        if (post.getType() != PostType.PROJECT)
            throw new ForbiddenRequestException("Contributions can only be made to projects.");

        item.setPost(post);
        item.setUserId(UserContextHolder.getUserInfo().userId());

        Contribution saved = repo.save(item);

        updateMedia(item.getAttachmentsIds(), saved.getId());

        return saved;
    }

    @Override
    public Contribution findById(String id) {
        return repo.findByIdAndUserId(id, UserContextHolder.getUserInfo().userId())
                .orElseThrow(() -> new ResourceNotFoundException("The requested contribution was not found."));
    }

    @Override
    public Contribution update(String id, Contribution item) {
        Contribution contribution = findById(id); // We're using service method here

        updateMedia(item.getAttachmentsIds(), contribution.getId());

        return repo.save(contribution);
    }

    private void updateMedia(List<String> mediaIds, String itemId) {
        mediaClient.updateItemIdWhereIdIn(itemId, mediaIds);
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        Integer deletedItemsNumber = repo.deleteByIdAndUserId(id, UserContextHolder.getUserInfo().userId());
        if (deletedItemsNumber != 1)
            throw new InvalidArgumentsException("Operation failed.");
    }
}
