package com.valhko.postservice.reaction;

import com.valhko.postservice.reaction.util.ReactionItemType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Disagree {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String activityId;
    private ReactionItemType activityType;
    private String userId;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

