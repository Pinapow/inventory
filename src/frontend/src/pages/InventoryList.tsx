import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { itemsApi } from '../services/api';
import { Item, STATUS_OPTIONS, ItemSearchParams } from '../types/item';
import { SkeletonCard, SkeletonText, Skeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';

export default function InventoryList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const { showToast } = useToast();

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const params: ItemSearchParams = {
        page,
        size: 9,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const response = await itemsApi.getAll(params);
      setItems(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Failed to load items:', error);
      showToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, showToast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setDeletingId(id);
    try {
      await itemsApi.delete(id);
      showToast('Item deleted successfully', 'success');
      loadItems(); // Reload to update pagination
    } catch (error) {
      console.error('Failed to delete item:', error);
      showToast('Failed to delete item', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-lime-500/10 text-lime-400 border border-lime-500/20';
      case 'Low Stock':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Out of Stock':
        return 'bg-red-400/10 text-red-400 border border-red-400/20';
      default:
        return 'bg-stone-500/10 text-stone-400 border border-stone-500/20';
    }
  };

  if (loading && items.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <SkeletonText className="w-28 h-9" />
            <SkeletonText className="w-20" />
          </div>
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
        <div className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 rounded-2xl border border-white/[0.06] shadow-premium mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="flex-1 h-11 rounded-xl" />
            <Skeleton className="w-36 h-11 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl text-stone-100 tracking-tight">Inventory</h1>
          <p className="text-stone-500 mt-1">{totalElements} items total</p>
        </div>
        <Link
          to="/inventory/new"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-surface-base font-semibold rounded-xl shadow-glow-amber transition-all duration-200 hover:from-amber-400 hover:to-amber-500 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Item
        </Link>
      </div>

      <div className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 backdrop-blur-xl rounded-2xl border border-white/[0.06] shadow-premium mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-base/50 border border-white/[0.08] rounded-xl text-stone-100 placeholder-stone-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 hover:border-white/[0.12]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-surface-base/50 border border-white/[0.08] rounded-xl text-stone-100 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 hover:border-white/[0.12]"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 backdrop-blur-xl rounded-2xl border border-white/[0.06] shadow-premium overflow-hidden transition-all duration-300 hover:shadow-premium-hover hover:border-white/[0.1] hover:-translate-y-1 group animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
          >
            <div className="h-48 bg-surface-base/50 flex items-center justify-center overflow-hidden relative">
              {item.imageBase64 ? (
                <>
                  <img
                    src={`data:${item.contentType};base64,${item.imageBase64}`}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-base/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              ) : (
                <div className="text-stone-600 flex flex-col items-center">
                  <Package className="h-12 w-12 mb-2 opacity-40" />
                  <span className="text-sm">No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-stone-100 tracking-tight">{item.name}</h3>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider ${getStatusBadgeClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-stone-500 text-sm mb-4">{item.category || 'Uncategorized'}</p>
              <div className="flex gap-2">
                <Link
                  to={`/inventory/${item.id}/edit`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] text-stone-300 font-medium rounded-xl transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-stone-100"
                >
                  <Pencil className="h-4 w-4 mr-1.5" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  aria-label={`Delete ${item.name}`}
                  className="inline-flex items-center justify-center px-3 py-2.5 border border-red-400/30 text-red-400 rounded-xl transition-all duration-200 hover:bg-red-400/10 hover:border-red-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className={`h-4 w-4 ${deletingId === item.id ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="text-center py-16 text-stone-500 animate-fade-in">
          <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No items found.</p>
          {totalElements === 0 && (
            <Link to="/inventory/new" className="text-amber-400 hover:text-amber-300 transition-colors mt-2 inline-block">
              Add your first item
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center px-4 py-2 bg-white/[0.04] border border-white/[0.08] text-stone-300 font-medium rounded-xl transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.12] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <span className="text-stone-400">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center px-4 py-2 bg-white/[0.04] border border-white/[0.08] text-stone-300 font-medium rounded-xl transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.12] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
