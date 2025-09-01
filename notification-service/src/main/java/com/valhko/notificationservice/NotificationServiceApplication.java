package com.valhko.notificationservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.valhko.common.system.listener.EventHandler;
import com.valhko.notificationservice.notification.NotificationService;
import com.valhko.notificationservice.notification.eventhandler.NotificationEventHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
@ComponentScan(basePackages = {"com.valhko.notificationservice", "com.valhko.common"})
@EnableJpaRepositories(basePackages = {"com.valhko.notificationservice", "com.valhko.common.outbox", "com.valhko.common.localuser"})
@EntityScan(basePackages = {"com.valhko.notificationservice", "com.valhko.common.outbox", "com.valhko.common.localuser"})
@EnableFeignClients(basePackages = {"com.valhko.common.client"})
@EnableRetry
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }

    @Bean(name = "USER_CONNECT")
    public EventHandler notificationUserConnectEventHandler(ObjectMapper objectMapper, NotificationService notificationService) {
        return new NotificationEventHandler(objectMapper, notificationService);
    }

    @Bean(name = "POST_AGREE")
    public EventHandler notificationPostAgreeEventHandler(ObjectMapper objectMapper, NotificationService notificationService) {
        return new NotificationEventHandler(objectMapper, notificationService);
    }

    @Bean(name = "COMMENT_AGREE")
    public EventHandler notificationnCommentAgreeEventHandler(ObjectMapper objectMapper, NotificationService notificationService) {
        return new NotificationEventHandler(objectMapper, notificationService);
    }

    @Bean(name = "POST_COMMENT")
    public EventHandler notificationnPostCommentEventHandler(ObjectMapper objectMapper, NotificationService notificationService) {
        return new NotificationEventHandler(objectMapper, notificationService);
    }

    @Bean(name = "COMMENT_REPLY")
    public EventHandler notificationnCommentReplyEventHandler(ObjectMapper objectMapper, NotificationService notificationService) {
        return new NotificationEventHandler(objectMapper, notificationService);
    }
}
