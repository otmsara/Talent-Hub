package com.valhko.userservice.user;

import com.valhko.common.system.dto.response.Result;
import com.valhko.userservice.network.NetworkRepo;
import com.valhko.userservice.user.dto.response.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.core.ResolvableType;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@ControllerAdvice
@RequiredArgsConstructor
public class UserAdvice implements ResponseBodyAdvice<Object> {
    private static final String USER_ID_HEADER = "X-User-Id";
    private final NetworkRepo networkRepo;

    @Override
    public boolean supports(@NonNull MethodParameter returnType,
            @NonNull Class<? extends HttpMessageConverter<?>> converterType) {
        Type genericReturnType = returnType.getGenericParameterType();
        ResolvableType resolvableType = ResolvableType.forType(genericReturnType);

        if (Result.class.isAssignableFrom(resolvableType.toClass())) {
            if (resolvableType.hasGenerics()) {
                ResolvableType generic = resolvableType.getGeneric(0);
                Class<?> genericClass = generic.toClass();

                if (UserProfileDto.class.isAssignableFrom(genericClass) ||
                        List.class.isAssignableFrom(genericClass) ||
                        Page.class.isAssignableFrom(genericClass)) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    @Nullable
    public Object beforeBodyWrite(@Nullable Object body, @NonNull MethodParameter returnType,
            @NonNull MediaType selectedContentType,
            @NonNull Class<? extends HttpMessageConverter<?>> selectedConverterType,
            @NonNull ServerHttpRequest request, @NonNull ServerHttpResponse response) {

        String userId = request.getHeaders().getFirst(USER_ID_HEADER);
        if (userId == null || userId.trim().isEmpty()) {
            return body;
        }

        if (body instanceof Result) {
            Result<?> result = (Result<?>) body;
            Object data = result.getData();

            if (data == null) {
                return body;
            }

            if (data instanceof UserProfileDto) {
                enrichSingleUser((UserProfileDto) data, userId);
            } else if (data instanceof List) {
                List<?> list = (List<?>) data;
                if (!list.isEmpty() && list.get(0) instanceof UserProfileDto) {
                    @SuppressWarnings("unchecked")
                    List<UserProfileDto> responses = (List<UserProfileDto>) list;
                    enrichUserProfileList(responses, userId);
                }
            } else if (data instanceof Page) {
                Page<?> page = (Page<?>) data;
                if (!page.isEmpty() && page.getContent().get(0) instanceof UserProfileDto) {
                    @SuppressWarnings("unchecked")
                    Page<UserProfileDto> postResponsePage = (Page<UserProfileDto>) page;
                    enrichUserProfileList(postResponsePage.getContent(), userId);
                }
            }
            return result;

        }
        return body;
    }

    private void enrichUserProfileList(List<UserProfileDto> content, String userId) {
        if (content == null || content.isEmpty()) {
            return;
        }

        Set<String> profileIds = content.stream()
                .map(UserProfileDto::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (profileIds.isEmpty()) {
            return;
        }

        Set<String> networkerOfRequesterIds = networkRepo.findNetworkingIdsWhereNetworkedIs(userId, profileIds);

        Set<String> networkedByRequesterIds = networkRepo.findNetworkedIdsWhereNetworkingIs(profileIds, userId);

        for (UserProfileDto userProfile : content) {
            String profileId = userProfile.getId();
            if (profileId != null) {
                userProfile.isNetworking = networkerOfRequesterIds.contains(profileId);

                userProfile.isNetworked = networkedByRequesterIds.contains(profileId);
            }
        }
    }

    private void enrichSingleUser(UserProfileDto data, String userId) {
        data.isNetworking = networkRepo.existsByNetworkedIdAndNetworkingId(userId, data.getId());
        data.isNetworked = networkRepo.existsByNetworkedIdAndNetworkingId(data.getId(), userId);
    }

}
