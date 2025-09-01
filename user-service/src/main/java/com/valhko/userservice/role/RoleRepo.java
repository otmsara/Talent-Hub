package com.valhko.userservice.role;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepo extends JpaRepository<Role, String> {
    Role findByName(String name);
}
