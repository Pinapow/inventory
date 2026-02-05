package com.inventory.repository;

import com.inventory.model.ItemList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItemListRepository extends JpaRepository<ItemList, UUID>, JpaSpecificationExecutor<ItemList> {

    @Query("SELECT il.category, COUNT(il) FROM ItemList il GROUP BY il.category")
    List<Object[]> countByCategory();

    @Query("SELECT COUNT(i) FROM Item i WHERE i.itemList.id = :listId")
    long countItemsByListId(UUID listId);

    @Query("SELECT il FROM ItemList il LEFT JOIN FETCH il.items WHERE il.id = :id")
    Optional<ItemList> findByIdWithItems(UUID id);
}
