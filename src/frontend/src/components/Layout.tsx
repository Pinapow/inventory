import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Package } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/lists', label: 'Mes Listes', icon: List },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gradient-to-b from-surface-elevated to-surface-base border-r border-white/[0.06] fixed h-full">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-glow-amber">
              <Package className="h-5 w-5 text-surface-base" />
            </div>
            <div className="ml-3">
              <span className="font-display text-xl text-stone-100">Inventory</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-4" />

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to ||
              (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-glow-amber animate-glow-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
