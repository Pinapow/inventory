package com.inventory.service;

import com.inventory.dto.request.LoginRequest;
import com.inventory.dto.response.AuthResponse;
import com.inventory.dto.response.UserResponse;
import jakarta.servlet.http.HttpServletResponse;

public interface IAuthService {

    AuthResponse login(LoginRequest request, HttpServletResponse response);

    void logout(HttpServletResponse response);

    UserResponse getCurrentUser(String email);
}
