export interface ItemList {
  id: string;
  name: string;
  description?: string;
  category?: string;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemListWithItems extends ItemList {
  items: Item[];
}

export interface ItemListFormData {
  name: string;
  description?: string;
  category?: string;
}

export interface Item {
  id: string;
  name: string;
  itemListId: string;
  status: string;
  stock: number;
  hasImage: boolean;
  contentType?: string;
  createdAt: string;
  updatedAt: string;
}

export const getItemImageUrl = (itemId: string): string => {
  return `/api/v1/items/${itemId}/image`;
};

export interface ItemFormData {
  name: string;
  itemListId: string;
  status: string;
  stock: number;
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
  itemListId?: string;
  status?: string;
}

export interface ItemListSearchParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const STATUS_OPTIONS = ['TO_PREPARE', 'TO_VERIFY', 'PENDING', 'READY', 'ARCHIVED'] as const;

export const STATUS_LABELS: Record<string, string> = {
  TO_PREPARE: 'À préparer',
  TO_VERIFY: 'À vérifier',
  PENDING: 'En attente',
  READY: 'Prêt',
  ARCHIVED: 'Archivé',
};

export const formatStatus = (status: string): string => {
  return STATUS_LABELS[status] || status;
};
