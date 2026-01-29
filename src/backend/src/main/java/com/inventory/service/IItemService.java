package com.inventory.service;

import com.inventory.dto.request.ItemRequest;
import com.inventory.dto.request.ItemSearchCriteria;
import com.inventory.dto.response.DashboardStats;
import com.inventory.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface IItemService {

    // Read operations
    Page<Item> getAllItems(Pageable pageable, ItemSearchCriteria criteria);

    Item getItemById(UUID id);

    DashboardStats getDashboardStats();

    // Write operations
    Item createItem(ItemRequest request, MultipartFile image) throws IOException;

    Item updateItem(UUID id, ItemRequest request, MultipartFile image) throws IOException;

    void deleteItem(UUID id);
}
