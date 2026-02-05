package com.inventory.dto.response;

import com.inventory.model.Item;

import java.time.LocalDateTime;
import java.util.UUID;


public record ItemResponse(
        UUID id,
        String name,
        UUID itemListId,
        String status,
        Integer stock,
        boolean hasImage,
        String contentType,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static ItemResponse fromEntity(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getName(),
                item.getItemList() != null ? item.getItemList().getId() : null,
                item.getStatus() != null ? item.getStatus().name() : null,
                item.getStock(),
                item.getImageData() != null && item.getImageData().length > 0,
                item.getContentType(),
                item.getCreatedAt(),
                item.getUpdatedAt());
    }
}
