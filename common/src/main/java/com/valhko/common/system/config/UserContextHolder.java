package com.valhko.common.system.config;

import org.springframework.core.NamedThreadLocal;
import org.springframework.stereotype.Component;

@Component
public class UserContextHolder {

    private UserContextHolder() {}

    private static final NamedThreadLocal<UserInfo> userInfoThreadLocal = new NamedThreadLocal<>("User Context");

    public static void setUserInfo(UserInfo userInfo) {
        userInfoThreadLocal.set(userInfo);
    }

    public static UserInfo getUserInfo() {
        return userInfoThreadLocal.get();
    }

    public static String userId() {
        return userInfoThreadLocal.get().userId();
    }

    public static void clear() {
        userInfoThreadLocal.remove();
    }

}
