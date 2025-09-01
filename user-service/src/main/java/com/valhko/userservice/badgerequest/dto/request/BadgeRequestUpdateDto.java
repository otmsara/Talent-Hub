package com.valhko.userservice.badgerequest.dto.request;

import com.valhko.userservice.badgerequest.util.BadgeRequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BadgeRequestUpdateDto {
    @NotNull(message = "The status is required")
    private BadgeRequestStatus status;
    private LocalDate validUntil;
}
