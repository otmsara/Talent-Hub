package com.valhko.userservice.user;

import com.valhko.common.client.userservice.user.dto.response.UserInternalDto;
import com.valhko.common.system.dto.response.Result;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.userservice.badge.converter.BadgeConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class UserWebInternal {
    private final UserRepo repo;
    private final BadgeConverter badgeConverter;

    @GetMapping("/{id}")
    public Result<UserInternalDto> findById(@PathVariable String id) {
        User user = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return Result.success(convert(user));
    }

    @GetMapping
    Result<List<UserInternalDto>> findByIds(@RequestParam List<String> ids) {
        List<UserInternalDto> dtoList = repo.findByIdIn(ids).stream().map(this::convert).toList();
        return Result.success(dtoList);
    }

    @GetMapping("/checksums")
    public Result<Map<String, String>> usersChecksums() {
        var users = repo.findAll();
        var map = new HashMap<String, String>();
        for (User user : users) {
            map.put(user.getId(), calculateChecksum(user));
        }
        return Result.success(map);
    }

    private String calculateChecksum(User user) {
        // The checksum algorithm should be consistent with the user-service
        // This simple example uses a combination of fields and last modified timestamp
        String data = user.getId() + ":" +
                user.getUsername() + ":" +
                user.getFirstName() + ":" +
                user.getLastName() + ":" +
                user.getAvatarUrl();

        return Base64.getEncoder().encodeToString(
                data.getBytes()
        );
    }

    private UserInternalDto convert(User user) {
        UserInternalDto dto = new UserInternalDto();
        BeanUtils.copyProperties(user, dto);
        dto.setBadges(user.getBadges().stream().map(badgeConverter::convert).toList());
        return dto;
    }
}
