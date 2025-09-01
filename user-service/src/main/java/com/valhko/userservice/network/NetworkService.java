package com.valhko.userservice.network;

public interface NetworkService {
    void connect(String userId);

    void disconnect(String userId);
}
