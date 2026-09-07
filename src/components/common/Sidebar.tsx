import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Store,
  MapPin,
  Calendar,
  WalletCards,
  BookOpenCheck,
  Scale,
  Sparkles,
  Megaphone,
  Share2,
  HelpCircle,
  FolderArchive,
  FileSpreadsheet,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { ModuleKey } from '../../types';

interface NavItem {
  key: ModuleKey;
  label: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

interface SidebarProps {
  onOpenGIS?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeModule,
    setActiveModule,
    canAccess,
    currentUser,
    tourists,
    establishments,
    msmes,
    destinations,
    events,
    notices,
    complaints,
    tiacLogs,
  } = useTourism();

  const pendingNoticesCount = notices.filter((n) => n.status === 'Pending Corrective Action').length;
  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Resolved / Closed').length;

  const navGroups: NavGroup[] = [
    {
      groupName: 'Operations',
      items: [
        {
          key: 'dashboard',
          label: 'Dashboard',
          code: 'DASH',
          icon: LayoutDashboard,
        },
        {
          key: 'tourists',
          label: 'Tourist Arrivals',
          code: 'TAMS',
          icon: Users,
          badge: tourists.length,
          badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
        },
        {
          key: 'establishments',
          label: 'Establishments',
          code: 'TED',
          icon: Building2,
          badge: establishments.length,
          badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
        },
        {
          key: 'msmes',
          label: 'MSME Directory',
          code: 'MSME',
          icon: Store,
          badge: msmes.length,
          badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        },
        {
          key: 'destinations',
          label: 'Destinations',
          code: 'TDD',
          icon: MapPin,
          badge: destinations.length,
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        },
        {
          key: 'tiac',
          label: 'Visitor Assistance (TIAC)',
          code: 'TIAC',
          icon: HelpCircle,
          badge: tiacLogs.length,
        },
      ],
    },
    {
      groupName: 'Governance & Promotion',
      items: [
        {
          key: 'events',
          label: 'Events & Programs',
          code: 'EMS',
          icon: Calendar,
          badge: events.length,
        },
        {
          key: 'policy_regulation',
          label: 'Policy & Regulation',
          code: 'PSRU',
          icon: Scale,
          badge: pendingNoticesCount + activeComplaintsCount || undefined,
          badgeColor: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
        },
        {
          key: 'research_planning',
          label: 'Research & Planning',
          code: 'RPU',
          icon: BookOpenCheck,
        },
        {
          key: 'product_dev',
          label: 'Product Development',
          code: 'TPDU',
          icon: Sparkles,
        },
        {
          key: 'marketing',
          label: 'Promotion & Marketing',
          code: 'PMU',
          icon: Megaphone,
        },
        {
          key: 'social_media',
          label: 'Social Media Analytics',
          code: 'SMMS',
          icon: Share2,
        },
        {
          key: 'admin_finance',
          label: 'Admin & Finance',
          code: 'AFS',
          icon: WalletCards,
        },
        {
          key: 'documents',
          label: 'Document Library',
          code: 'DMS',
          icon: FolderArchive,
        },
        {
          key: 'reports',
          label: 'DOT Reports & RGM',
          code: 'RGM',
          icon: FileSpreadsheet,
          badge: 'DOT',
          badgeColor: 'bg-indigo-600 text-white font-bold',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      <aside
        className={`w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none h-screen transition-transform duration-200 z-50 fixed md:static inset-y-0 left-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Official Brand Header with Logos */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2 shrink-0">
              <img
                src="/logo/LGU_LOGO1.png"
                alt="LGU Malungon Seal"
                className="w-10 h-10 object-contain rounded-full bg-white/10 p-0.5 border border-emerald-500/40 shadow-sm"
              />
              <img
                src="/logo/TourismLogo.png"
                alt="Tourism Office Logo"
                className="w-10 h-10 object-contain rounded-full bg-white/10 p-0.5 border border-teal-500/40 shadow-sm"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-black text-white tracking-tight text-base leading-tight flex items-center gap-1.5">
                <span>MTODMS</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                  LGU
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5 font-medium">
                Municipality of Malungon
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-slate-500">
            <span>Tourism Office</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              PWA Ready
            </span>
          </div>
        </div>

        {/* Navigation Group Items */}
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar text-sm space-y-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-0.5">
              <div className="px-6 py-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {group.groupName}
              </div>

              {group.items.map((item) => {
                const accessible = canAccess(item.key);
                const isActive = activeModule === item.key;
                const Icon = item.icon;

                return (
                  <button
                    key={item.key}
                    disabled={!accessible}
                    onClick={() => {
                      if (accessible) {
                        setActiveModule(item.key);
                        if (onCloseMobile) onCloseMobile();
                      }
                    }}
                    className={`w-full flex items-center justify-between px-6 py-2.5 text-xs transition-colors group text-left ${
                      isActive
                        ? 'bg-indigo-600/10 text-indigo-400 border-r-2 border-indigo-400 font-semibold'
                        : accessible
                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        : 'text-slate-600 cursor-not-allowed opacity-40'
                    }`}
                    title={!accessible ? 'Access restricted for current user role' : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-indigo-400'
                            : accessible
                            ? 'text-slate-400 group-hover:text-white'
                            : 'text-slate-600'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-1.5">
                      {!accessible ? (
                        <Lock className="w-3 h-3 text-slate-600" />
                      ) : item.badge !== undefined ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            item.badgeColor || (isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400')
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sleek User Profile Footer */}
        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full bg-slate-700 object-cover border border-slate-700 shrink-0"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
