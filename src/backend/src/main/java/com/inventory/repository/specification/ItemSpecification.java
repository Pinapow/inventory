package com.inventory.repository.specification;

import com.inventory.dto.request.ItemSearchCriteria;
import com.inventory.model.Item;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.lang.NonNull;

import static org.springframework.util.StringUtils.hasText;

public class ItemSpecification {

    private ItemSpecification() {
        // Utility class
    }

    @NonNull
    public static Specification<Item> withCriteria(ItemSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria != null) {
                if (hasText(criteria.search())) {
                    String pattern = "%" + criteria.search().toLowerCase() + "%";
                    predicates.add(cb.like(cb.lower(root.get("name")), pattern));
                }

                if (criteria.itemListId() != null) {
                    predicates.add(cb.equal(root.get("itemList").get("id"), criteria.itemListId()));
                }

                if (criteria.status() != null) {
                    predicates.add(cb.equal(root.get("status"), criteria.status()));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
