package com.inventory.repository.specification;

import com.inventory.dto.request.ItemSearchCriteria;
import com.inventory.model.Item;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.util.StringUtils.hasText;

public class ItemSpecification {

    private ItemSpecification() {
        // Utility class
    }

    public static Specification<Item> withCriteria(ItemSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria != null) {
                if (hasText(criteria.getSearch())) {
                    String pattern = "%" + criteria.getSearch().toLowerCase() + "%";
                    predicates.add(cb.or(
                            cb.like(cb.lower(root.get("name")), pattern),
                            cb.like(cb.lower(root.get("category")), pattern)));
                }

                if (hasText(criteria.getCategory())) {
                    predicates.add(cb.equal(root.get("category"), criteria.getCategory()));
                }

                if (hasText(criteria.getStatus())) {
                    predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
