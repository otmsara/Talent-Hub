package com.valhko.chatservice.message.dto.response;

import com.valhko.chatservice.conversation.dto.response.ConversationDto;
import com.valhko.chatservice.member.dto.response.MemberDto;
import com.valhko.chatservice.message.MessageReadStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class MessageDto {
    private String id;
    private MemberDto sender;
    private String message;
    private String media;
    private Boolean read;
    private List<MessageReadStatus> readers;
    private ConversationDto conversation;
    private boolean deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
