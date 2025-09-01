package com.valhko.userservice.badgerequest.dto.response;

import com.valhko.common.client.media.dto.response.MediaInternalDto;
import com.valhko.userservice.badge.util.BadgeType;
import com.valhko.userservice.badgerequest.util.BadgeRequestStatus;
import com.valhko.userservice.user.dto.response.UserEssentialsDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BadgeRequestDto {
    private String id;
    private BadgeType type;
    private UserEssentialsDto requester;
    private String content;
    private List<MediaInternalDto> attachments;
    private BadgeRequestStatus status;
    private boolean done;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
