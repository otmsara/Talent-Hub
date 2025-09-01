package com.valhko.chatservice.message.converter;

import com.valhko.chatservice.conversation.converter.ConversationConverter;
import com.valhko.chatservice.member.converter.MemberConverter;
import com.valhko.chatservice.message.Message;
import com.valhko.chatservice.message.dto.request.MessageCreateRequestDto;
import com.valhko.chatservice.message.dto.request.MessageUpdateRequestDto;
import com.valhko.chatservice.message.dto.response.MessageDto;
import com.valhko.common.system.config.UserContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageConverter {
    private final ConversationConverter conversationConverter;
    private final MemberConverter memberConverter;

    public Message convert(MessageCreateRequestDto dto) {
        var entity = new Message();
        BeanUtils.copyProperties(dto, entity);
        entity.setConversation(conversationConverter.convert(dto.getConversation()));
        return entity;
    }

    public Message convert(MessageUpdateRequestDto dto) {
        var entity = new Message();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    public MessageDto convert(Message entity) {
        var dto = new MessageDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setConversation(conversationConverter.convert(entity.getConversation()));
        dto.setSender(memberConverter.convert(entity.getSender()));
        if (!entity.getSender().getUserId().equals(UserContextHolder.userId()))
            dto.setReaders(null);
        if (entity.isDeleted()) {
            dto.setMessage(null);
            dto.setMedia(null);
        }
        return dto;
    }

    public MessageDto convertForMessage(Message entity) {
        var dto = new MessageDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setConversation(conversationConverter.convert(entity.getConversation()));
        dto.setSender(memberConverter.convert(entity.getSender()));

        if (entity.isDeleted()) {
            dto.setMessage(null);
            dto.setMedia(null);
        }
        return dto;
    }
}
