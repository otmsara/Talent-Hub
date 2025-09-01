package com.valhko.userservice.user;

import com.valhko.common.system.dto.response.Result;
import com.valhko.userservice.user.converter.UserConverter;
import com.valhko.userservice.user.dto.request.UserUpdateStatusRequestDto;
import com.valhko.userservice.user.dto.response.UserDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.endpoint.base-url}/admin/users")
@RequiredArgsConstructor
public class UserWebAdmin {
    private final UserService service;
    private final UserConverter converter;

    @GetMapping
    public Result<Page<UserDto>> findAll(Pageable pageable) {
        var items = service.findAll(pageable);
        var dtoList = items.map(converter::toUserDto);
        return Result.success(dtoList);
    }

    @PostMapping("/update-user-status")
    public Result<?> updateUserStatus(@Valid @RequestBody UserUpdateStatusRequestDto dto) {
        service.updateUserStatus(dto.getUserId(), dto.getActive());
        return Result.success();
    }
}
