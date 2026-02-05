package com.inventory.dto.request;

import com.inventory.enums.ItemStatus;

import java.util.UUID;

public record ItemSearchCriteria(

        String search,
        UUID itemListId,
        ItemStatus status) {
}
