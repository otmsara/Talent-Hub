package com.valhko.jobservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "jobId"}))
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;
    private String userId;

    private String resumeUrl;
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    private ApplicationPhase phase;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum ApplicationStatus {
        PENDING, REVIEWED, REJECTED, HIRED
    }

    public enum ApplicationPhase {
        APPLICATION, SCREENING, INTERVIEW, OFFER, FINAL
    }
}