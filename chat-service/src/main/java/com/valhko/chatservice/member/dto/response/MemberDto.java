package com.valhko.chatservice.member.dto.response;

import com.valhko.chatservice.member.util.MemberRole;
import lombok.Data;

@Data
public class MemberDto {
    private String id;
    private String userId;
    private MemberRole role;
}
