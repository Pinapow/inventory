package com.inventory.dto.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleAuthRequest(
    @NotBlank(message = "Google credential is required")
    String credential
) {}
