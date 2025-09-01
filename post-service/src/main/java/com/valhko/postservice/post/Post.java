package com.valhko.postservice.post;

import com.valhko.postservice.comment.Comment;
import com.valhko.postservice.contribution.Contribution;
import com.valhko.postservice.reaction.Disagree;
import com.valhko.postservice.neededcontributor.NeededContributor;
import com.valhko.postservice.post.util.PostStatus;
import com.valhko.postservice.post.util.PostType;
import com.valhko.postservice.reaction.Agree;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@SQLRestriction("deleted = false")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String postedById;

    private PostType type;

    private PostStatus status;

    @Builder.Default
    private Boolean isNetworkingOnly = false;

    @OneToMany(mappedBy = "post")
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "activityId")
    @Builder.Default
    private List<Agree> agrees = new ArrayList<>();

    @OneToMany(mappedBy = "activityId")
    @Builder.Default
    private List<Disagree> disagrees = new ArrayList<>();

    @ElementCollection
    private List<String> mediaIds = new ArrayList<>();

    @OneToMany(mappedBy = "post")
    @Builder.Default
    private List<Contribution> contributions = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<NeededContributor> neededContributors = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    private Post originalPost;

    @OneToMany(mappedBy = "originalPost")
    @Builder.Default
    private List<Post> sharedPosts = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String content;

    private String link;

    @Builder.Default
    private boolean deleted = false;

    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void addNeededContributors(List<NeededContributor> list) {
        if (this.neededContributors == null)
            this.neededContributors = new ArrayList<>();
        list.forEach(e -> {
            var exists = this.neededContributors.stream()
                    .filter(element -> element.getId().equals(e.getId()))
                    .findAny().orElse(null) != null;
            if (!exists) {
                e.setPost(this);
                this.neededContributors.add(e);
            }
        });
    }

    public void addMedia(String id) {
        if (this.mediaIds == null) {
            this.mediaIds = new ArrayList<>();
        }
        this.mediaIds.add(id);
    }
}
