package com.inventory.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 12, message = "Password must be at least 12 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
        message = "Password must contain at least one lowercase letter, one uppercase letter, and one digit"
    )
    String password,

    @NotBlank(message = "Password confirmation is required")
    String confirmPassword
) {
    @AssertTrue(message = "Passwords do not match")
    public boolean isPasswordMatch() {
        return password != null && password.equals(confirmPassword);
    }
}
