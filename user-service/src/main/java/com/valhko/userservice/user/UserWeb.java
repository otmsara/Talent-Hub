package com.valhko.userservice.user;


import com.valhko.common.system.dto.response.Result;
import com.valhko.userservice.user.converter.UserConverter;
import com.valhko.userservice.user.dto.request.UserCreateRequestDto;
import com.valhko.userservice.user.dto.request.UserPasswordUpdateRequest;
import com.valhko.userservice.user.dto.response.UserEssentialsDto;
import com.valhko.userservice.user.dto.response.UserProfileDto;
import com.valhko.userservice.user.dto.response.UserDto;
import com.valhko.userservice.user.dto.request.UserUpdateRequestDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("${api.endpoint.base-url}/users")
@RequiredArgsConstructor
public class UserWeb {
    private final UserService service;
    private final UserConverter converter;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Result<?> register(@Valid @RequestBody UserCreateRequestDto dto) {
        service.register(converter.toUser(dto));
        return Result.created();
    }

    @GetMapping("/suggestions")
    public Result<Page<UserProfileDto>> getSuggestions(Pageable pageable) {
        return Result.success(service.getSuggestions(pageable).map(converter::toUserProfileDto));
    }

    @GetMapping("/me")
    public Result<UserDto> getMe() {
        return Result.success(converter.toUserDto(service.getMe()));
    }

    @GetMapping("/profile/{username}")
    public Result<UserProfileDto> getProfile(@PathVariable String username) {
        return Result.success(converter.toUserProfileDto(service.getProfile(username)));
    }

    @GetMapping("/{userId}/networking")
    public Result<Page<UserProfileDto>> getNetworking(Pageable pageable, @PathVariable String userId) {
        return Result.success(service.getNetworkingList(userId, pageable).map(converter::toUserProfileDto));
    }

    @GetMapping("/{userId}/networked")
    public Result<Page<UserProfileDto>> getNetworked(Pageable pageable, @PathVariable String userId) {
        return Result.success(service.getNetworkedList(userId, pageable).map(converter::toUserProfileDto));
    }

    @PostMapping("/search")
    public Result<Page<UserEssentialsDto>> findUsersByCriteria(Pageable pageable, @RequestBody Map<String, String> searchCriteria) {
        return Result.success(service.findByCriteria(searchCriteria, pageable).map(converter::toUserEssentialsDto));
    }

    @PatchMapping("/update")
    public Result<UserDto> update(@Valid @RequestBody UserUpdateRequestDto userUpdateRequestDto) {
        return Result.success(converter.toUserDto(service.update(converter.toUser(userUpdateRequestDto))));
    }

    @PatchMapping("/update/password")
    public Result<?> updatePassword(@Valid @RequestBody UserPasswordUpdateRequest request) {
        service.updatePassword(request.getOldPassword(), request.getNewPassword(), request.getConfirmPassword());
        return Result.success();
    }
}