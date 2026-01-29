package com.inventory.exception;

import java.util.UUID;

public class ItemNotFoundException extends RuntimeException {

    public ItemNotFoundException(String message) {
        super(message);
    }

    public ItemNotFoundException(UUID id) {
        super("Item not found with id: " + id);
    }
}
