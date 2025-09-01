package com.valhko.postservice.report.dto.response;

import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.postservice.report.util.ReportType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReportDto {
    private String id;
    private String itemId;
    private ReportType reportType;
    private UserInternalDto reportedBy;
    private String reason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}