package com.inventory.dto.request;

import com.inventory.enums.ItemStatus;
import jakarta.validation.constraints.NotBlank;

public record ItemRequest(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Category is required")
        String category,

        ItemStatus status
) {}
