package com.valhko.chatservice.conversation;

import com.valhko.chatservice.conversation.converter.ConversationConverter;
import com.valhko.chatservice.conversation.dto.request.ConversationCreateRequestDto;
import com.valhko.chatservice.conversation.dto.response.ConversationDto;
import com.valhko.chatservice.conversation.enricher.ConversationDtoEnricher;
import com.valhko.common.system.dto.response.Result;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/conversations")
@RequiredArgsConstructor
public class ConversationWeb {
    private final ConversationService service;
    private final ConversationConverter converter;
    private final ConversationDtoEnricher enricher;

    @GetMapping
    public Result<Page<ConversationDto>> getMyConversations(Pageable pageable) {
        var items = service.findByUserId(pageable);
        var dtoList = items.map(converter::convert);
        enricher.enrich(items, dtoList);
        return Result.success(dtoList);
    }

    @GetMapping("/recipient/{id}")
    public Result<ConversationDto> findByRecipientId(@PathVariable String id) {
        var item = service.findByRecipientId(id);
        var dto = converter.convert(item);
        enricher.enrich(item, dto);
        return Result.success(dto);
    }

    @PostMapping
    public Result<ConversationDto> create(@Valid @RequestBody ConversationCreateRequestDto item) {
        Conversation convert = converter.convert(item);
        Conversation saved = service.create(convert);
        return Result.success(converter.convert(saved));
    }
}
