package com.valhko.userservice.user.converter;

import com.valhko.userservice.badge.converter.BadgeConverter;
import com.valhko.userservice.user.User;
import com.valhko.userservice.user.dto.request.UserCreateRequestDto;
import com.valhko.userservice.user.dto.request.UserUpdateRequestDto;
import com.valhko.userservice.user.dto.response.UserEssentialsDto;
import com.valhko.userservice.user.dto.response.UserProfileDto;
import com.valhko.userservice.user.dto.response.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserConverter {
    private final BadgeConverter badgeConverter;

    public User toUser(UserCreateRequestDto dto) {
        User user = new User();
        BeanUtils.copyProperties(dto, user);
        return user;
    }

    public User toUser(UserUpdateRequestDto userUpdateRequestDto) {
        User user = new User();
        BeanUtils.copyProperties(userUpdateRequestDto, user);
        return user;
    }

    public UserDto toUserDto(User user) {
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user, userDto);
        userDto.setNetworking(user.getNetworkingCount());
        userDto.setNetworked(user.getNetworkedCount());
        userDto.setBadges(user.getBadges().stream().map(badgeConverter::convert).toList());
        return userDto;
    }

    public UserProfileDto toUserProfileDto(User user) {
        UserProfileDto userProfileDto = new UserProfileDto();
        BeanUtils.copyProperties(user, userProfileDto);
        userProfileDto.setNetworking(user.getNetworkingCount());
        userProfileDto.setNetworked(user.getNetworkedCount());
        userProfileDto.setBadges(user.getBadges().stream().map(badgeConverter::convert).toList());
        return userProfileDto;
    }

    public UserEssentialsDto toUserEssentialsDto(User user) {
        UserEssentialsDto userEssentialsDto = new UserEssentialsDto();
        BeanUtils.copyProperties(user, userEssentialsDto);
        userEssentialsDto.setBadges(user.getBadges().stream().map(badgeConverter::convert).toList());
        return userEssentialsDto;
    }

}
