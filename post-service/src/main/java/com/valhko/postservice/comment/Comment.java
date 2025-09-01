package com.valhko.postservice.comment;

import com.valhko.postservice.comment.util.CommentType;
import com.valhko.postservice.reaction.Agree;
import com.valhko.postservice.reaction.Disagree;
import com.valhko.postservice.post.Post;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
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
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne
    private Post post;
    private CommentType type;
    @ManyToOne
    private Comment parent;
    @OneToMany(mappedBy = "parent", fetch = FetchType.EAGER)
    @Builder.Default
    private List<Comment> replies = new ArrayList<>();
    private String createdById;
    @OneToMany(mappedBy = "activityId")
    @Builder.Default
    private List<Agree> agrees = new ArrayList<>();
    @OneToMany(mappedBy = "activityId")
    @Builder.Default
    private List<Disagree> disagree = new ArrayList<>();
    @ElementCollection
    @Builder.Default
    private List<String> mediaIds = new ArrayList<>();
    @Column(columnDefinition = "TEXT")
    private String content;
    @Builder.Default
    private boolean deleted = false;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public int getAgreeCount() {
        return agrees.size() - disagree.size();
    }
}