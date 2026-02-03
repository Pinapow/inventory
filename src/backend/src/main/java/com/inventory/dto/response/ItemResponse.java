package com.inventory.dto.response;

import com.inventory.model.Item;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;


public record ItemResponse(
        UUID id,
        String name,
        String category,
        String status,
        String imageBase64,
        String contentType,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static ItemResponse fromEntity(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getName(),
                item.getCategory(),
                item.getStatus() != null ? item.getStatus().name() : null,
                item.getImageData() != null ? Base64.getEncoder().encodeToString(item.getImageData()) : null,
                item.getContentType(),
                item.getCreatedAt(),
                item.getUpdatedAt());
    }
}
