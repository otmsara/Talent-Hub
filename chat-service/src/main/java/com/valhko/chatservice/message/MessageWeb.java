package com.valhko.chatservice.message;

import com.valhko.chatservice.message.converter.MessageConverter;
import com.valhko.chatservice.message.dto.request.MessageCreateRequestDto;
import com.valhko.chatservice.message.dto.request.MessageUpdateRequestDto;
import com.valhko.chatservice.message.dto.response.MessageDto;
import com.valhko.chatservice.message.enricher.MessageDtoEnricher;
import com.valhko.common.system.dto.response.Result;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/messages")
@RequiredArgsConstructor
public class MessageWeb {
    private final MessageService service;
    private final MessageConverter converter;
    private final MessageDtoEnricher enricher;

    @GetMapping
    public Result<Page<MessageDto>> findByConversationId(@RequestParam String conversationId, Pageable pageable) {
        var items = service.findByConversationId(conversationId, pageable);
        var dtoList = items.map(converter::convert);
        enricher.enrich(items, dtoList);
        return Result.success(dtoList);
    }

    @PostMapping
    public Result<MessageDto> create(@Valid @RequestBody MessageCreateRequestDto dto) {
        var item = converter.convert(dto);
        var saved = service.create(item);
        var savedDto = converter.convert(saved);
        enricher.enrich(saved, savedDto);
        return Result.success(savedDto);
    }

    @PatchMapping("/{id}")
    public Result<MessageDto> update(@PathVariable String id, @Valid @RequestBody MessageUpdateRequestDto dto) {
        var item = converter.convert(dto);
        var updated = service.update(id, item);
        var updatedDto = converter.convert(updated);
        enricher.enrich(updated, updatedDto);
        return Result.success(updatedDto);
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable String id) {
        service.delete(id);
        return Result.success();
    }

    @GetMapping("/unread-count")
    public Result<Long> getUnreadMessagesCount() {
        return Result.success(service.getUnreadMessagesCount());
    }

    @GetMapping("/unread-count-by-conversation")
    public Result<Map<String, Long>> getUnreadMessagesCountByConversation() {
        return Result.success(service.getUnreadMessagesCountByConversation());
    }

    @PostMapping("/{messageId}/mark-read")
    public void markAsRead(@PathVariable String messageId) {
        service.markMessageAsRead(messageId);
    }
}
