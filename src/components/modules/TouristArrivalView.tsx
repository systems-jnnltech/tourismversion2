import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  QrCode,
  Star,
  DollarSign,
  Calendar,
  Globe2,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowUpDown,
  Car,
  Hotel,
  Compass,
  Clock,
  BedDouble,
  FileSpreadsheet,
  Eye,
  ChevronLeft,
  ChevronRight,
  Upload,
  Sparkles,
  MapPin,
  X,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  ShieldCheck,
  FileText
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
import { TouristArrival } from '../../types';
import { QRCodeModal } from '../common/QRCodeModal';

type SubTabKey = 'all' | 'daily' | 'monthly' | 'local_foreign' | 'peak_season';
type SortField = 'dateOfVisit' | 'name' | 'touristSpending' | 'numberOfDaysStayed' | 'feedbackRating';
type SortOrder = 'asc' | 'desc';

export const TouristArrivalView: React.FC = () => {
  const {
    tourists,
    addTourist,
    updateTourist,
    deleteTourist,
    destinations,
    isReadOnly,
    currentUser,
    municipalityInfo,
    updateDestination,
  } = useTourism();

  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<SubTabKey>('all');

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNationality, setFilterNationality] = useState('ALL');
  const [filterPurpose, setFilterPurpose] = useState('ALL');
  const [filterDestination, setFilterDestination] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Sorting and Pagination State
  const [sortField, setSortField] = useState<SortField>('dateOfVisit');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedTourist, setSelectedTourist] = useState<TouristArrival | null>(null);
  const [passBadgeOpen, setPassBadgeOpen] = useState(false);
  const [dotFormModalOpen, setDotFormModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Form State
  const initialForm: Omit<TouristArrival, 'id'> = {
    touristId: `MLG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    dateOfVisit: new Date().toISOString().substring(0, 10),
    name: '',
    age: 30,
    sex: 'Male',
    address: '',
    nationality: 'Filipino',
    isForeign: false,
    contactNumber: '',
    emailAddress: '',
    occupation: '',
    purposeOfVisit: 'Eco-Adventure',
    destinationVisited: destinations[0]?.siteName || 'Kalon Barak Skyline Ridge',
    accommodationUsed: 'Ridge View Highland Glamping Resort',
    numberOfDaysStayed: 2,
    transportationUsed: 'Private Vehicle',
    touristSpending: 4500,
    travelCompanion: 'Family',
    companionsCount: 2,
    feedbackRating: 5,
    feedbackComments: '',
    recordedBy: currentUser.name,
  };
  const [formData, setFormData] = useState(initialForm);
  const [autoIncrementCapacity, setAutoIncrementCapacity] = useState(true);

  // Dynamic Filtering Logic
  const filteredTourists = useMemo(() => {
    return tourists.filter((t) => {
      // Text Search
      const matchesSearch =
        !searchTerm.trim() ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.touristId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.destinationVisited.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.address.toLowerCase().includes(searchTerm.toLowerCase());

      // Nationality Filter
      const matchesNat =
        filterNationality === 'ALL'
          ? true
          : filterNationality === 'Foreign'
          ? t.isForeign
          : !t.isForeign;

      // Purpose Filter
      const matchesPurpose = filterPurpose === 'ALL' || t.purposeOfVisit === filterPurpose;

      // Destination Filter
      const matchesDest = filterDestination === 'ALL' || t.destinationVisited === filterDestination;

      // Date Range Filter
      const matchesDateFrom = !dateFrom || t.dateOfVisit >= dateFrom;
      const matchesDateTo = !dateTo || t.dateOfVisit <= dateTo;

      return matchesSearch && matchesNat && matchesPurpose && matchesDest && matchesDateFrom && matchesDateTo;
    });
  }, [tourists, searchTerm, filterNationality, filterPurpose, filterDestination, dateFrom, dateTo]);

  // Sorted Tourists for Tab 1
  const sortedTourists = useMemo(() => {
    return [...filteredTourists].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filteredTourists, sortField, sortOrder]);

  // Paginated Tourists
  const totalPages = Math.ceil(sortedTourists.length / itemsPerPage) || 1;
  const paginatedTourists = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTourists.slice(start, start + itemsPerPage);
  }, [sortedTourists, currentPage]);

  // Handle Sort Change
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // High-Level Statistical Aggregates
  const totalTourists = tourists.length;
  const domesticCount = tourists.filter((t) => !t.isForeign).length;
  const foreignCount = tourists.filter((t) => t.isForeign).length;
  const totalSpending = tourists.reduce((sum, t) => sum + (t.touristSpending || 0), 0);
  const avgSpending = totalTourists > 0 ? Math.round(totalSpending / totalTourists) : 0;
  const totalDays = tourists.reduce((sum, t) => sum + (t.numberOfDaysStayed || 1), 0);
  const alos = totalTourists > 0 ? (totalDays / totalTourists).toFixed(1) : '1.0';
  const overnightCount = tourists.filter(
    (t) => (t.numberOfDaysStayed && t.numberOfDaysStayed > 0) || (t.accommodationUsed && t.accommodationUsed !== 'None / Day Trip' && t.accommodationUsed !== 'N/A')
  ).length;
  const overnightRatio = totalTourists > 0 ? Math.round((overnightCount / totalTourists) * 100) : 0;
  const avgRating =
    totalTourists > 0
      ? (tourists.reduce((sum, t) => sum + t.feedbackRating, 0) / totalTourists).toFixed(1)
      : '5.0';

  // Group by Date for Tab 2 (Daily Arrival Ledger)
  const dailyLedger = useMemo(() => {
    const map: Record<string, {
      date: string;
      total: number;
      domestic: number;
      foreign: number;
      spending: number;
      destinationsMap: Record<string, number>;
      records: TouristArrival[];
    }> = {};

    tourists.forEach((t) => {
      const d = t.dateOfVisit;
      if (!map[d]) {
        map[d] = {
          date: d,
          total: 0,
          domestic: 0,
          foreign: 0,
          spending: 0,
          destinationsMap: {},
          records: [],
        };
      }
      map[d].total += 1;
      if (t.isForeign) map[d].foreign += 1;
      else map[d].domestic += 1;
      map[d].spending += t.touristSpending || 0;
      map[d].destinationsMap[t.destinationVisited] = (map[d].destinationsMap[t.destinationVisited] || 0) + 1;
      map[d].records.push(t);
    });

    return Object.values(map).sort((a, b) => b.date.localeCompare(a.date));
  }, [tourists]);

  // Monthly Aggregate Data for Tab 3 (DOT Form 1 Monthly Return)
  const monthlySummary = useMemo(() => {
    const months = [
      { key: '2026-01', name: 'January 2026', baseDom: 1240, baseFor: 85, spend: 2980000, alos: 2.1 },
      { key: '2026-02', name: 'February 2026', baseDom: 1480, baseFor: 110, spend: 3450000, alos: 2.2 },
      { key: '2026-03', name: 'March 2026', baseDom: 2100, baseFor: 195, spend: 5120000, alos: 2.4 },
      { key: '2026-04', name: 'April 2026 (Semana Santa)', baseDom: 4850, baseFor: 340, spend: 11840000, alos: 3.1 },
      { key: '2026-05', name: 'May 2026 (Summer Peak)', baseDom: 5200, baseFor: 410, spend: 13150000, alos: 2.8 },
      { key: '2026-06', name: 'June 2026 (Slang Festival)', baseDom: 3950, baseFor: 280, spend: 9800000, alos: 2.5 },
      { key: '2026-07', name: 'July 2026', baseDom: 1950, baseFor: 140, spend: 4620000, alos: 2.0 },
      { key: '2026-08', name: 'August 2026', baseDom: 2300, baseFor: 175, spend: 5540000, alos: 2.3 },
      { key: '2026-09', name: 'September 2026 (Current)', baseDom: 2750 + domesticCount * 8, baseFor: 230 + foreignCount * 4, spend: 6720000 + totalSpending * 3, alos: 2.4 },
    ];

    return months.map((m) => {
      const total = m.baseDom + m.baseFor;
      const overnight = Math.round(total * 0.44);
      const excursionist = total - overnight;
      const guestNights = Math.round(overnight * m.alos);
      return {
        ...m,
        total,
        overnight,
        excursionist,
        guestNights,
        avgDailyExpenditure: Math.round(m.spend / (total * m.alos)),
      };
    });
  }, [domesticCount, foreignCount, totalSpending]);

  // Demographic Aggregates for Tab 4 (Local vs Foreign)
  const demographicData = useMemo(() => {
    // Domestic Origins
    const domesticOrigins: Record<string, number> = {};
    const foreignOrigins: Record<string, number> = {};
    const genderCounts = { Male: 0, Female: 0, Other: 0 };
    const ageBrackets = { 'Under 18': 0, '18-35 (Youth)': 0, '36-59 (Adult)': 0, '60+ (Senior)': 0 };

    tourists.forEach((t) => {
      // Gender
      if (t.sex in genderCounts) genderCounts[t.sex as keyof typeof genderCounts] += 1;
      else genderCounts.Male += 1;

      // Age
      if (t.age < 18) ageBrackets['Under 18'] += 1;
      else if (t.age <= 35) ageBrackets['18-35 (Youth)'] += 1;
      else if (t.age <= 59) ageBrackets['36-59 (Adult)'] += 1;
      else ageBrackets['60+ (Senior)'] += 1;

      // Nationality / Region
      if (t.isForeign) {
        foreignOrigins[t.nationality] = (foreignOrigins[t.nationality] || 0) + 1;
      } else {
        const addr = t.address.toLowerCase();
        let region = 'Region XII (SOCCSKSARGEN)';
        if (addr.includes('davao')) region = 'Region XI (Davao Region)';
        else if (addr.includes('gensan') || addr.includes('general santos')) region = 'General Santos City (Metro)';
        else if (addr.includes('quezon') || addr.includes('manila') || addr.includes('ncr')) region = 'NCR (Metro Manila)';
        else if (addr.includes('cebu')) region = 'Region VII (Central Visayas)';
        else if (addr.includes('koronadal') || addr.includes('south cotabato')) region = 'South Cotabato Province';
        else if (addr.includes('sarangani') || addr.includes('malungon')) region = 'Sarangani Province (Local)';
        domesticOrigins[region] = (domesticOrigins[region] || 0) + 1;
      }
    });

    return {
      domesticOrigins: Object.entries(domesticOrigins).map(([name, count]) => ({ name, count })),
      foreignOrigins: Object.entries(foreignOrigins).map(([name, count]) => ({ name, count })),
      genderData: [
        { name: 'Male', value: genderCounts.Male },
        { name: 'Female', value: genderCounts.Female },
        { name: 'Other', value: genderCounts.Other },
      ],
      ageData: Object.entries(ageBrackets).map(([name, value]) => ({ name, value })),
    };
  }, [tourists]);

  // Peak Season Analytics for Tab 5
  const peakSeasonMetrics = [
    {
      season: 'Semana Santa / Holy Week',
      period: 'April 2026',
      arrivals: 5190,
      dailyPeak: 840,
      spendingEstimate: 11840000,
      stressLevel: 'Critical / High Load',
      topAttraction: 'Kalon Barak Skyline Ridge (96% Capacity)',
    },
    {
      season: 'Summer Eco-Adventure Peak',
      period: 'May 2026',
      arrivals: 5610,
      dailyPeak: 720,
      spendingEstimate: 13150000,
      stressLevel: 'Regulated Peak',
      topAttraction: 'Matutum Foothills Eco-Trail (88% Capacity)',
    },
    {
      season: 'Malungon Slang Festival',
      period: 'June 2026',
      arrivals: 4230,
      dailyPeak: 950,
      spendingEstimate: 9800000,
      stressLevel: 'Festival Surge',
      topAttraction: 'Malungon Cultural Heritage Village (92% Capacity)',
    },
    {
      season: 'Christmas & Year-End Holidays',
      period: 'December 2025 (Ref)',
      arrivals: 3820,
      dailyPeak: 610,
      spendingEstimate: 8740000,
      stressLevel: 'Moderate Surge',
      topAttraction: 'Upper Mainit Hot Springs (82% Capacity)',
    },
  ];

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  // Form Handlers
  const handleOpenForm = (tourist?: TouristArrival) => {
    if (tourist) {
      setEditingId(tourist.id);
      setFormData({
        touristId: tourist.touristId,
        dateOfVisit: tourist.dateOfVisit,
        name: tourist.name,
        age: tourist.age,
        sex: tourist.sex,
        address: tourist.address,
        nationality: tourist.nationality,
        isForeign: tourist.isForeign,
        contactNumber: tourist.contactNumber,
        emailAddress: tourist.emailAddress,
        occupation: tourist.occupation,
        purposeOfVisit: tourist.purposeOfVisit,
        destinationVisited: tourist.destinationVisited,
        accommodationUsed: tourist.accommodationUsed,
        numberOfDaysStayed: tourist.numberOfDaysStayed,
        transportationUsed: tourist.transportationUsed,
        touristSpending: tourist.touristSpending,
        travelCompanion: tourist.travelCompanion,
        companionsCount: tourist.companionsCount,
        feedbackRating: tourist.feedbackRating,
        feedbackComments: tourist.feedbackComments,
        recordedBy: tourist.recordedBy,
      });
    } else {
      setEditingId(null);
      setFormData({
        ...initialForm,
        touristId: `MLG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        recordedBy: currentUser.name,
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateTourist(editingId, formData);
    } else {
      addTourist(formData);

      // Auto-increment Destination carrying capacity if visit is today
      if (autoIncrementCapacity) {
        const dest = destinations.find((d) => d.siteName === formData.destinationVisited);
        if (dest) {
          updateDestination(dest.id, {
            currentVisitorsToday: dest.currentVisitorsToday + 1 + (formData.companionsCount || 0),
          });
        }
      }
    }
    setIsFormOpen(false);
  };

  // Open QR Lanyard Badge Modal
  const handleOpenBadge = (t: TouristArrival) => {
    setSelectedTourist(t);
    setPassBadgeOpen(true);
  };

  // Export DOT CSV
  const handleExportCSV = () => {
    const headers = [
      'Tourist ID',
      'Date of Visit',
      'Name',
      'Age',
      'Sex',
      'Address',
      'Nationality',
      'Classification',
      'Contact',
      'Email',
      'Occupation',
      'Purpose',
      'Destination Visited',
      'Accommodation',
      'Days Stayed',
      'Transportation',
      'Spending (PHP)',
      'Travel Companion',
      'Rating',
      'Feedback',
      'Recorded By',
    ];

    const rows = filteredTourists.map((t) => [
      `"${t.touristId}"`,
      `"${t.dateOfVisit}"`,
      `"${t.name}"`,
      t.age,
      `"${t.sex}"`,
      `"${t.address.replace(/"/g, '""')}"`,
      `"${t.nationality}"`,
      t.isForeign ? '"Foreign"' : '"Domestic"',
      `"${t.contactNumber}"`,
      `"${t.emailAddress}"`,
      `"${t.occupation}"`,
      `"${t.purposeOfVisit}"`,
      `"${t.destinationVisited}"`,
      `"${t.accommodationUsed}"`,
      t.numberOfDaysStayed,
      `"${t.transportationUsed}"`,
      t.touristSpending,
      `"${t.travelCompanion}"`,
      t.feedbackRating,
      `"${(t.feedbackComments || '').replace(/"/g, '""')}"`,
      `"${t.recordedBy}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `DOT_Form1_Tourist_Arrivals_Malungon_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sample Batch Import Generator (Demonstrating CSV ingestion)
  const handleSimulateBatchImport = () => {
    const sampleBatch: Omit<TouristArrival, 'id'>[] = [
      {
        touristId: `MLG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        dateOfVisit: new Date().toISOString().substring(0, 10),
        name: 'Andrea S. Villanueva',
        age: 27,
        sex: 'Female',
        address: 'Tagum City, Davao del Norte',
        nationality: 'Filipino',
        isForeign: false,
        contactNumber: '+63 917 444 8899',
        emailAddress: 'andrea.v@tagumtravel.ph',
        occupation: 'Graphic Designer',
        purposeOfVisit: 'Eco-Adventure',
        destinationVisited: 'Kalon Barak Skyline Ridge',
        accommodationUsed: 'Ridge View Highland Glamping Resort',
        numberOfDaysStayed: 2,
        transportationUsed: 'Tourist Van',
        touristSpending: 6200,
        travelCompanion: 'Friends / Group',
        companionsCount: 3,
        feedbackRating: 5,
        feedbackComments: 'Spectacular sea of clouds at sunrise. Accommodations are well maintained.',
        recordedBy: currentUser.name,
      },
      {
        touristId: `MLG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        dateOfVisit: new Date().toISOString().substring(0, 10),
        name: 'Henrik Larsson',
        age: 44,
        sex: 'Male',
        address: 'Stockholm, Sweden',
        nationality: 'Swedish',
        isForeign: true,
        contactNumber: '+46 8 123 4567',
        emailAddress: 'h.larsson@nordictrail.se',
        occupation: 'Botanist',
        purposeOfVisit: 'Education / Research',
        destinationVisited: 'Matutum Foothills Eco-Trail',
        accommodationUsed: 'Community Homestay Association',
        numberOfDaysStayed: 4,
        transportationUsed: 'Private Vehicle',
        touristSpending: 14500,
        travelCompanion: 'Solo',
        companionsCount: 0,
        feedbackRating: 5,
        feedbackComments: 'Rich endemic flora and exceptional indigenous community hospitality.',
        recordedBy: currentUser.name,
      },
    ];

    sampleBatch.forEach((item) => addTourist(item));
    setImportStatus(`Successfully ingested 2 verified traveler records from batch stream.`);
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome & Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Module B • Frontline Tourism Information Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tourist Arrival Management System (TAMS)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Statutory visitor manifest and profiling database compliant with the Department of Tourism (DOT Form 1 Monthly Return) under RA 9593.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setDotFormModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            title="Generate DOT Form 1 Return"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            <span>DOT Form 1 Summary</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {!isReadOnly && (
            <>
              <button
                onClick={handleSimulateBatchImport}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                title="Simulate importing batch arrival records"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Batch Ingest</span>
              </button>

              <button
                onClick={() => handleOpenForm()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Register Visitor</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Batch Ingest Notification Alert */}
      {importStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{importStatus}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-mono uppercase">Synced</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Arrivals */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Arrivals (Manifest)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalTourists.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span className="text-emerald-700 font-bold">{domesticCount} Domestic</span>
            <span className="text-cyan-700 font-bold">{foreignCount} Foreign</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden flex">
            <div className="bg-emerald-600 h-full" style={{ width: `${Math.round((domesticCount / totalTourists) * 100)}%` }}></div>
            <div className="bg-cyan-500 h-full" style={{ width: `${Math.round((foreignCount / totalTourists) * 100)}%` }}></div>
          </div>
        </div>

        {/* Overnight & Stay Length */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overnight Ratio & ALOS</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1.5">
            <span>{overnightRatio}%</span>
            <span className="text-xs font-semibold text-slate-500">({alos} days ALOS)</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>{overnightCount} Lodgers</span>
            <span className="font-semibold text-slate-700">{totalTourists - overnightCount} Excursionists</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${overnightRatio}%` }}></div>
          </div>
        </div>

        {/* Visitor Direct Receipts */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visitor Spending Receipts</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1 truncate">
            ₱{totalSpending.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Average:</span>
            <span className="font-bold text-slate-800">₱{avgSpending.toLocaleString()} / pax</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        {/* Feedback Rating */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Satisfaction Score</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1 flex items-center gap-1.5">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            <span>{avgRating} / 5.0</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Evaluated from {totalTourists} verified feedback submissions
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(parseFloat(avgRating) / 5) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* 5 Functional Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-1.5 text-xs font-bold">
        {[
          { key: 'all', label: `All Visitor Records (${filteredTourists.length})`, icon: Users },
          { key: 'daily', label: 'Daily Arrival Ledger', icon: Calendar },
          { key: 'monthly', label: 'Monthly DOT Form 1 Return', icon: FileSpreadsheet },
          { key: 'local_foreign', label: 'Demographic Origin Analysis', icon: Globe2 },
          { key: 'peak_season', label: 'Peak Season Analytics', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as SubTabKey)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: ALL VISITOR RECORDS TABLE */}
      {activeTab === 'all' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Multi-Criteria Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by tourist name, ID, destination, nationality, origin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterNationality}
                onChange={(e) => setFilterNationality(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Nationalities</option>
                <option value="Domestic">Domestic (Filipino)</option>
                <option value="Foreign">Foreign Travelers</option>
              </select>

              <select
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Purposes</option>
                <option value="Eco-Adventure">Eco-Adventure</option>
                <option value="Cultural / Heritage">Cultural / Heritage</option>
                <option value="Leisure / Vacation">Leisure / Vacation</option>
                <option value="Business / MICE">Business / MICE</option>
                <option value="Visiting Friends & Relatives">Visiting Friends & Relatives</option>
                <option value="Education / Research">Education / Research</option>
              </select>

              <select
                value={filterDestination}
                onChange={(e) => setFilterDestination(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Destinations</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.siteName}>
                    {d.siteName}
                  </option>
                ))}
              </select>

              {/* Date Filters */}
              <div className="flex items-center space-x-1 text-slate-500 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 focus:outline-none"
                  title="Filter From Date"
                />
                <span>-</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 focus:outline-none"
                  title="Filter To Date"
                />
              </div>

              {(searchTerm || filterNationality !== 'ALL' || filterPurpose !== 'ALL' || filterDestination !== 'ALL' || dateFrom || dateTo) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterNationality('ALL');
                    setFilterPurpose('ALL');
                    setFilterDestination('ALL');
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th
                      onClick={() => handleSort('dateOfVisit')}
                      className="px-4 py-3.5 cursor-pointer hover:text-emerald-800 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Tourist ID & Date</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('name')}
                      className="px-4 py-3.5 cursor-pointer hover:text-emerald-800 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Visitor Details</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-4 py-3.5">Origin / Nationality</th>
                    <th className="px-4 py-3.5">Destination & Stay</th>
                    <th
                      onClick={() => handleSort('touristSpending')}
                      className="px-4 py-3.5 cursor-pointer hover:text-emerald-800 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Spending & Transport</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('feedbackRating')}
                      className="px-4 py-3.5 cursor-pointer hover:text-emerald-800 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Rating & Feedback</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedTourists.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        No tourist arrival records match the search criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedTourists.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-mono font-bold text-emerald-800 text-xs">{t.touristId}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{t.dateOfVisit}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {t.age} yrs • {t.sex} • {t.occupation || 'Private Traveler'}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{t.contactNumber}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                t.isForeign ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {t.nationality}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-1 max-w-[200px] truncate" title={t.address}>
                            {t.address}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{t.destinationVisited}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Hotel className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {t.accommodationUsed} ({t.numberOfDaysStayed} {t.numberOfDaysStayed === 1 ? 'day' : 'days'})
                            </span>
                          </div>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                            {t.purposeOfVisit}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-extrabold text-emerald-800 text-sm">
                            ₱{t.touristSpending?.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Car className="w-3.5 h-3.5 text-slate-400" />
                            <span>{t.transportationUsed}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {t.travelCompanion} ({t.companionsCount + 1} pax)
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center text-amber-500 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="ml-1">{t.feedbackRating}/5</span>
                          </div>
                          <div className="text-[11px] text-slate-500 italic max-w-[160px] truncate mt-0.5" title={t.feedbackComments}>
                            "{t.feedbackComments || 'No comment recorded'}"
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleOpenBadge(t)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Print / View Tourist ID Badge"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleOpenForm(t)}
                                  className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit Record"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete record for visitor ${t.name}?`)) {
                                      deleteTourist(t.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                Showing <strong className="text-slate-800">{paginatedTourists.length}</strong> of{' '}
                <strong className="text-slate-800">{sortedTourists.length}</strong> matched visitor records
              </div>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="font-semibold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DAILY TOURIST ARRIVAL LEDGER */}
      {activeTab === 'daily' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Daily Tourist Inflow Ledger</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Daily headcounts, domestic/foreign ratio, receipts, and destinations visited
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ledger</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {dailyLedger.map((d) => {
                const topDests = Object.entries(d.destinationsMap)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .map(([name, count]) => `${name} (${count})`)
                  .join(', ');

                return (
                  <div key={d.date} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] uppercase font-bold text-emerald-600">
                          {new Date(d.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-black leading-none">{d.date.substring(8, 10)}</span>
                      </div>

                      <div>
                        <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {new Date(d.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Top Sites: <span className="text-slate-700 font-medium">{topDests}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {d.records.length} registered entries on this day
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="text-right">
                        <div className="text-slate-400 text-[10px] uppercase font-mono">Total Volume</div>
                        <div className="font-extrabold text-slate-900 text-base">{d.total} Visitors</div>
                        <div className="text-[11px] text-emerald-700">{d.domestic} Dom • {d.foreign} For</div>
                      </div>

                      <div className="text-right pl-4 border-l border-slate-200">
                        <div className="text-slate-400 text-[10px] uppercase font-mono">Gross Receipts</div>
                        <div className="font-extrabold text-emerald-800 text-base">₱{d.spending.toLocaleString()}</div>
                        <div className="text-[11px] text-slate-500">₱{Math.round(d.spending / d.total).toLocaleString()} / pax</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MONTHLY SUMMARY & DOT FORM 1 RETURN */}
      {activeTab === 'monthly' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>DOT Form 1: Monthly Tourist Arrival Report (Standard Return)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Mandatory submission to DOT Region XII • Fiscal Year 2026 Monthly Statistics
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDotFormModalOpen(true)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Certified View</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Table</span>
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3">Month</th>
                      <th className="p-3 text-right">Domestic</th>
                      <th className="p-3 text-right">Foreign</th>
                      <th className="p-3 text-right">Total Arrivals</th>
                      <th className="p-3 text-right">Overnight</th>
                      <th className="p-3 text-right">Same-Day</th>
                      <th className="p-3 text-right">ALOS</th>
                      <th className="p-3 text-right">Guest Nights</th>
                      <th className="p-3 text-right">Total Receipts (₱)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {monthlySummary.map((m) => (
                      <tr key={m.key} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{m.name}</td>
                        <td className="p-3 text-right font-medium text-slate-700">{m.baseDom.toLocaleString()}</td>
                        <td className="p-3 text-right font-medium text-cyan-700">{m.baseFor.toLocaleString()}</td>
                        <td className="p-3 text-right font-extrabold text-slate-900">{m.total.toLocaleString()}</td>
                        <td className="p-3 text-right font-semibold text-indigo-700">{m.overnight.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-500">{m.excursionist.toLocaleString()}</td>
                        <td className="p-3 text-right font-semibold text-slate-800">{m.alos}</td>
                        <td className="p-3 text-right text-slate-700">{m.guestNights.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold text-emerald-800">₱{m.spend.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100/80 font-extrabold text-slate-900 border-t-2 border-slate-300">
                    <tr>
                      <td className="p-3 uppercase">Year-to-Date Total</td>
                      <td className="p-3 text-right">
                        {monthlySummary.reduce((s, m) => s + m.baseDom, 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-cyan-700">
                        {monthlySummary.reduce((s, m) => s + m.baseFor, 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-indigo-900">
                        {monthlySummary.reduce((s, m) => s + m.total, 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        {monthlySummary.reduce((s, m) => s + m.overnight, 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        {monthlySummary.reduce((s, m) => s + m.excursionist, 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right">2.4 avg</td>
                      <td className="p-3 text-right">
                        {monthlySummary.reduce((s, m) => s + m.guestNights, 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-emerald-900">
                        ₱{monthlySummary.reduce((s, m) => s + m.spend, 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LOCAL VS FOREIGN DEMOGRAPHIC ORIGINS */}
      {activeTab === 'local_foreign' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Domestic Regional Origins */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Domestic Travelers by Origin Region</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">Leading regional visitor feeders into Malungon</p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographicData.domesticOrigins} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={120} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="count" name="Visitors" fill="#059669" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Foreign Inbound Nationalities */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-600" />
                <span>International Inbound Nationalities</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">Foreign eco-tourists and researchers</p>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographicData.foreignOrigins} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={90} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="count" name="Visitors" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Gender and Age Brackets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-sm mb-1">Gender Profile Distribution</h3>
              <p className="text-xs text-slate-500 mb-3">Recorded traveler demographic sex</p>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={demographicData.genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={40}>
                      <Cell fill="#4f46e5" />
                      <Cell fill="#ec4899" />
                      <Cell fill="#94a3b8" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-sm mb-1">Age Bracket Breakdown</h3>
              <p className="text-xs text-slate-500 mb-3">Youth, working professionals, and seniors</p>

              <div className="space-y-3 mt-4 text-xs">
                {demographicData.ageData.map((a, idx) => (
                  <div key={a.name}>
                    <div className="flex justify-between text-xs mb-1 font-semibold text-slate-700">
                      <span>{a.name}</span>
                      <span>{a.value} visitors ({Math.round((a.value / totalTourists) * 100 || 0)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          backgroundColor: COLORS[idx % COLORS.length],
                          width: `${Math.round((a.value / totalTourists) * 100 || 0)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PEAK SEASON ANALYTICS */}
      {activeTab === 'peak_season' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Peak Season Surge & Capacity Stress Analytics</span>
              </h3>
              <p className="text-xs text-slate-500">
                Analysis of major tourist arrival influxes, holiday surges, and site capacity management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {peakSeasonMetrics.map((p) => (
                <div key={p.season} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{p.period}</span>
                      <h4 className="text-sm sm:text-base font-black text-slate-900">{p.season}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {p.stressLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-mono">Period Volume</div>
                      <div className="font-extrabold text-slate-900 text-sm mt-0.5">{p.arrivals.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-mono">Daily Peak</div>
                      <div className="font-extrabold text-indigo-700 text-sm mt-0.5">{p.dailyPeak} pax</div>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-mono">Est. Receipts</div>
                      <div className="font-extrabold text-emerald-800 text-sm mt-0.5">₱{(p.spendingEstimate / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1 border-t border-slate-200/80">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Key Concentration: <strong>{p.topAttraction}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Registration & Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingId ? 'Edit Tourist Arrival Record' : 'Register New Tourist Arrival'}
                </h3>
                <p className="text-xs text-emerald-200">Official Municipal Tourism Office Log • DOT RA 9593</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-emerald-200 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tourist ID</label>
                  <input
                    type="text"
                    required
                    value={formData.touristId}
                    onChange={(e) => setFormData({ ...formData, touristId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Visit</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfVisit}
                    onChange={(e) => setFormData({ ...formData, dateOfVisit: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria C. Santos"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sex</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    required
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nationality: e.target.value,
                        isForeign: e.target.value.toLowerCase() !== 'filipino',
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Environmental Planner"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Complete Address / Province / Country</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. General Santos City / Copenhagen, Denmark"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Details (Phone & Email)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="+63 9XX XXX XXXX"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                    />
                    <input
                      type="email"
                      placeholder="visitor@example.com"
                      value={formData.emailAddress}
                      onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Visited</label>
                  <select
                    value={formData.destinationVisited}
                    onChange={(e) => setFormData({ ...formData, destinationVisited: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.siteName}>
                        {d.siteName} (Brgy. {d.barangay})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purpose of Visit</label>
                  <select
                    value={formData.purposeOfVisit}
                    onChange={(e) => setFormData({ ...formData, purposeOfVisit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="Eco-Adventure">Eco-Adventure</option>
                    <option value="Cultural / Heritage">Cultural / Heritage</option>
                    <option value="Leisure / Vacation">Leisure / Vacation</option>
                    <option value="Business / MICE">Business / MICE</option>
                    <option value="Visiting Friends & Relatives">Visiting Friends & Relatives</option>
                    <option value="Education / Research">Education / Research</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Accommodation Used</label>
                  <input
                    type="text"
                    placeholder="e.g. Ridge View Highland Glamping"
                    value={formData.accommodationUsed}
                    onChange={(e) => setFormData({ ...formData, accommodationUsed: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Days Stayed</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.numberOfDaysStayed}
                    onChange={(e) => setFormData({ ...formData, numberOfDaysStayed: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transportation</label>
                  <select
                    value={formData.transportationUsed}
                    onChange={(e) => setFormData({ ...formData, transportationUsed: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="Private Vehicle">Private Vehicle</option>
                    <option value="Public Bus">Public Bus</option>
                    <option value="Van / UV Express">Van / UV Express</option>
                    <option value="Motorcycle / Habal-habal">Motorcycle / Habal-habal</option>
                    <option value="Rental Car">Rental Car</option>
                    <option value="Tourist Van">Tourist Van</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Direct Spend (PHP ₱)</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={formData.touristSpending}
                    onChange={(e) => setFormData({ ...formData, touristSpending: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Travel Companion</label>
                  <select
                    value={formData.travelCompanion}
                    onChange={(e) => setFormData({ ...formData, travelCompanion: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Friends / Group">Friends / Group</option>
                    <option value="Corporate / Delegation">Corporate / Delegation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Companions Count</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.companionsCount}
                    onChange={(e) => setFormData({ ...formData, companionsCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Feedback Rating</label>
                  <select
                    value={formData.feedbackRating}
                    onChange={(e) => setFormData({ ...formData, feedbackRating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-semibold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Satisfied)</option>
                    <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                    <option value={2}>⭐⭐ (2 - Fair)</option>
                    <option value={1}>⭐ (1 - Needs Improvement)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Comments / Review</label>
                  <input
                    type="text"
                    placeholder="Visitor impression, tour experience..."
                    value={formData.feedbackComments}
                    onChange={(e) => setFormData({ ...formData, feedbackComments: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              {!editingId && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoInc"
                    checked={autoIncrementCapacity}
                    onChange={(e) => setAutoIncrementCapacity(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <label htmlFor="autoInc" className="text-slate-700 font-medium text-xs">
                    Automatically update real-time carrying capacity headcount for {formData.destinationVisited} (+{1 + (formData.companionsCount || 0)} visitors)
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  {editingId ? 'Save Record Updates' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Printable Digital Tourist ID & Lanyard Badge */}
      {passBadgeOpen && selectedTourist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Official Municipal Tourist ID Badge</span>
              </div>
              <button onClick={() => setPassBadgeOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable ID Card Container */}
            <div className="p-6 text-center space-y-4">
              {/* Card Badge Header */}
              <div className="pb-3 border-b border-slate-200">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <img src="/logo/LGU_LOGO1.png" alt="LGU Malungon Seal" className="w-10 h-10 object-contain" />
                  <img src="/logo/TourismLogo.png" alt="Tourism Office Logo" className="w-10 h-10 object-contain" />
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Republic of the Philippines</div>
                <div className="text-xs font-bold text-slate-700 uppercase">{municipalityInfo.province}</div>
                <div className="text-base font-black text-slate-900 uppercase">{municipalityInfo.name}</div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase mt-0.5">{municipalityInfo.officeName}</div>
              </div>

              {/* Tourist Details */}
              <div className="space-y-1">
                <div className="text-lg font-black text-slate-900">{selectedTourist.name}</div>
                <div className="text-xs text-slate-600">
                  {selectedTourist.nationality} • {selectedTourist.isForeign ? 'International Traveler' : 'Domestic Visitor'}
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono mt-1">
                  Pass ID: {selectedTourist.touristId}
                </div>
              </div>

              {/* QR Code */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `MTODMS-PASS-${selectedTourist.touristId}-${selectedTourist.dateOfVisit}`
                  )}`}
                  alt="Tourist Verification Pass"
                  className="w-36 h-36 mx-auto rounded-lg"
                />
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 text-left space-y-1">
                <div><strong>Destination:</strong> {selectedTourist.destinationVisited}</div>
                <div><strong>Date of Visit:</strong> {selectedTourist.dateOfVisit}</div>
                <div><strong>Accommodation:</strong> {selectedTourist.accommodationUsed}</div>
                <div><strong>Validity:</strong> Fiscal Year 2026 • Verified Clearance</div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Lanyard Pass</span>
                </button>
                <button
                  onClick={() => setPassBadgeOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Certified DOT Form 1 Return View */}
      {dotFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Certified DOT Form 1: Monthly Tourist Arrivals</h3>
                  <p className="text-slate-400 text-xs">Official Statutory Submission to Department of Tourism Region XII</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Return</span>
                </button>
                <button onClick={() => setDotFormModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-800">
              <div className="text-center pb-4 border-b-2 border-slate-800">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <img src="/logo/LGU_LOGO1.png" alt="LGU Malungon Seal" className="w-14 h-14 object-contain drop-shadow" />
                  <img src="/logo/TourismLogo.png" alt="Tourism Office Logo" className="w-14 h-14 object-contain drop-shadow" />
                </div>
                <div className="font-bold text-[11px] text-slate-500 uppercase tracking-widest">Republic of the Philippines</div>
                <div className="font-bold text-xs uppercase">{municipalityInfo.province}</div>
                <div className="text-base font-black uppercase text-slate-900">{municipalityInfo.name}</div>
                <div className="font-bold text-emerald-800 text-xs uppercase mt-0.5">{municipalityInfo.officeName}</div>
                <div className="text-sm font-extrabold text-slate-900 mt-2 underline">
                  DOT FORM 1: MONTHLY STATISTICAL REPORT ON TOURIST ARRIVALS & RECEIPTS
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div><span className="text-slate-500">LGU:</span> <strong>{municipalityInfo.name}</strong></div>
                <div><span className="text-slate-500">Province:</span> <strong>{municipalityInfo.province}</strong></div>
                <div><span className="text-slate-500">Region:</span> <strong>{municipalityInfo.region}</strong></div>
                <div><span className="text-slate-500">Reporting Year:</span> <strong>2026</strong></div>
              </div>

              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2 border-r border-slate-200">Month</th>
                    <th className="p-2 text-right border-r border-slate-200">Domestic</th>
                    <th className="p-2 text-right border-r border-slate-200">Foreign</th>
                    <th className="p-2 text-right border-r border-slate-200">Total Pax</th>
                    <th className="p-2 text-right border-r border-slate-200">Overnight</th>
                    <th className="p-2 text-right border-r border-slate-200">ALOS</th>
                    <th className="p-2 text-right">Est. Spending (PHP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {monthlySummary.map((m) => (
                    <tr key={m.key}>
                      <td className="p-2 font-semibold border-r border-slate-200">{m.name}</td>
                      <td className="p-2 text-right border-r border-slate-200">{m.baseDom.toLocaleString()}</td>
                      <td className="p-2 text-right border-r border-slate-200">{m.baseFor.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold border-r border-slate-200">{m.total.toLocaleString()}</td>
                      <td className="p-2 text-right border-r border-slate-200">{m.overnight.toLocaleString()}</td>
                      <td className="p-2 text-right border-r border-slate-200">{m.alos}</td>
                      <td className="p-2 text-right font-bold text-emerald-800">₱{m.spend.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="text-slate-500 mb-6">Submitted by:</div>
                  <div className="font-bold border-b border-slate-400 pb-1 max-w-xs mx-auto">
                    {municipalityInfo.officerInCharge}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{municipalityInfo.officerPosition}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-6">Attested by:</div>
                  <div className="font-bold border-b border-slate-400 pb-1 max-w-xs mx-auto">
                    {municipalityInfo.mayorName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">{municipalityInfo.mayorTitle}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
