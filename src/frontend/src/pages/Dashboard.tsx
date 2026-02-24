import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Search, Archive, Hourglass, AlertCircle, RefreshCw } from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { SkeletonStatCard, SkeletonText, Skeleton } from '../components/Skeleton';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/effects/blur-fade';
import { NumberTicker } from '@/components/effects/number-ticker';
import { SpotlightCard } from '@/components/effects/spotlight-card';
import { StaggeredList, StaggeredItem } from '@/components/effects/staggered-list';

export default function Dashboard() {
  const { stats, loading, error, reload } = useDashboardStats();

  if (loading) {
    return (
      <div>
        <div className="mb-10">
          <SkeletonText className="w-48 h-10 mb-2" />
          <SkeletonText className="w-64 h-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[...Array(6)].map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="font-display text-xl font-semibold mb-2">Impossible de charger les statistiques</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Une erreur est survenue lors du chargement du tableau de bord.
        </p>
        <Button onClick={reload}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reessayer
        </Button>
      </div>
    );
  }

  const statusCards = [
    { label: 'Total articles', value: stats?.totalItems || 0, icon: Package, bg: 'bg-foreground', iconColor: 'text-background' },
    { label: 'A preparer', value: stats?.countByStatus?.['TO_PREPARE'] || 0, icon: Clock, bg: 'bg-status-prepare', iconColor: 'text-status-prepare-text' },
    { label: 'A verifier', value: stats?.countByStatus?.['TO_VERIFY'] || 0, icon: Search, bg: 'bg-status-verify', iconColor: 'text-status-verify-text' },
    { label: 'En attente', value: stats?.countByStatus?.['PENDING'] || 0, icon: Hourglass, bg: 'bg-status-pending', iconColor: 'text-status-pending-text' },
    { label: 'Pret', value: stats?.countByStatus?.['READY'] || 0, icon: CheckCircle, bg: 'bg-status-ready', iconColor: 'text-status-ready-text' },
    { label: 'Archive', value: stats?.countByStatus?.['ARCHIVED'] || 0, icon: Archive, bg: 'bg-status-archived', iconColor: 'text-status-archived-text' },
  ];

  const maxCategoryCount = stats ? Math.max(...Object.values(stats.countByCategory), 1) : 1;

  const pastelBarColors = [
    'bg-peach',
    'bg-status-verify',
    'bg-status-pending',
    'bg-status-ready',
    'bg-status-prepare',
    'bg-status-archived',
  ];

  return (
    <div>
      <div className="mb-10">
        <BlurFade delay={0.1}>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Tableau de bord</h1>
        </BlurFade>
        <BlurFade delay={0.2}>
          <p className="text-muted-foreground mt-2">Apercu de votre inventaire</p>
        </BlurFade>
      </div>

      {/* Asymmetric stat grid */}
      <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10" staggerDelay={0.08}>
        {/* Hero card - spans 2 cols on lg */}
        <StaggeredItem className="lg:col-span-2 lg:row-span-2">
          <SpotlightCard className="h-full rounded-2xl border bg-card p-8 shadow-card transition-shadow duration-300 hover:shadow-elevated">
            <div className="flex items-start justify-between mb-6">
              <div className={`${statusCards[0].bg} p-3.5 rounded-xl`}>
                <Package className={`h-7 w-7 ${statusCards[0].iconColor}`} />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">{statusCards[0].label}</p>
            <NumberTicker
              value={statusCards[0].value}
              className="text-6xl lg:text-7xl font-display font-bold tracking-tighter"
              duration={1.2}
            />
            <div className="mt-6">
              <Link to="/lists">
                <Button variant="outline" size="sm">
                  Voir mes listes
                </Button>
              </Link>
            </div>
          </SpotlightCard>
        </StaggeredItem>

        {/* Remaining status cards */}
        {statusCards.slice(1).map((card) => (
          <StaggeredItem key={card.label}>
            <SpotlightCard className="rounded-2xl border bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-elevated">
              <div className="flex items-center gap-4">
                <div className={`${card.bg} p-3 rounded-xl`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{card.label}</p>
                  <NumberTicker
                    value={card.value}
                    className="text-2xl font-display font-bold tracking-tight"
                    duration={0.8}
                    delay={0.2}
                  />
                </div>
              </div>
            </SpotlightCard>
          </StaggeredItem>
        ))}
      </StaggeredList>

      {/* Category breakdown - horizontal bars */}
      {stats && Object.keys(stats.countByCategory).length > 0 && (
        <BlurFade delay={0.5}>
          <div className="rounded-2xl border bg-card p-8 shadow-card">
            <h2 className="font-display text-xl font-semibold tracking-tight mb-6">Articles par categorie</h2>
            <div className="space-y-4">
              {Object.entries(stats.countByCategory).map(([category, count], index) => {
                const width = Math.max((count / maxCategoryCount) * 100, 8);
                const barColor = pastelBarColors[index % pastelBarColors.length];
                return (
                  <div key={category} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-muted-foreground font-medium">{count}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </BlurFade>
      )}
    </div>
  );
}
