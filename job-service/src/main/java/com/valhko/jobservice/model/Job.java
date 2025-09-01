package com.valhko.jobservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private JobType type;

    private String location;
    private Double salary;
    private Boolean isRemote;

    @ElementCollection
    private List<String> requiredSkills;

    private Long companyId;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum JobType {
        FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP
    }

    public enum JobStatus {
        DRAFT, OPEN, CLOSED
    }

    public boolean isOwnedByCompany(Long companyId) {
        return this.companyId != null && this.companyId.equals(companyId);
    }
}