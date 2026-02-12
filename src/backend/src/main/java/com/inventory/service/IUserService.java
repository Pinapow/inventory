package com.inventory.service;

import com.inventory.dto.request.CreateUserRequest;
import com.inventory.enums.Role;
import com.inventory.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IUserService {

    Page<User> getAllUsers(Pageable pageable);

    User createUser(CreateUserRequest request);

    void deleteUser(UUID id);

    User updateUserRole(UUID id, Role role);

    User getUserById(UUID id);

    boolean existsByEmail(String email);
}
