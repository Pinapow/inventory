package com.inventory.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ItemListRequest(

        @NotBlank(message = "Name is required")
        String name,

        String description,

        String category
) {}
