package com.valhko.userservice.badge.dto.request;

import com.valhko.userservice.badge.util.BadgeStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BadgeUpdateDto {
    @NotNull(message = "The status is required")
    private BadgeStatus status;
}
