package com.inventory.service.impl;

import com.inventory.dto.request.ItemListRequest;
import com.inventory.exception.ItemListNotFoundException;
import com.inventory.model.ItemList;
import com.inventory.repository.ItemListRepository;
import com.inventory.service.IItemListService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ItemListServiceImpl implements IItemListService {

    private final ItemListRepository itemListRepository;

    public ItemListServiceImpl(ItemListRepository itemListRepository) {
        this.itemListRepository = itemListRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemList> getAllLists(@NonNull Pageable pageable) {
        return itemListRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemList getListById(@NonNull UUID id) {
        return itemListRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ItemListNotFoundException(id));
    }

    @Override
    @Transactional
    public ItemList createList(@NonNull ItemListRequest request) {
        ItemList itemList = new ItemList();
        itemList.setName(request.name());
        itemList.setDescription(request.description());
        itemList.setCategory(request.category());
        return itemListRepository.save(itemList);
    }

    @Override
    @Transactional
    public ItemList updateList(@NonNull UUID id, @NonNull ItemListRequest request) {
        ItemList itemList = getListById(id);
        itemList.setName(request.name());
        itemList.setDescription(request.description());
        itemList.setCategory(request.category());
        return itemListRepository.save(itemList);
    }

    @Override
    @Transactional
    public void deleteList(@NonNull UUID id) {
        if (!itemListRepository.existsById(id)) {
            throw new ItemListNotFoundException(id);
        }
        itemListRepository.deleteById(id);
    }
}
