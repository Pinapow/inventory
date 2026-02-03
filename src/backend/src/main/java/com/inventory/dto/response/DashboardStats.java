package com.inventory.dto.response;

import java.util.Map;

public record DashboardStats(
        long totalItems,
        Map<String, Long> countByStatus,
        Map<String, Long> countByCategory) {
}
