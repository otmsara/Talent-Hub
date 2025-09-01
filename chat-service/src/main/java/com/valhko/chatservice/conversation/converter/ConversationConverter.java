package com.valhko.chatservice.conversation.converter;

import com.valhko.chatservice.conversation.Conversation;
import com.valhko.chatservice.conversation.dto.request.ConversationCreateRequestDto;
import com.valhko.chatservice.conversation.dto.response.ConversationDto;
import com.valhko.chatservice.member.converter.MemberConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ConversationConverter {
    private final MemberConverter memberConverter;

    public Conversation convert(ConversationCreateRequestDto dto) {
        var entity = new Conversation();
        BeanUtils.copyProperties(dto, entity);
        if (dto.getMembers() == null)
            dto.setMembers(List.of());
        entity.setMembers(dto.getMembers().stream().map(memberConverter::convert).toList());
        return entity;
    }

    public ConversationDto convert(Conversation entity) {
        var dto = new ConversationDto();
        BeanUtils.copyProperties(entity, dto);
        if (entity.getMembers() == null)
            entity.setMembers(List.of());
        dto.setMembers(entity.getMembers().stream().map(memberConverter::convert).toList());
        return dto;
    }

    public Conversation convert(ConversationDto dto) {
        var entity = new Conversation();
        BeanUtils.copyProperties(dto, entity);
        if (dto.getMembers() == null)
            dto.setMembers(List.of());
        entity.setMembers(dto.getMembers().stream().map(memberConverter::convert).toList());
        return entity;
    }
}
