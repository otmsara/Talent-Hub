package com.valhko.chatservice.message.dto.request;

import com.valhko.chatservice.conversation.dto.response.ConversationDto;
import com.valhko.chatservice.member.dto.response.MemberDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageCreateRequestDto {
    @NotNull(message = "The conversation is required")
    private ConversationDto conversation;
    @NotBlank(message = "The message is required")
    private String message;
    private String media;
}
