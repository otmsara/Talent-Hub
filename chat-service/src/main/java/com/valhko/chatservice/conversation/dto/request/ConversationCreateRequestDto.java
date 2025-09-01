package com.valhko.chatservice.conversation.dto.request;

import com.valhko.chatservice.conversation.util.ConversationType;
import com.valhko.chatservice.member.dto.request.MemberCreateRequestDto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ConversationCreateRequestDto {
    @NotNull(message = "The type is required.")
    private ConversationType type;
    private List<MemberCreateRequestDto> members;
}
