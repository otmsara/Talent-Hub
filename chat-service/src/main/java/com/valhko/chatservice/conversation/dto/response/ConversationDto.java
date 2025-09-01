package com.valhko.chatservice.conversation.dto.response;

import com.valhko.chatservice.conversation.util.ConversationType;
import com.valhko.chatservice.member.dto.response.MemberDto;
import com.valhko.chatservice.message.dto.response.MessageDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ConversationDto {
    private String id;
    private ConversationType type;
    private List<MemberDto> members;
    private MessageDto lastMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
