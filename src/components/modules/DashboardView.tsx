import React, { useState, useMemo } from 'react';
import {
  Users,
  Building2,
  TrendingUp,
  Award,
  Calendar,
  CloudSun,
  AlertTriangle,
  Compass,
  MapPin,
  CheckCircle,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  Filter,
  RefreshCw,
  Printer,
  Download,
  Eye,
  Plus,
  Minus,
  AlertCircle,
  Sparkles,
  X,
  Check,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  BedDouble,
  Navigation
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import { QRCodeModal } from '../common/QRCodeModal';
import { TourismDestination } from '../../types';

interface DashboardViewProps {
  onOpenGIS: () => void;
  onOpenNotify?: () => void;
}

type TimeframeOption = 'all' | 'today' | '7d' | 'month' | 'q3' | 'ytd';
type TravelerFilter = 'all' | 'domestic' | 'foreign';

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenGIS, onOpenNotify }) => {
  const {
    tourists,
    establishments,
    msmes,
    destinations,
    events,
    financial,
    notices,
    complaints,
    setActiveModule,
    municipalityInfo,
    updateDestination,
    currentUser,
  } = useTourism();

  // Filters State
  const [timeframe, setTimeframe] = useState<TimeframeOption>('all');
  const [selectedBarangay, setSelectedBarangay] = useState<string>('all');
  const [travelerType, setTravelerType] = useState<TravelerFilter>('all');
  const [chartMetric, setChartMetric] = useState<'volume' | 'spending'>('volume');

  // Modals State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [briefingModalOpen, setBriefingModalOpen] = useState(false);
  const [drilldownModalOpen, setDrilldownModalOpen] = useState(false);
  const [weatherAlertMode, setWeatherAlertMode] = useState<'Normal' | 'Advisory' | 'Suspended'>('Normal');
  const [capacityAdjustMsg, setCapacityAdjustMsg] = useState<string | null>(null);

  const [qrModalData, setQrModalData] = useState<{
    title: string;
    subtitle: string;
    codeData: string;
    extraDetails: { label: string; value: string }[];
  }>({
    title: '',
    subtitle: '',
    codeData: '',
    extraDetails: [],
  });

  // Extract unique barangays for filter dropdown
  const uniqueBarangays = useMemo(() => {
    const bgys = new Set<string>();
    destinations.forEach((d) => {
      if (d.barangay) bgys.add(d.barangay);
    });
    tourists.forEach((t) => {
      if (t.destinationVisited) {
        const matchingDest = destinations.find((d) => d.siteName.toLowerCase() === t.destinationVisited.toLowerCase());
        if (matchingDest && matchingDest.barangay) bgys.add(matchingDest.barangay);
      }
    });
    return Array.from(bgys).sort();
  }, [destinations, tourists]);

  // Dynamic Filtering Logic
  const filteredTourists = useMemo(() => {
    return tourists.filter((t) => {
      // Traveler type filter
      if (travelerType === 'domestic' && t.isForeign) return false;
      if (travelerType === 'foreign' && !t.isForeign) return false;

      // Barangay filter
      if (selectedBarangay !== 'all') {
        const dest = destinations.find(
          (d) => d.siteName.toLowerCase() === t.destinationVisited.toLowerCase()
        );
        if (!dest || dest.barangay !== selectedBarangay) return false;
      }

      // Timeframe filter
      if (timeframe === 'today') {
        return t.dateOfVisit === '2026-09-02' || t.dateOfVisit === '2026-09-04';
      }
      if (timeframe === '7d') {
        return t.dateOfVisit >= '2026-08-25';
      }
      if (timeframe === 'month') {
        return t.dateOfVisit.startsWith('2026-09');
      }
      if (timeframe === 'q3') {
        return t.dateOfVisit >= '2026-07-01' && t.dateOfVisit <= '2026-09-30';
      }
      if (timeframe === 'ytd') {
        return t.dateOfVisit.startsWith('2026');
      }

      return true;
    });
  }, [tourists, destinations, timeframe, selectedBarangay, travelerType]);

  // Derived Key Metrics
  const totalTourists = filteredTourists.length;
  const foreignTourists = filteredTourists.filter((t) => t.isForeign).length;
  const domesticTourists = totalTourists - foreignTourists;
  const foreignPercentage = totalTourists > 0 ? Math.round((foreignTourists / totalTourists) * 100) : 0;
  const domesticPercentage = 100 - foreignPercentage;

  // Overnight vs Same-Day (Excursionist) Breakdown (DOT Form 1 Metric)
  const overnightTourists = filteredTourists.filter(
    (t) => (t.numberOfDaysStayed && t.numberOfDaysStayed > 0) || (t.accommodationUsed && t.accommodationUsed !== 'None / Day Trip' && t.accommodationUsed !== 'N/A')
  ).length;
  const sameDayTourists = Math.max(0, totalTourists - overnightTourists);
  const overnightPercentage = totalTourists > 0 ? Math.round((overnightTourists / totalTourists) * 100) : 0;

  // Enterprise & Accreditation Metrics
  const totalEnterprises = establishments.length;
  const accreditedEnterprises = establishments.filter((e) => e.dotAccreditationStatus === 'Accredited').length;
  const accreditationRate = totalEnterprises > 0 ? Math.round((accreditedEnterprises / totalEnterprises) * 100) : 0;
  const pendingAccreditation = establishments.filter((e) => e.dotAccreditationStatus === 'Application Pending' || e.dotAccreditationStatus === 'Under Inspection').length;

  // Spending & Receipts Metrics
  const totalTouristSpending = filteredTourists.reduce((sum, t) => sum + (t.touristSpending || 0), 0);
  const averageSpending = totalTourists > 0 ? Math.round(totalTouristSpending / totalTourists) : 0;
  const indirectEconomicImpact = Math.round(totalTouristSpending * 1.84); // 1.84x LGU regional tourism multiplier

  // Regulatory Alerts
  const pendingNotices = notices.filter((n) => n.status === 'Pending Corrective Action').length;
  const activeComplaints = complaints.filter((c) => c.status !== 'Resolved / Closed').length;

  // Monthly Trend Chart Data (Interactive & Reflective of Filter Scope)
  const monthlyData = useMemo(() => {
    // Base baseline calibrated for LGU Malungon seasonality
    const baseSeasonality = [
      { month: 'Jan', domestic: 1240, foreign: 85, spending: 2980000 },
      { month: 'Feb', domestic: 1480, foreign: 110, spending: 3450000 },
      { month: 'Mar', domestic: 2100, foreign: 195, spending: 5120000 },
      { month: 'Apr (Semana Santa)', domestic: 4850, foreign: 340, spending: 11840000 },
      { month: 'May (Summer Peak)', domestic: 5200, foreign: 410, spending: 13150000 },
      { month: 'Jun (Slang Festival)', domestic: 3950, foreign: 280, spending: 9800000 },
      { month: 'Jul', domestic: 1950, foreign: 140, spending: 4620000 },
      { month: 'Aug', domestic: 2300, foreign: 175, spending: 5540000 },
      { month: 'Sep (Current)', domestic: 2750 + domesticTourists * 10, foreign: 230 + foreignTourists * 5, spending: 6720000 + totalTouristSpending * 5 },
    ];

    if (timeframe === 'q3') {
      return baseSeasonality.filter((d) => ['Jul', 'Aug', 'Sep (Current)'].includes(d.month));
    }
    if (timeframe === 'month') {
      return baseSeasonality.filter((d) => d.month.startsWith('Sep'));
    }
    return baseSeasonality;
  }, [timeframe, domesticTourists, foreignTourists, totalTouristSpending]);

  // Purpose of Visit Donut Data
  const purposeChartData = useMemo(() => {
    const purposeCounts: Record<string, number> = {};
    filteredTourists.forEach((t) => {
      const p = t.purposeOfVisit || 'Leisure / Vacation';
      purposeCounts[p] = (purposeCounts[p] || 0) + 1;
    });

    if (Object.keys(purposeCounts).length === 0) {
      return [
        { name: 'Eco-Adventure', value: 8 },
        { name: 'Cultural / Heritage', value: 5 },
        { name: 'Leisure / Vacation', value: 4 },
        { name: 'Business / MICE', value: 2 },
      ];
    }

    return Object.entries(purposeCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredTourists]);

  // Top Visited Destinations Ranking
  const topDestinations = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredTourists.forEach((t) => {
      if (t.destinationVisited) {
        counts[t.destinationVisited] = (counts[t.destinationVisited] || 0) + 1;
      }
    });

    return destinations
      .map((d) => ({
        ...d,
        visitCount: counts[d.siteName] || 0,
        loadPercentage: Math.round((d.currentVisitorsToday / d.carryingCapacityDaily) * 100),
      }))
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 5);
  }, [filteredTourists, destinations]);

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

  // Quick QR Pass Generator
  const handleGenerateMunicipalPass = () => {
    setQrModalData({
      title: 'Municipal Tourism LGU Digital Verification Pass',
      subtitle: `${municipalityInfo.name} Official Tourism Clearance`,
      codeData: `MLG-TOURISM-PORTAL-AUTH-2026-VERIFIED-${Date.now().toString().slice(-6)}`,
      extraDetails: [
        { label: 'Issuing Authority', value: municipalityInfo.officeName },
        { label: 'Local Government Unit', value: `${municipalityInfo.name}, ${municipalityInfo.province}` },
        { label: 'Executive Officer', value: municipalityInfo.officerInCharge },
        { label: 'Validation Type', value: 'DOT/LGU Statutory Tourism Pass' },
        { label: 'Validity Period', value: 'Fiscal Year 2026 • Official Copy' },
      ],
    });
    setQrModalOpen(true);
  };

  // Adjust Site Real-Time Visitor Count (Telemetry Simulation for MTO desk / rangers)
  const handleAdjustVisitors = (dest: TourismDestination, delta: number) => {
    const newCount = Math.max(0, dest.currentVisitorsToday + delta);
    updateDestination(dest.id, { currentVisitorsToday: newCount });
    setCapacityAdjustMsg(`Updated ${dest.siteName}: ${newCount} / ${dest.carryingCapacityDaily} visitors.`);
    setTimeout(() => setCapacityAdjustMsg(null), 3000);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setTimeframe('all');
    setSelectedBarangay('all');
    setTravelerType('all');
  };

  const isFilterActive = timeframe !== 'all' || selectedBarangay !== 'all' || travelerType !== 'all';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome & Executive Actions */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-indigo-500/15 rounded-md text-[11px] font-semibold text-indigo-300 border border-indigo-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                <span>Module A • Executive Command & Decision Center</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-500/15 rounded-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                <span>DOT RA 9593 Compliant</span>
              </span>
            </div>

            <div className="flex items-center gap-3.5 pt-1">
              <div className="flex items-center -space-x-2 shrink-0">
                <img
                  src="/logo/LGU_LOGO1.png"
                  alt="LGU Malungon Seal"
                  className="w-12 h-12 object-contain rounded-full bg-white/10 p-0.5 border border-indigo-400/40 shadow-sm"
                />
                <img
                  src="/logo/TourismLogo.png"
                  alt="Tourism Office Logo"
                  className="w-12 h-12 object-contain rounded-full bg-white/10 p-0.5 border border-teal-400/40 shadow-sm"
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>{municipalityInfo.name}</span>
                  <span className="text-indigo-400 font-normal text-lg sm:text-xl hidden sm:inline">• {municipalityInfo.officeName}</span>
                </h2>
                <div className="text-indigo-400 font-medium text-xs sm:hidden mt-0.5">{municipalityInfo.officeName}</div>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Real-time executive oversight platform for visitor analytics, enterprise DOT accreditation, carrying capacity telemetry, disaster risk tourism advisories, and municipal economic impact reporting.
            </p>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <button
              onClick={() => setBriefingModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700 shadow-xs transition-all hover:scale-[1.02]"
              title="Open printable executive briefing summary for Mayor & Sangguniang Bayan"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Briefing</span>
            </button>

            <button
              onClick={handleGenerateMunicipalPass}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-all hover:scale-[1.02]"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Verify Digital Pass</span>
            </button>

            <button
              onClick={onOpenGIS}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 shadow-xs transition-all hover:scale-[1.02]"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>GIS Spatial Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Scope & Timeframe Filtering Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 font-bold text-slate-700 pr-2 border-r border-slate-200">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Scope Filter:</span>
          </div>

          {/* Timeframe selector */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            {(
              [
                { id: 'all', label: 'All Records' },
                { id: 'today', label: 'Today' },
                { id: '7d', label: '7 Days' },
                { id: 'month', label: 'Sep 2026' },
                { id: 'q3', label: 'Q3 2026' },
                { id: 'ytd', label: 'YTD 2026' },
              ] as { id: TimeframeOption; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  timeframe === t.id
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Barangay / Sector Filter */}
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Barangays & Zones</option>
            {uniqueBarangays.map((bgy) => (
              <option key={bgy} value={bgy}>
                Brgy. {bgy}
              </option>
            ))}
          </select>

          {/* Traveler Segment Filter */}
          <select
            value={travelerType}
            onChange={(e) => setTravelerType(e.target.value as TravelerFilter)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Travelers (Domestic & Foreign)</option>
            <option value="domestic">Domestic Travelers Only</option>
            <option value="foreign">Foreign Visitors Only</option>
          </select>

          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Dynamic active summary */}
        <div className="text-slate-500 text-[11px] flex items-center gap-2 self-end md:self-center">
          <span>
            Displaying <strong className="text-slate-800">{totalTourists}</strong> visitor entries • <strong className="text-slate-800">{destinations.length}</strong> monitored sites
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      {/* Real-time notification if capacity was adjusted */}
      {capacityAdjustMsg && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{capacityAdjustMsg}</span>
          </div>
          <span className="text-[10px] text-indigo-600 uppercase font-mono">Live Sync</span>
        </div>
      )}

      {/* Row 1: Four Key Interactive Executive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Tourist Arrivals */}
        <div
          onClick={() => setDrilldownModalOpen(true)}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view detailed tourist arrival drilldown"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tourist Arrivals</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">{totalTourists.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-semibold">Visitors</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span className="text-indigo-600 font-bold">{domesticPercentage}% Domestic</span>
                <span className="text-cyan-600 font-bold">{foreignPercentage}% Foreign</span>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden flex">
              <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${domesticPercentage}%` }}></div>
              <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${foreignPercentage}%` }}></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1">
              <BedDouble className="w-3 h-3 text-indigo-500" />
              <span>{overnightPercentage}% Overnight</span>
            </span>
            <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Drilldown</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 2: Registered Enterprises & DOT Accreditation */}
        <div
          onClick={() => setActiveModule('establishments')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view Tourism Establishments Directory"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enterprises & DOT</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">{totalEnterprises}</span>
                <span className="text-xs text-slate-500 font-semibold">Registered</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">{accreditedEnterprises} DOT Accredited</span>
                <span className="font-extrabold text-slate-700">{accreditationRate}%</span>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${accreditationRate}%` }}></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              {pendingAccreditation > 0 ? `${pendingAccreditation} Pending Inspection` : 'All Verified'}
            </span>
            <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Directory</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 3: Tourism Economic Receipts & Spending */}
        <div
          onClick={() => setActiveModule('tourists')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view tourist spending records"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tourism Receipts</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 truncate">
                ₱{totalTouristSpending.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span>Average Spend:</span>
                <span className="font-bold text-slate-800">₱{averageSpending.toLocaleString()} / pax</span>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>₱{indirectEconomicImpact.toLocaleString()} Stimulated</span>
            </span>
            <span className="text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Receipts</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 4: Compliance & Regulatory Alerts */}
        <div
          onClick={() => setActiveModule('policy_regulation')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view Policy and Regulatory enforcement"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Regulatory Matters</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                pendingNotices + activeComplaints > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">{pendingNotices + activeComplaints}</span>
                <span className="text-xs text-slate-500 font-semibold">Active Matters</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                <span className="text-rose-600 font-bold">{pendingNotices} NOV Inquiries</span>
                <span className="text-amber-600 font-bold">{activeComplaints} Complaints</span>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${pendingNotices + activeComplaints > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, (pendingNotices + activeComplaints) * 20)}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ordinance Enforcement</span>
            </span>
            <span className="text-rose-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Review</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Monthly Arrivals or Spending Trend */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {chartMetric === 'volume' ? 'Tourist Arrival Statistics (Monthly Inflow)' : 'Tourism Gross Receipts Trend (PHP ₱)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparative volume & economic yield analysis • Fiscal Year 2026
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
                <button
                  onClick={() => setChartMetric('volume')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    chartMetric === 'volume' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Visitor Volume
                </button>
                <button
                  onClick={() => setChartMetric('spending')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    chartMetric === 'spending' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Receipts (₱)
                </button>
              </div>
            </div>
          </div>

          <div className="h-68 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === 'volume' ? (
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()} pax`, '']}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                  />
                  <Bar dataKey="domestic" name="Domestic Travelers" fill="#4f46e5" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="foreign" name="Foreign Visitors" fill="#06b6d4" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              ) : (
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₱${(val / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`₱${Number(val).toLocaleString()}`, 'Total Receipts']}
                  />
                  <Area type="monotone" dataKey="spending" name="Estimated Receipts" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#spendingGrad)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Peak volumes correlate with Semana Santa & Malungon Slang Festival</span>
            </span>
            <span className="font-semibold text-slate-700">DOT SOCCSKSARGEN Benchmarked</span>
          </div>
        </div>

        {/* Visitor Purpose Distribution Donut */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <PieChartIcon className="w-4 h-4 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Visitor Motivation Profile</h3>
            </div>
            <p className="text-xs text-slate-500 mb-2">Primary purpose of travel (DOT Registry)</p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={purposeChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={48}
                    paddingAngle={3}
                  >
                    {purposeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any, name: any) => [`${val} visitors (${Math.round((Number(val) / totalTourists) * 100 || 0)}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 mt-2">
              {purposeChartData.slice(0, 4).map((p, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="truncate font-medium">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Overnight / Excursionist:</span>
            <span className="font-bold text-slate-800">
              {overnightTourists} stayed • {sameDayTourists} day trip
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Live Eco-Tourism Carrying Capacity & Real-Time Weather Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Destination Carrying Capacity Telemetry */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Destination Carrying Capacity & Ranger Telemetry</span>
              </h3>
              <p className="text-xs text-slate-500">
                Real-time headcounts vs established environmental threshold capacity
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenGIS}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Open GIS Map</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {destinations.map((dest) => {
              const capRatio = Math.round((dest.currentVisitorsToday / dest.carryingCapacityDaily) * 100);
              const isOverLimit = capRatio >= 90;
              const isApproaching = capRatio >= 70 && capRatio < 90;

              return (
                <div key={dest.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">{dest.siteName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          dest.status.includes('Normal')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {dest.status}
                      </span>
                      {isOverLimit && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Near Limit</span>
                        </span>
                      )}
                    </div>

                    <div className="text-slate-500 text-xs mt-1 flex flex-wrap items-center gap-2">
                      <span>Brgy. {dest.barangay}</span>
                      <span>•</span>
                      <span>Elevation: {dest.elevation}</span>
                      <span>•</span>
                      <span>Entrance: ₱{dest.entranceFee}</span>
                      <span>•</span>
                      <span>Ranger: {dest.contactPerson}</span>
                    </div>
                  </div>

                  {/* Meter and Telemetry Controls */}
                  <div className="w-full sm:w-56 shrink-0 flex flex-col justify-end">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">Visitor Load:</span>
                      <span className={`font-bold ${isOverLimit ? 'text-rose-600' : isApproaching ? 'text-amber-600' : 'text-slate-800'}`}>
                        {dest.currentVisitorsToday} / {dest.carryingCapacityDaily} ({capRatio}%)
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOverLimit ? 'bg-rose-500' : isApproaching ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, capRatio)}%` }}
                      ></div>
                    </div>

                    {/* Quick Ranger Count Adjustment Buttons */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Ranger Quick Log:</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleAdjustVisitors(dest, -5)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Subtract 5 visitors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAdjustVisitors(dest, 5)}
                          className="p-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                          title="Add 5 visitors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integrated Weather & Disaster Risk Hazard Card */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CloudSun className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">PAGASA & MDRRMO Weather</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                weatherAlertMode === 'Normal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {weatherAlertMode === 'Normal' ? 'Condition Normal' : 'Active Advisory'}
              </span>
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-extrabold text-white">27°C</span>
              <div>
                <div className="text-slate-200 text-sm font-bold">Highland Mountain Cool</div>
                <div className="text-slate-400 text-xs">Kalon Barak & Malungon Watershed</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Partly cloudy skies with moderate northeast mountain breeze. Upper eco-trails dry and stable for hiking and adventure activities.
            </p>

            {/* Weather Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">Relative Humidity</div>
                <div className="font-bold text-white text-sm">74%</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">Wind Velocity</div>
                <div className="font-bold text-white text-sm">12 km/h NE</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">PAGASA Advisory</div>
                <div className="font-bold text-emerald-400 text-sm">Signal #0 (Fair)</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-mono">Eco-Trail Rating</div>
                <div className="font-bold text-emerald-400 text-sm">Safe & Open</div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Emergency Response Network</span>
              <span className="text-emerald-400 font-semibold text-[11px]">Online (MDRRMO 911)</span>
            </div>

            <button
              onClick={() => {
                if (onOpenNotify) onOpenNotify();
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Broadcast Safety / Weather Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Events Calendar & Statutory Compliance Submittals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Events Management Preview */}
        <div className="md:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Calendar of Events & Major Tourism Activities</span>
                </h3>
                <p className="text-xs text-slate-500">Upcoming festivals, sports tourism, and cultural programs</p>
              </div>

              <button
                onClick={() => setActiveModule('events')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All ({events.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-indigo-500">
                        {ev.date.substring(5, 7) === '11' ? 'NOV' : 'SEP'}
                      </span>
                      <span className="text-base font-extrabold leading-none">{ev.date.substring(8, 10)}</span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{ev.eventName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{ev.venue}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">Budget: ₱{ev.budget.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        ev.status === 'Upcoming'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : ev.status === 'Ongoing'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ev.status}
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {ev.participantsExpected.toLocaleString()} attendees
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Next major celebration: <strong>Malungon Slang Festival</strong></span>
            <span className="text-indigo-600 font-bold cursor-pointer hover:underline" onClick={() => setActiveModule('events')}>
              Manage Calendars →
            </span>
          </div>
        </div>

        {/* Statutory Compliance Submittals Tracker */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">Statutory Reports Due & Compliance</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Mandatory DOT Region XII & DILG Submittals</p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-900">Monthly Tourist Arrival Report (DOT Form 1)</div>
                  <div className="text-amber-700 text-[11px] mt-0.5">Due: Sep 10, 2026 • 6 Days Remaining</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-indigo-900">Quarterly Tourism Accomplishment</div>
                  <div className="text-indigo-700 text-[11px] mt-0.5">Due: Sep 30, 2026 • LGU Planning Office</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900">Enterprise Accreditation Audit</div>
                  <div className="text-emerald-700 text-[11px] mt-0.5">Status: {accreditationRate}% Compliant • Ready</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveModule('reports')}
              className="w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Open Report Generation Center (RGM)</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Official Executive Briefing Digest Modal (Printable / Exportable for Mayor & Council) */}
      {briefingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Actions Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Executive Briefing & Tourism Digest</h3>
                  <p className="text-slate-400 text-xs">Official Report for the Municipal Mayor & Sangguniang Bayan</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
                <button
                  onClick={() => setBriefingModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Briefing Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
              {/* LGU Letterhead */}
              <div className="pb-6 border-b-2 border-slate-800 flex items-center justify-between gap-4">
                <img
                  src="/logo/LGU_LOGO1.png"
                  alt="LGU Malungon Seal"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow shrink-0"
                />
                <div className="text-center flex-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Republic of the Philippines</div>
                  <div className="text-xs font-bold text-slate-700 uppercase">{municipalityInfo.province}</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">{municipalityInfo.name}</div>
                  <div className="text-xs font-bold text-indigo-900 uppercase mt-0.5">{municipalityInfo.officeName}</div>
                  <div className="text-[10px] text-slate-500 mt-1 italic">{municipalityInfo.officeLocation}</div>
                </div>
                <img
                  src="/logo/TourismLogo.png"
                  alt="Tourism Office Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow shrink-0"
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-base">EXECUTIVE SUMMARY REPORT ON MUNICIPAL TOURISM</div>
                  <div className="text-xs text-slate-600 mt-0.5">Focus Period: Fiscal Year 2026 (Active Telemetry)</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-500">Date Generated:</div>
                  <div className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</div>
                </div>
              </div>

              {/* Executive Summary Paragraph */}
              <div className="space-y-2 leading-relaxed text-slate-700">
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">1. Executive Overview</h4>
                <p>
                  During the monitored operational cycle, the Municipality of Malungon recorded a cumulative total of{' '}
                  <strong className="text-slate-900">{totalTourists.toLocaleString()} tourist arrivals</strong>, comprising{' '}
                  <strong>{domesticPercentage}% domestic travelers</strong> and <strong>{foreignPercentage}% foreign visitors</strong>. Total registered direct visitor expenditures yielded approximately{' '}
                  <strong className="text-slate-900">₱{totalTouristSpending.toLocaleString()}</strong>, generating an estimated indirect economic multiplier effect of{' '}
                  <strong className="text-emerald-700">₱{indirectEconomicImpact.toLocaleString()}</strong> into the local micro-economy, community homestays, and MSMEs.
                </p>
              </div>

              {/* Key Indicators Table */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-2">2. Key Performance Indicators</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Indicator</th>
                        <th className="p-2.5">Recorded Metric</th>
                        <th className="p-2.5">Benchmark / Target</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="p-2.5 font-medium">Total Visitor Arrivals</td>
                        <td className="p-2.5 font-bold text-slate-900">{totalTourists.toLocaleString()} pax</td>
                        <td className="p-2.5">Target: 30,000 / annum</td>
                        <td className="p-2.5 text-emerald-700 font-bold">On Track</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Overnight Tourist Ratio</td>
                        <td className="p-2.5 font-bold text-slate-900">{overnightPercentage}% ({overnightTourists} pax)</td>
                        <td className="p-2.5">DOT Standard: &gt; 40%</td>
                        <td className="p-2.5 text-emerald-700 font-bold">Optimal</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">DOT Accreditation Rate</td>
                        <td className="p-2.5 font-bold text-slate-900">{accreditationRate}% ({accreditedEnterprises}/{totalEnterprises})</td>
                        <td className="p-2.5">Provincial Target: 80%</td>
                        <td className="p-2.5 text-indigo-700 font-bold">Compliant</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Average Tourist Spend</td>
                        <td className="p-2.5 font-bold text-slate-900">₱{averageSpending.toLocaleString()} / pax</td>
                        <td className="p-2.5">₱1,800 baseline</td>
                        <td className="p-2.5 text-emerald-700 font-bold">+18% Above Avg</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Active Code Enforcement</td>
                        <td className="p-2.5 font-bold text-slate-900">{pendingNotices} NOV pending</td>
                        <td className="p-2.5">Zero tolerance</td>
                        <td className="p-2.5 text-amber-700 font-bold">In Remediation</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Destination Capacity Telemetry Table */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-2">3. Destination Carrying Capacity Audit</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Destination Site</th>
                        <th className="p-2.5">Barangay</th>
                        <th className="p-2.5">Current Visitors</th>
                        <th className="p-2.5">Daily Threshold</th>
                        <th className="p-2.5">Load Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {destinations.map((d) => (
                        <tr key={d.id}>
                          <td className="p-2.5 font-semibold text-slate-900">{d.siteName}</td>
                          <td className="p-2.5">Brgy. {d.barangay}</td>
                          <td className="p-2.5">{d.currentVisitorsToday} pax</td>
                          <td className="p-2.5">{d.carryingCapacityDaily} pax</td>
                          <td className="p-2.5">
                            <span className={`font-bold ${
                              d.currentVisitorsToday / d.carryingCapacityDaily > 0.85 ? 'text-rose-600' : 'text-emerald-700'
                            }`}>
                              {Math.round((d.currentVisitorsToday / d.carryingCapacityDaily) * 100)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Signature Lines */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="text-slate-500 mb-8">Prepared by:</div>
                  <div className="font-bold text-slate-900 border-b border-slate-400 pb-1 max-w-xs mx-auto">
                    {municipalityInfo.officerInCharge}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">{municipalityInfo.officerPosition}</div>
                </div>

                <div>
                  <div className="text-slate-500 mb-8">Noted by:</div>
                  <div className="font-bold text-slate-900 border-b border-slate-400 pb-1 max-w-xs mx-auto">
                    {municipalityInfo.mayorName}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">{municipalityInfo.mayorTitle}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Tourist Arrivals Quick Drilldown Modal */}
      {drilldownModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Users className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Tourist Arrival Demographic Drilldown</h3>
                  <p className="text-slate-400 text-xs">Recent visitor arrival logs & nationality demographics</p>
                </div>
              </div>
              <button
                onClick={() => setDrilldownModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="text-xs text-indigo-700 font-semibold">Total Logged</div>
                  <div className="text-xl font-extrabold text-indigo-950">{totalTourists}</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-xs text-emerald-700 font-semibold">Domestic</div>
                  <div className="text-xl font-extrabold text-emerald-950">{domesticTourists}</div>
                </div>
                <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                  <div className="text-xs text-cyan-700 font-semibold">Foreign</div>
                  <div className="text-xl font-extrabold text-cyan-950">{foreignTourists}</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2.5">Visitor Name</th>
                      <th className="p-2.5">Origin / Nationality</th>
                      <th className="p-2.5">Destination Visited</th>
                      <th className="p-2.5">Purpose</th>
                      <th className="p-2.5">Spending</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredTourists.slice(0, 8).map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-semibold text-slate-900">{t.name}</td>
                        <td className="p-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            t.isForeign ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {t.nationality}
                          </span>
                        </td>
                        <td className="p-2.5">{t.destinationVisited}</td>
                        <td className="p-2.5">{t.purposeOfVisit}</td>
                        <td className="p-2.5 font-bold text-slate-900">₱{t.touristSpending?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setDrilldownModalOpen(false);
                    setActiveModule('tourists');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Open Full Tourist Arrival Management (TAMS) →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal for Digital Tourism Verification Pass */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={qrModalData.title}
        subtitle={qrModalData.subtitle}
        codeData={qrModalData.codeData}
        entityType="tourist"
        extraDetails={qrModalData.extraDetails}
      />
    </div>
  );
};
