package com.inventory.dto.request;

import com.inventory.enums.ItemStatus;

public record ItemSearchCriteria(

        String search,
        String category,
        ItemStatus status) {
}
