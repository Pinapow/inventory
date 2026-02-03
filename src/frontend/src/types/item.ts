export interface Item {
  id: string;
  name: string;
  category: string;
  status: string;
  imageBase64?: string;
  contentType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFormData {
  name: string;
  category: string;
  status: string;
}

export interface DashboardStats {
  totalItems: number;
  countByStatus: Record<string, number>;
  countByCategory: Record<string, number>;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ItemSearchParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
  category?: string;
  status?: string;
}

export const STATUS_OPTIONS = ['IN_STOCK', 'OUT_OF_STOCK', 'SOLD', 'DAMAGED'] as const;

export const STATUS_LABELS: Record<string, string> = {
  IN_STOCK: 'In Stock',
  OUT_OF_STOCK: 'Out of Stock',
  SOLD: 'Sold',
  DAMAGED: 'Damaged',
};

export const formatStatus = (status: string): string => {
  return STATUS_LABELS[status] || status;
};
