package com.valhko.postservice.report;

import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.ForbiddenRequestException;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.postservice.comment.CommentRepo;
import com.valhko.postservice.post.Post;
import com.valhko.postservice.post.PostRepo;
import com.valhko.postservice.post.util.PostStatus;
import com.valhko.postservice.report.util.ReportType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ReportRepo repo;
    private final PostRepo postRepo;
    private final CommentRepo commentRepo;

    @Override
    public Report create(Report report) {
        Object item;
        if (report.getReportType() == ReportType.comment)
            item = commentRepo.findById(report.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("The requested comment was not found."));
        else
            item = postRepo.findById(report.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("The requested post was not found."));

        // Check if user has already reported this post
        if (repo.existsByItemIdAndReportedById(report.getItemId(), UserContextHolder.userId()))
            throw new InvalidArgumentsException("You have already reported this.");

        if (item instanceof Post)
            if (((Post) item).getStatus() != PostStatus.PUBLIC)
                throw new ForbiddenRequestException("You cannot report a private or draft post.");

        report.setReportedById(UserContextHolder.userId());
        return repo.save(report);
    }

    @Override
    public Page<Report> findByItemId(String itemId, Pageable pageable) {
        // Check if post exists
        return repo.findByItemId(itemId, pageable);
    }

    @Override
    public Page<Report> findByUserId(String userId, Pageable pageable) {
        return repo.findByReportedById(userId, pageable);
    }

    @Override
    public Page<Report> findAll(Pageable pageable) {
        return repo.findAll(pageable);
    }
}