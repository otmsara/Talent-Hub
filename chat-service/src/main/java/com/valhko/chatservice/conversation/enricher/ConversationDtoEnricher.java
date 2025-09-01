package com.valhko.chatservice.conversation.enricher;

import com.valhko.chatservice.conversation.Conversation;
import com.valhko.chatservice.conversation.dto.response.ConversationDto;
import com.valhko.chatservice.message.Message;
import com.valhko.chatservice.message.MessageRepo;
import com.valhko.chatservice.message.converter.MessageConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;

@Component
@RequiredArgsConstructor
public class ConversationDtoEnricher {
    private final MessageRepo messageRepo;
    private final MessageConverter messageConverter;

    public void enrich(Conversation entity, ConversationDto dto) {
        dto.setLastMessage(messageConverter.convert(messageRepo.getConversationLastMessage(entity.getId())));
    }

    public void enrich(Page<Conversation> entities, Page<ConversationDto> dtoList) {
        var messages = messageRepo.getConversationsLastMessage(entities.map(Conversation::getId).toSet());

        var messageMap = messages.stream().collect(groupingBy(e -> e.getConversation().getId()));

        dtoList.forEach(e -> {
            if (messageMap.get(e.getId()) != null)
                e.setLastMessage(messageConverter.convert(messageMap.get(e.getId()).getFirst()));
        });
    }

}
