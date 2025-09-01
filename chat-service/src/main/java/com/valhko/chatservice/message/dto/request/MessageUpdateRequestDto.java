package com.valhko.chatservice.message.dto.request;

import lombok.Data;

@Data
public class MessageUpdateRequestDto {
    private String message;
    private String media;
}
