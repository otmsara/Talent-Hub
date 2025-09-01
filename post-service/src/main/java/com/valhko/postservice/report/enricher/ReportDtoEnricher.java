package com.valhko.postservice.report.enricher;

import com.valhko.common.client.userservice.user.UserClientService;
import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.postservice.report.Report;
import com.valhko.postservice.report.dto.response.ReportDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Component
@RequiredArgsConstructor
public class ReportDtoEnricher {
    private final UserClientService userClient;

    public void enrich(Report entity, ReportDto dto) {
        // Enrich report with user
        var userResult = userClient.findById(entity.getReportedById());

        dto.setReportedBy(userResult);
    }

    public void enrich(Page<Report> entities, Page<ReportDto> dtoList) {
        // Prepare: Enrich reports with users
        var userIds = entities.stream().map(Report::getReportedById).collect(Collectors.toSet());
        var userResult = userClient.findByIds(new ArrayList<>(userIds));

        var userById = userResult.stream()
                .collect(Collectors.toMap(UserInternalDto::getId, Function.identity()));

        var userMapWithPostIdAsKey = entities.stream()
                .collect(Collectors.toMap(
                        Report::getId,
                        report -> userById.get(report.getReportedById())
                ));

        // Enrich
        dtoList.forEach(e -> {
            e.setReportedBy(userMapWithPostIdAsKey.get(e.getId()));
        });
    }

}
