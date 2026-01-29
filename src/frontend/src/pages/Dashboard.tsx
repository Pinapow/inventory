import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';
import { dashboardApi } from '../services/api';
import { DashboardStats } from '../types/item';
import { SkeletonStatCard, SkeletonText, Skeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      showToast('Failed to load dashboard stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <SkeletonText className="w-32 h-9 mb-2" />
          <SkeletonText className="w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
        <div className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 rounded-2xl border border-white/[0.06] shadow-premium p-6">
          <SkeletonText className="w-40 h-5 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <SkeletonText className="w-24" />
                <Skeleton className="h-6 w-8 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statusCards = [
    { label: 'Total Items', value: stats?.totalItems || 0, icon: Package, color: 'bg-gradient-to-br from-amber-500 to-amber-600', glow: 'shadow-glow-amber' },
    { label: 'In Stock', value: stats?.countByStatus?.['In Stock'] || 0, icon: TrendingUp, color: 'bg-gradient-to-br from-lime-500 to-lime-600', glow: 'shadow-glow-lime' },
    { label: 'Low Stock', value: stats?.countByStatus?.['Low Stock'] || 0, icon: AlertTriangle, color: 'bg-gradient-to-br from-amber-400 to-amber-500', glow: 'shadow-glow-amber' },
    { label: 'Out of Stock', value: stats?.countByStatus?.['Out of Stock'] || 0, icon: XCircle, color: 'bg-gradient-to-br from-red-400 to-red-500', glow: 'shadow-glow-red' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-stone-100 tracking-tight">Dashboard</h1>
        <p className="text-stone-400 mt-1">Overview of your inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statusCards.map((card, index) => (
          <div
            key={card.label}
            className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 backdrop-blur-xl rounded-2xl border border-white/[0.06] shadow-premium p-6 transition-all duration-300 hover:shadow-premium-hover hover:border-white/[0.1] hover:-translate-y-1 group animate-fade-in-up"
            style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}
          >
            <div className="flex items-center">
              <div className={`${card.color} ${card.glow} p-3 rounded-xl transition-transform duration-200 group-hover:scale-110`}>
                <card.icon className="h-6 w-6 text-surface-base" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-semibold text-stone-100 tracking-tight">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats && Object.keys(stats.countByCategory).length > 0 && (
        <div className="bg-gradient-to-br from-surface-elevated/80 to-surface-card/80 backdrop-blur-xl rounded-2xl border border-white/[0.06] shadow-premium p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-stone-100 mb-4 tracking-tight">Items by Category</h2>
          <div className="space-y-2">
            {Object.entries(stats.countByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors duration-200">
                <span className="text-stone-300">{category}</span>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/inventory"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-surface-base font-semibold rounded-xl shadow-glow-amber transition-all duration-200 hover:from-amber-400 hover:to-amber-500 hover:-translate-y-0.5 active:translate-y-0"
        >
          View All Items
        </Link>
      </div>
    </div>
  );
}
