package com.valhko.chatservice.member.converter;

import com.valhko.chatservice.member.Member;
import com.valhko.chatservice.member.dto.request.MemberCreateRequestDto;
import com.valhko.chatservice.member.dto.response.MemberDto;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class MemberConverter {

    public MemberDto convert(Member entity) {
        var dto = new MemberDto();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    public Member convert(MemberDto dto) {
        var entity = new Member();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }

    public Member convert(MemberCreateRequestDto dto) {
        var entity = new Member();
        BeanUtils.copyProperties(dto, entity);
        return entity;
    }
}
