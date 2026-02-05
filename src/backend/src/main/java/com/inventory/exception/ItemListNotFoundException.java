package com.inventory.exception;

import java.util.UUID;

public class ItemListNotFoundException extends RuntimeException {
    public ItemListNotFoundException(UUID id) {
        super("Item list not found with id: " + id);
    }
}
