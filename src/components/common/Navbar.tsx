import React, { useState, useEffect } from 'react';
import {
  Compass,
  History,
  Database,
  BellRing,
  UserCheck,
  ChevronDown,
  Shield,
  Search,
  Check,
  AlertCircle,
  Menu,
  FileSpreadsheet,
  Download,
  Smartphone
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';

interface NavbarProps {
  onOpenAudit: () => void;
  onOpenBackup: () => void;
  onOpenNotify?: () => void;
  onOpenNotification?: () => void;
  onOpenGIS: () => void;
  onGlobalSearch?: (term: string) => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAudit,
  onOpenBackup,
  onOpenNotify,
  onOpenNotification,
  onOpenGIS,
  onGlobalSearch,
  onToggleMobileSidebar,
}) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    activeModule,
    setActiveModule,
    notifications,
    isReadOnly,
  } = useTourism();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      alert('MTODMS is PWA-ready! You can install it via your browser menu (e.g., "Install app" or "Add to Home screen").');
    }
  };

  const triggerNotify = onOpenNotification || onOpenNotify || (() => {});

  // Philippine Standard Time real-time clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onGlobalSearch) onGlobalSearch(e.target.value);
  };

  // Get active module title
  const getModuleTitle = () => {
    switch (activeModule) {
      case 'dashboard':
        return 'Tourism Command Center';
      case 'tourists':
        return 'Tourist Arrival Management';
      case 'establishments':
        return 'Tourism Establishments Directory';
      case 'msmes':
        return 'MSME Tourism Database';
      case 'destinations':
        return 'Destinations & GIS Attractions';
      case 'events':
        return 'Events Management System';
      case 'admin_finance':
        return 'Administrative & Finance System';
      case 'research_planning':
        return 'Research & Planning Unit';
      case 'policy_regulation':
        return 'Policy Support & Regulation';
      case 'product_dev':
        return 'Tourism Product Development';
      case 'marketing':
        return 'Promotion & Marketing Unit';
      case 'social_media':
        return 'Social Media Analytics';
      case 'tiac':
        return 'Tourist Information & Assistance';
      case 'documents':
        return 'Document Management System';
      case 'reports':
        return 'Report Generation Module';
      default:
        return 'Municipal Tourism Database';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-30 relative shadow-2xs">
      {/* Left: Mobile hamburger, Module Title & Live Sync badge */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center -space-x-1.5 shrink-0">
          <img
            src="/logo/LGU_LOGO1.png"
            alt="LGU Malungon Seal"
            className="w-8 h-8 object-contain rounded-full bg-white shadow-xs border border-emerald-500/30 hover:scale-105 transition-transform"
          />
          <img
            src="/logo/TourismLogo.png"
            alt="Tourism Office Logo"
            className="w-8 h-8 object-contain rounded-full bg-white shadow-xs border border-teal-500/30 hover:scale-105 transition-transform"
          />
        </div>
        <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate tracking-tight">
          {getModuleTitle()}
        </h1>
        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase shrink-0 hidden sm:inline-block">
          Live Sync
        </span>
      </div>

      {/* Center/Search (Hidden on smaller screens) */}
      <div className="hidden xl:flex items-center flex-1 max-w-xs mx-4 relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search records, MSMEs, tourists..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Right: Weather, Quick Tools, Report, & User Switcher */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* PWA Install Button */}
        {!isInstalled && (
          <button
            onClick={handleInstallClick}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
            title="Install MTODMS as a Desktop or Mobile Application (PWA)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install PWA</span>
          </button>
        )}

        {/* Real-time Weather / Status */}
        <div className="hidden lg:flex items-center text-xs text-slate-500 gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Weather: 28°C / Clear</span>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

        {/* GIS Map Trigger */}
        <button
          onClick={onOpenGIS}
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
          title="Open Municipal GIS Map"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>GIS Map</span>
        </button>

        {/* Notifications / Broadcast */}
        <button
          onClick={triggerNotify}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative"
          title="System Notifications & Broadcasts"
        >
          <BellRing className="w-4 h-4" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
          )}
        </button>

        {/* Audit Log */}
        <button
          onClick={onOpenAudit}
          className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
          title="System Audit Log"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden lg:inline">Audit</span>
        </button>

        {/* Backup & Restore */}
        <button
          onClick={onOpenBackup}
          className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
          title="Database Backup & Restore"
        >
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden lg:inline">Backup</span>
        </button>

        {/* Primary Action Button: Generate DOT Report */}
        <button
          onClick={() => setActiveModule('reports')}
          className="bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-600 transition-all shadow-xs flex items-center gap-1.5"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">DOT Reports</span>
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center space-x-2 p-1 sm:pl-2 sm:pr-2.5 sm:py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0"
            />
            <div className="hidden xl:block leading-tight">
              <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Role Dropdown Menu */}
          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 text-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 bg-slate-900 text-white">
                <div className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">
                  Active User Role & Access Level
                </div>
                <div className="font-semibold text-sm mt-0.5">{currentUser.name}</div>
                <div className="text-xs text-slate-400">{currentUser.department}</div>
              </div>

              <div className="p-2 border-b border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Switch Role to Test Access Rights:</span>
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-1">
                {users.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full p-2 text-left rounded-lg transition-colors flex items-center justify-between text-xs ${
                        isSelected ? 'bg-indigo-50 text-indigo-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <div className="font-medium text-slate-900 leading-tight">{u.name}</div>
                          <div className="text-[10px] text-slate-500 leading-tight">{u.role}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Role restricts navigation tabs & data permissions per Section IV mandates.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Read-Only Notice Bar if guest */}
      {isReadOnly && (
        <div className="absolute top-16 left-0 right-0 bg-amber-500 text-white px-4 py-1 text-center text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm z-20">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Viewing in Public Guest Mode (Read-Only). Switch role from top-right to unlock operational editing.</span>
        </div>
      )}
    </header>
  );
};
