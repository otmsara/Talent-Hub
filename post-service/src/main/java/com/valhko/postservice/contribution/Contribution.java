package com.valhko.postservice.contribution;

import com.valhko.postservice.neededcontributor.NeededContributor;
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
public class Contribution {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String userId;
    private String content;
    @ManyToOne
    private Post post;
    @ManyToOne
    private NeededContributor neededContributor;
    @ElementCollection
    @Builder.Default
    private List<String> attachmentsIds = new ArrayList<>();
    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
