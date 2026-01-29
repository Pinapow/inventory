package com.inventory.dto.request;

import lombok.Data;

@Data
public class ItemSearchCriteria {

    private String search;
    private String category;
    private String status;
}
