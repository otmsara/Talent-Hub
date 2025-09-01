package com.valhko.userservice.system.init;

import com.valhko.userservice.role.Role;
import com.valhko.userservice.role.RoleRepo;
import com.valhko.userservice.user.User;
import com.valhko.userservice.user.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DBDataInitialization implements CommandLineRunner {

    private final RoleRepo roleRepo;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        var userRole = roleRepo.findByName("ROLE_USER");
        var adminRole = roleRepo.findByName("ROLE_ADMIN");

        var roles = new HashSet<Role>();

        roles.add(userRole);
        roles.add(adminRole);

        userRepo.save(User.builder()
                .firstName("Saad")
                .lastName("Aboulhoda")
                .email("saad.aboulhoda@gmail.com")
                .roles(roles)
                .build());
    }

}
