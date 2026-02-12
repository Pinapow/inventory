package com.inventory.dto.response;

public record AuthResponse(
    UserResponse user,
    String message
) {}
