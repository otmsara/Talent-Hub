package com.valhko.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = {"com.valhko.userservice", "com.valhko.common"})
@EnableJpaRepositories(basePackages = {"com.valhko.userservice", "com.valhko.common.outbox"})
@EntityScan(basePackages = {"com.valhko.userservice", "com.valhko.common.outbox"})
@EnableFeignClients(basePackages = {"com.valhko.common.client"})
@EnableScheduling
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

}
