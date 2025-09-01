package com.valhko.postservice.report.dto.request;

import com.valhko.postservice.report.util.ReportType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReportCreateRequestDto {
    @NotBlank(message = "The reason is required")
    @Size(max = 500, message = "The reason cannot be more than 500 characters")
    private String reason;
    @NotNull(message = "The report type is required")
    private ReportType reportType;
    @NotBlank(message = "The item id is required")
    private String itemId;
}