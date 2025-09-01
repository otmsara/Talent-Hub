package com.valhko.userservice.badge.dto.response;

import com.valhko.userservice.badge.util.BadgeStatus;
import com.valhko.userservice.badge.util.BadgeType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BadgeDto {
    private String id;
    private BadgeType type;
    private BadgeStatus status;
    private LocalDate validUntil;
}
