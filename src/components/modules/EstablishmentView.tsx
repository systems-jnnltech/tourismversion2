import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Users,
  Coins,
  Edit2,
  Trash2,
  FileCheck,
  Eye,
  ExternalLink,
  ChevronDown,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  X,
  Check,
  Sparkles,
  BarChart3,
  Award,
  ClipboardList
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
  Legend
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import {
  TourismEstablishment,
  EstablishmentCategory,
  DOTAccreditationStatus,
  InspectionRecord
} from '../../types';
import { QRCodeModal } from '../common/QRCodeModal';

type SubTabKey = 'all' | 'compliance' | 'inspections' | 'renewals' | 'analytics';

const ALL_CATEGORIES: EstablishmentCategory[] = [
  'Resorts',
  'Hotels',
  'Homestays',
  'Restaurants',
  'Cafés',
  'Souvenir Shops',
  'Adventure Sites',
  'Eco Parks',
  'Campsites',
  'Farm Tourism',
  'Event Venues',
];

export const EstablishmentView: React.FC = () => {
  const {
    establishments,
    addEstablishment,
    updateEstablishment,
    deleteEstablishment,
    isReadOnly,
    currentUser,
    municipalityInfo,
  } = useTourism();

  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<SubTabKey>('all');

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterAccreditation, setFilterAccreditation] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterBarangay, setFilterBarangay] = useState<string>('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedEst, setSelectedEst] = useState<TourismEstablishment | null>(null);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);

  // New Inspection Form State
  const [newInspection, setNewInspection] = useState<Omit<InspectionRecord, 'id'>>({
    date: new Date().toISOString().substring(0, 10),
    inspector: currentUser.name,
    rating: 95,
    findings: 'Passed all municipal health, sanitary, and environmental compliance parameters.',
    status: 'Passed',
  });

  // Form Initial Data (all 17 docx fields)
  const initialForm: Omit<TourismEstablishment, 'id'> = {
    name: '',
    owner: '',
    category: 'Resorts',
    address: '',
    barangay: 'Poblacion',
    contactNumber: '+63 917 123 4567',
    email: 'info@enterprise.ph',
    businessPermitNumber: `BP-MLG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    dotAccreditationStatus: 'Accredited',
    dotAccreditationNumber: `DOT-R12-ACC-${Math.floor(1000 + Math.random() * 9000)}`,
    numberOfEmployees: 8,
    investmentCost: 2500000,
    annualRevenue: 1200000,
    environmentalCompliance: 'Compliant (ECC/CNC Issued)',
    safetyCompliance: 'Fire & Safety Certified',
    insuranceCoverage: 'Comprehensive Public Liability',
    businessStatus: 'Active & Operating',
    inspectionHistory: [
      {
        id: `INS-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().substring(0, 10),
        inspector: currentUser.name || 'MTO Inspection Team',
        rating: 92,
        findings: 'Fully compliant with DOT standards and municipal tourism code.',
        status: 'Passed',
      },
    ],
    renewalSchedule: '2027-01-20',
    photoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  };
  const [formData, setFormData] = useState(initialForm);

  // Unique Barangays
  const uniqueBarangays = useMemo(() => {
    const set = new Set<string>();
    establishments.forEach((e) => {
      if (e.barangay) set.add(e.barangay);
    });
    return Array.from(set).sort();
  }, [establishments]);

  // Filtered Establishments
  const filtered = useMemo(() => {
    return establishments.filter((est) => {
      const matchesSearch =
        !searchTerm.trim() ||
        est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.businessPermitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (est.dotAccreditationNumber && est.dotAccreditationNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = filterCategory === 'ALL' || est.category === filterCategory;
      const matchesAccred = filterAccreditation === 'ALL' || est.dotAccreditationStatus === filterAccreditation;
      const matchesStatus = filterStatus === 'ALL' || est.businessStatus === filterStatus;
      const matchesBarangay = filterBarangay === 'ALL' || est.barangay === filterBarangay;

      return matchesSearch && matchesCategory && matchesAccred && matchesStatus && matchesBarangay;
    });
  }, [establishments, searchTerm, filterCategory, filterAccreditation, filterStatus, filterBarangay]);

  // Key Analytics Aggregates
  const totalCount = establishments.length;
  const accreditedCount = establishments.filter((e) => e.dotAccreditationStatus === 'Accredited').length;
  const pendingCount = establishments.filter(
    (e) => e.dotAccreditationStatus === 'Application Pending' || e.dotAccreditationStatus === 'Under Inspection'
  ).length;
  const totalJobs = establishments.reduce((sum, e) => sum + e.numberOfEmployees, 0);
  const totalCapital = establishments.reduce((sum, e) => sum + (e.investmentCost || 0), 0);
  const totalRevenue = establishments.reduce((sum, e) => sum + (e.annualRevenue || 0), 0);
  const accreditationRate = totalCount > 0 ? Math.round((accreditedCount / totalCount) * 100) : 0;

  // Category Distribution for Analytics Chart
  const categoryChartData = useMemo(() => {
    const map: Record<string, { count: number; employees: number; capital: number }> = {};
    establishments.forEach((e) => {
      if (!map[e.category]) map[e.category] = { count: 0, employees: 0, capital: 0 };
      map[e.category].count += 1;
      map[e.category].employees += e.numberOfEmployees;
      map[e.category].capital += e.investmentCost || 0;
    });

    return Object.entries(map).map(([name, val]) => ({
      name,
      establishments: val.count,
      employees: val.employees,
      capitalMillions: Math.round((val.capital / 1000000) * 10) / 10,
    }));
  }, [establishments]);

  // Accreditation Breakdown Chart Data
  const accreditationChartData = useMemo(() => {
    const map: Record<string, number> = {};
    establishments.forEach((e) => {
      map[e.dotAccreditationStatus] = (map[e.dotAccreditationStatus] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [establishments]);

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Form Handlers
  const handleOpenForm = (est?: TourismEstablishment) => {
    if (est) {
      setEditingId(est.id);
      setFormData({
        name: est.name,
        owner: est.owner,
        category: est.category,
        address: est.address,
        barangay: est.barangay,
        contactNumber: est.contactNumber,
        email: est.email,
        businessPermitNumber: est.businessPermitNumber,
        dotAccreditationStatus: est.dotAccreditationStatus,
        dotAccreditationNumber: est.dotAccreditationNumber || '',
        numberOfEmployees: est.numberOfEmployees,
        investmentCost: est.investmentCost,
        annualRevenue: est.annualRevenue,
        environmentalCompliance: est.environmentalCompliance,
        safetyCompliance: est.safetyCompliance,
        insuranceCoverage: est.insuranceCoverage,
        businessStatus: est.businessStatus,
        inspectionHistory: est.inspectionHistory || [],
        renewalSchedule: est.renewalSchedule,
        photoUrl: est.photoUrl,
      });
    } else {
      setEditingId(null);
      setFormData({
        ...initialForm,
        businessPermitNumber: `BP-MLG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        dotAccreditationNumber: `DOT-R12-ACC-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateEstablishment(editingId, formData);
    } else {
      addEstablishment(formData);
    }
    setIsFormOpen(false);
  };

  // Open Inspection Center Modal
  const handleOpenInspections = (est: TourismEstablishment) => {
    setSelectedEst(est);
    setInspectModalOpen(true);
  };

  // Record New Inspection Log
  const handleRecordInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEst) return;

    const newRec: InspectionRecord = {
      id: `INS-${Date.now().toString().slice(-4)}`,
      date: newInspection.date,
      inspector: newInspection.inspector,
      rating: Number(newInspection.rating),
      findings: newInspection.findings,
      status: newInspection.status,
    };

    const updatedHistory = [newRec, ...(selectedEst.inspectionHistory || [])];
    updateEstablishment(selectedEst.id, { inspectionHistory: updatedHistory });
    setSelectedEst({ ...selectedEst, inspectionHistory: updatedHistory });

    setNewInspection({
      date: new Date().toISOString().substring(0, 10),
      inspector: currentUser.name,
      rating: 95,
      findings: 'Routine follow-up inspection conducted.',
      status: 'Passed',
    });
  };

  // Open Dossier Modal
  const handleOpenDossier = (est: TourismEstablishment) => {
    setSelectedEst(est);
    setDossierModalOpen(true);
  };

  // Open Certificate Modal
  const handleOpenCertificate = (est: TourismEstablishment) => {
    setSelectedEst(est);
    setCertificateModalOpen(true);
  };

  // Open QR Pass Modal (Properly wired!)
  const handleOpenQR = (est: TourismEstablishment) => {
    setSelectedEst(est);
    setQrModalOpen(true);
  };

  // Export Complete CSV with all 17 fields
  const handleExportCSV = () => {
    const headers = [
      'Establishment Name',
      'Proprietor / Owner',
      'Category',
      'Complete Address',
      'Barangay',
      'Contact Number',
      'Email Address',
      'Business Permit Number',
      'DOT Accreditation Status',
      'DOT Accreditation Number',
      'Number of Employees',
      'Investment Capital (PHP)',
      'Annual Gross Revenue (PHP)',
      'Environmental Compliance',
      'Safety Compliance',
      'Insurance Coverage',
      'Business Status',
      'Renewal Schedule',
    ];

    const rows = filtered.map((e) => [
      `"${e.name}"`,
      `"${e.owner}"`,
      `"${e.category}"`,
      `"${e.address.replace(/"/g, '""')}"`,
      `"${e.barangay}"`,
      `"${e.contactNumber}"`,
      `"${e.email}"`,
      `"${e.businessPermitNumber}"`,
      `"${e.dotAccreditationStatus}"`,
      `"${e.dotAccreditationNumber || 'N/A'}"`,
      e.numberOfEmployees,
      e.investmentCost,
      e.annualRevenue,
      `"${e.environmentalCompliance}"`,
      `"${e.safetyCompliance}"`,
      `"${e.insuranceCoverage}"`,
      `"${e.businessStatus}"`,
      `"${e.renewalSchedule}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Malungon_Tourism_Establishments_Roster_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome & Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Module C • Enterprise Database & Compliance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tourism Establishment Database (TED)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Official registry of tourism enterprises, resorts, hotels, homestays, and dining establishments in Malungon with DOT accreditation, safety audits, and renewal schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Roster CSV</span>
          </button>

          {!isReadOnly && (
            <button
              onClick={() => handleOpenForm()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register Enterprise</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Registered Enterprises</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalCount}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span className="text-emerald-700 font-bold">{accreditedCount} DOT Accredited</span>
            <span className="font-extrabold text-slate-800">{accreditationRate}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${accreditationRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tourism Labor Force</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalJobs} Jobs</div>
          <div className="text-xs text-slate-500 mt-1">Direct local employment in municipal tourism</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Declared Capital Inflow</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">
            ₱{(totalCapital / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-slate-500 mt-1">Aggregate investment in tourism facilities</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Accreditation Pipeline</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{pendingCount} Pending</div>
          <div className="text-xs text-slate-500 mt-1">Under inspection or evaluation for 2026</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, pendingCount * 25)}%` }}></div>
          </div>
        </div>
      </div>

      {/* 5 Operational Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-1.5 text-xs font-bold">
        {[
          { key: 'all', label: `All Establishments Roster (${filtered.length})`, icon: Building2 },
          { key: 'compliance', label: 'DOT Accreditation & Safety Compliance', icon: ShieldCheck },
          { key: 'inspections', label: 'Inspection History & Audit Center', icon: ClipboardList },
          { key: 'renewals', label: 'Permit Renewal Calendar', icon: Calendar },
          { key: 'analytics', label: 'Economic & Labor Analytics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as SubTabKey)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: ALL ESTABLISHMENTS ROSTER */}
      {activeTab === 'all' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by business name, owner, permit number, or barangay..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Categories (11)</option>
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* DOT Accreditation Filter */}
              <select
                value={filterAccreditation}
                onChange={(e) => setFilterAccreditation(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Accreditation Statuses</option>
                <option value="Accredited">DOT Accredited</option>
                <option value="Application Pending">Application Pending</option>
                <option value="Under Inspection">Under Inspection</option>
                <option value="Expired / For Renewal">Expired / For Renewal</option>
                <option value="Not Accredited">Not Accredited</option>
              </select>

              {/* Barangay Filter */}
              <select
                value={filterBarangay}
                onChange={(e) => setFilterBarangay(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Barangays</option>
                {uniqueBarangays.map((bgy) => (
                  <option key={bgy} value={bgy}>
                    Brgy. {bgy}
                  </option>
                ))}
              </select>

              {(searchTerm || filterCategory !== 'ALL' || filterAccreditation !== 'ALL' || filterBarangay !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('ALL');
                    setFilterAccreditation('ALL');
                    setFilterBarangay('ALL');
                  }}
                  className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Establishments Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Establishment / Owner</th>
                    <th className="px-4 py-3.5">Category & Barangay</th>
                    <th className="px-4 py-3.5">DOT Accreditation</th>
                    <th className="px-4 py-3.5">Compliance & Safety</th>
                    <th className="px-3 py-3.5">Jobs & Capital</th>
                    <th className="px-3 py-3.5">Business Status</th>
                    <th className="px-3 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        No tourism establishments match the specified filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((est) => (
                      <tr key={est.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900 text-sm">{est.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">Proprietor: {est.owner}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Permit: {est.businessPermitNumber}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold">
                            {est.category}
                          </span>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Brgy. {est.barangay}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              est.dotAccreditationStatus === 'Accredited'
                                ? 'bg-emerald-100 text-emerald-800'
                                : est.dotAccreditationStatus === 'Application Pending'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {est.dotAccreditationStatus}
                          </span>
                          {est.dotAccreditationNumber && (
                            <div className="font-mono text-[10px] text-slate-500 mt-1">{est.dotAccreditationNumber}</div>
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="text-xs text-slate-700 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[160px]">{est.environmentalCompliance}</span>
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate max-w-[160px]">{est.safetyCompliance}</span>
                          </div>
                        </td>

                        <td className="px-3 py-3.5">
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{est.numberOfEmployees} Employees</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Capital: ₱{(est.investmentCost / 1000).toFixed(0)}k
                          </div>
                        </td>

                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              est.businessStatus === 'Active & Operating'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {est.businessStatus}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">Renewal: {est.renewalSchedule}</div>
                        </td>

                        <td className="px-3 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleOpenDossier(est)}
                              className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Full Profile Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenInspections(est)}
                              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Audit & Inspection History"
                            >
                              <ClipboardList className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenCertificate(est)}
                              className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Print Accreditation Certificate"
                            >
                              <Award className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenQR(est)}
                              className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Generate Verification QR Badge"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleOpenForm(est)}
                                  className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit Establishment"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete ${est.name}?`)) {
                                      deleteEstablishment(est.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Establishment"
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

            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Showing {filtered.length} of {establishments.length} tourism enterprises</span>
              <span className="font-mono text-[11px]">DOT Regional Office Registry Sync Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DOT ACCREDITATION & COMPLIANCE TRACKER */}
      {activeTab === 'compliance' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>DOT Accreditation & Environmental Compliance Status</span>
              </h3>
              <p className="text-xs text-slate-500">
                Compliance monitoring per Republic Act 9593 (Tourism Act of 2009) and municipal environmental ordinances
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs font-bold text-emerald-900 uppercase">Accredited Enterprises</div>
                <div className="text-2xl font-black text-emerald-950 mt-1">{accreditedCount} of {totalCount}</div>
                <div className="text-xs text-emerald-700 mt-1">{accreditationRate}% compliance rate</div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-xs font-bold text-blue-900 uppercase">Environmental ECC/CNC Issued</div>
                <div className="text-2xl font-black text-blue-950 mt-1">
                  {establishments.filter((e) => e.environmentalCompliance.includes('Compliant')).length}
                </div>
                <div className="text-xs text-blue-700 mt-1">DENR & MENRO Verified</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-xs font-bold text-amber-900 uppercase">Fire Safety Certified</div>
                <div className="text-2xl font-black text-amber-950 mt-1">
                  {establishments.filter((e) => e.safetyCompliance.includes('Certified')).length}
                </div>
                <div className="text-xs text-amber-700 mt-1">BFP Annual Inspection Pass</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Enterprise</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">DOT Status</th>
                    <th className="p-3">Accreditation Number</th>
                    <th className="p-3">Environmental ECC</th>
                    <th className="p-3">Insurance Coverage</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {establishments.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{e.name}</td>
                      <td className="p-3">{e.category}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          e.dotAccreditationStatus === 'Accredited' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {e.dotAccreditationStatus}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">{e.dotAccreditationNumber || 'Pending Issuance'}</td>
                      <td className="p-3">{e.environmentalCompliance}</td>
                      <td className="p-3">{e.insuranceCoverage}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenCertificate(e)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md font-bold transition-colors"
                        >
                          Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INSPECTION HISTORY & AUDIT CENTER */}
      {activeTab === 'inspections' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-700" />
                <span>Inspection Records & Regulatory Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-500">
                Joint municipal inspection team audit scores, sanitary clearances, and corrective findings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {establishments.map((est) => {
                const latest = est.inspectionHistory?.[0];
                return (
                  <div key={est.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{est.name}</h4>
                        <p className="text-xs text-slate-500">{est.category} • Brgy. {est.barangay}</p>
                      </div>
                      <button
                        onClick={() => handleOpenInspections(est)}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Inspect / History ({est.inspectionHistory?.length || 0})
                      </button>
                    </div>

                    {latest ? (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">Latest: {latest.date}</span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                            latest.status === 'Passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {latest.status} ({latest.rating}/100)
                          </span>
                        </div>
                        <div className="text-slate-600 italic text-[11px]">"{latest.findings}"</div>
                        <div className="text-[10px] text-slate-400">Auditor: {latest.inspector}</div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">No inspection records logged yet.</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PERMIT RENEWAL CALENDAR */}
      {activeTab === 'renewals' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Annual Permit Renewal Schedule & Expiration Tracker</span>
              </h3>
              <p className="text-xs text-slate-500">
                Timeline of upcoming municipal business permit and DOT accreditation renewals
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Enterprise</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Permit Number</th>
                    <th className="p-3">Renewal Target Date</th>
                    <th className="p-3">Validity Window</th>
                    <th className="p-3">Contact Email / Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {establishments.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{e.name}</td>
                      <td className="p-3">{e.category}</td>
                      <td className="p-3 font-mono text-[11px]">{e.businessPermitNumber}</td>
                      <td className="p-3 font-bold text-indigo-900">{e.renewalSchedule}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active & Current
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{e.contactNumber} • {e.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: ECONOMIC & EMPLOYMENT ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employment by Category */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <span>Direct Employment by Tourism Category</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">Total headcount employed across local businesses</p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="employees" name="Employees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Accreditation Ratio Donut */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>DOT Accreditation Status Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">Accreditation compliance across all 11 categories</p>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={accreditationChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={48}>
                      {accreditationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Add / Edit Establishment Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingId ? 'Edit Tourism Establishment Record' : 'Register New Tourism Enterprise'}
                </h3>
                <p className="text-xs text-blue-200">Comprehensive LGU Regulatory Registry • DOT Standards</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-blue-200 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Establishment / Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kalon Barak Highland Resort"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Owner / Managing Entity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan Dela Cruz / Highland Hospitality Corp"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tourism Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EstablishmentCategory })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barangay</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Poblacion"
                    value={formData.barangay}
                    onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Status</label>
                  <select
                    value={formData.businessStatus}
                    onChange={(e) => setFormData({ ...formData, businessStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="Active & Operating">Active & Operating</option>
                    <option value="Temporary Closed">Temporary Closed</option>
                    <option value="Under Renovation">Under Renovation</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Complete Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Purok 4, Upper Mainit, Malungon, Sarangani"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone & Email</label>
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
                      placeholder="info@business.ph"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Permit Number</label>
                  <input
                    type="text"
                    required
                    value={formData.businessPermitNumber}
                    onChange={(e) => setFormData({ ...formData, businessPermitNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">DOT Accreditation Status</label>
                  <select
                    value={formData.dotAccreditationStatus}
                    onChange={(e) => setFormData({ ...formData, dotAccreditationStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="Accredited">Accredited</option>
                    <option value="Application Pending">Application Pending</option>
                    <option value="Under Inspection">Under Inspection</option>
                    <option value="Expired / For Renewal">Expired / For Renewal</option>
                    <option value="Not Accredited">Not Accredited</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">DOT Accreditation Number</label>
                  <input
                    type="text"
                    placeholder="e.g. DOT-R12-ACC-2026-081"
                    value={formData.dotAccreditationNumber}
                    onChange={(e) => setFormData({ ...formData, dotAccreditationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Number of Employees</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.numberOfEmployees}
                    onChange={(e) => setFormData({ ...formData, numberOfEmployees: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Investment Cost (PHP ₱)</label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={formData.investmentCost}
                    onChange={(e) => setFormData({ ...formData, investmentCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual Revenue (PHP ₱)</label>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={formData.annualRevenue}
                    onChange={(e) => setFormData({ ...formData, annualRevenue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Environmental Compliance</label>
                  <select
                    value={formData.environmentalCompliance}
                    onChange={(e) => setFormData({ ...formData, environmentalCompliance: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  >
                    <option value="Compliant (ECC/CNC Issued)">Compliant (ECC/CNC Issued)</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Non-Compliant">Non-Compliant</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Safety Compliance</label>
                  <select
                    value={formData.safetyCompliance}
                    onChange={(e) => setFormData({ ...formData, safetyCompliance: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  >
                    <option value="Fire & Safety Certified">Fire & Safety Certified</option>
                    <option value="Pending Inspection">Pending Inspection</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Insurance Coverage</label>
                  <select
                    value={formData.insuranceCoverage}
                    onChange={(e) => setFormData({ ...formData, insuranceCoverage: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  >
                    <option value="Comprehensive Public Liability">Comprehensive Public Liability</option>
                    <option value="Basic">Basic</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Renewal Schedule Target</label>
                  <input
                    type="date"
                    required
                    value={formData.renewalSchedule}
                    onChange={(e) => setFormData({ ...formData, renewalSchedule: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Photo Reference URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

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
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Inspection Audit Center & History Logger */}
      {inspectModalOpen && selectedEst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Inspection History & Safety Audit</h3>
                <p className="text-xs text-emerald-200">{selectedEst.name} • Permit: {selectedEst.businessPermitNumber}</p>
              </div>
              <button onClick={() => setInspectModalOpen(false)} className="text-emerald-200 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Log New Inspection Form */}
              {!isReadOnly && (
                <form onSubmit={handleRecordInspection} className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record New On-Site Inspection</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Audit Date</label>
                      <input
                        type="date"
                        required
                        value={newInspection.date}
                        onChange={(e) => setNewInspection({ ...newInspection, date: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Inspector Name</label>
                      <input
                        type="text"
                        required
                        value={newInspection.inspector}
                        onChange={(e) => setNewInspection({ ...newInspection, inspector: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Score Rating (0-100)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        required
                        value={newInspection.rating}
                        onChange={(e) => setNewInspection({ ...newInspection, rating: parseInt(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Findings & Observations</label>
                      <input
                        type="text"
                        required
                        placeholder="Sanitary conditions, fire exits, emergency signage..."
                        value={newInspection.findings}
                        onChange={(e) => setNewInspection({ ...newInspection, findings: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Audit Status</label>
                      <select
                        value={newInspection.status}
                        onChange={(e) => setNewInspection({ ...newInspection, status: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                      >
                        <option value="Passed">Passed</option>
                        <option value="Conditional Pass">Conditional Pass</option>
                        <option value="Failed / Action Needed">Failed / Action Needed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs transition-colors"
                    >
                      Save Inspection Audit
                    </button>
                  </div>
                </form>
              )}

              {/* Historical Logs List */}
              <div className="space-y-2">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">Audit Log History</div>
                {selectedEst.inspectionHistory && selectedEst.inspectionHistory.length > 0 ? (
                  selectedEst.inspectionHistory.map((rec) => (
                    <div key={rec.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rec.date} • {rec.inspector}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.status === 'Passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.status} ({rec.rating}/100)
                        </span>
                      </div>
                      <p className="text-slate-600 italic">"{rec.findings}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 italic">No historical inspection records on file.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Enterprise Full Dossier View */}
      {dossierModalOpen && selectedEst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-base">{selectedEst.name}</h3>
                  <p className="text-xs text-slate-400">{selectedEst.category} • Brgy. {selectedEst.barangay}</p>
                </div>
              </div>
              <button onClick={() => setDossierModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">DOT Status</div>
                  <div className="font-bold text-emerald-800 text-sm mt-0.5">{selectedEst.dotAccreditationStatus}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Employees</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedEst.numberOfEmployees} Staff</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Capital Investment</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">₱{selectedEst.investmentCost.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Annual Revenue</div>
                  <div className="font-bold text-emerald-800 text-sm mt-0.5">₱{selectedEst.annualRevenue.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div><strong>Business Proprietor:</strong> {selectedEst.owner}</div>
                <div><strong>Complete Address:</strong> {selectedEst.address} (Brgy. {selectedEst.barangay})</div>
                <div><strong>Permit Details:</strong> Business Permit No. {selectedEst.businessPermitNumber} • DOT No. {selectedEst.dotAccreditationNumber || 'N/A'}</div>
                <div><strong>Contact:</strong> {selectedEst.contactNumber} • {selectedEst.email}</div>
                <div><strong>Environmental ECC/CNC:</strong> {selectedEst.environmentalCompliance}</div>
                <div><strong>Fire & Safety Certification:</strong> {selectedEst.safetyCompliance}</div>
                <div><strong>Insurance:</strong> {selectedEst.insuranceCoverage}</div>
                <div><strong>Next Renewal Schedule:</strong> {selectedEst.renewalSchedule}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Printable Enterprise Accreditation Certificate */}
      {certificateModalOpen && selectedEst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Print Official Tourism Enterprise Clearance Certificate</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print Certificate</span>
                </button>
                <button onClick={() => setCertificateModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 text-center space-y-4 text-slate-800 text-xs">
              <div className="pb-4 border-b-2 border-slate-800">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <img src="/logo/LGU_LOGO1.png" alt="LGU Malungon Seal" className="w-14 h-14 object-contain drop-shadow" />
                  <img src="/logo/TourismLogo.png" alt="Tourism Office Logo" className="w-14 h-14 object-contain drop-shadow" />
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Republic of the Philippines</div>
                <div className="text-xs font-bold text-slate-700 uppercase">{municipalityInfo.province}</div>
                <div className="text-lg font-black text-slate-900 uppercase tracking-tight">{municipalityInfo.name}</div>
                <div className="text-xs font-bold text-blue-900 uppercase mt-0.5">{municipalityInfo.officeName}</div>
              </div>

              <div className="py-2">
                <div className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">
                  CERTIFICATE OF MUNICIPAL TOURISM ACCREDITATION CLEARANCE
                </div>
                <div className="text-[11px] text-slate-500 mt-1">This is to certify that</div>
                <div className="text-xl font-black text-blue-950 uppercase tracking-wide my-2">{selectedEst.name}</div>
                <div className="text-xs text-slate-700">
                  located at <strong>{selectedEst.address}</strong>, Barangay <strong>{selectedEst.barangay}</strong>, operated by{' '}
                  <strong>{selectedEst.owner}</strong>, has satisfactorily satisfied the municipal tourism standards, sanitary, safety, and environmental criteria.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 text-left text-xs gap-2">
                <div><strong>Category:</strong> {selectedEst.category}</div>
                <div><strong>Business Permit:</strong> {selectedEst.businessPermitNumber}</div>
                <div><strong>DOT Status:</strong> {selectedEst.dotAccreditationStatus}</div>
                <div><strong>Validity:</strong> Fiscal Year 2026 (Exp: {selectedEst.renewalSchedule})</div>
              </div>

              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="font-bold border-b border-slate-400 pb-1 max-w-xs mx-auto">
                    {municipalityInfo.officerInCharge}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">{municipalityInfo.officerPosition}</div>
                </div>
                <div>
                  <div className="font-bold border-b border-slate-400 pb-1 max-w-xs mx-auto">
                    {municipalityInfo.mayorName}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">{municipalityInfo.mayorTitle}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Fixed QR Code Accreditation Pass Modal */}
      {selectedEst && (
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setSelectedEst(null);
          }}
          title={selectedEst.name}
          subtitle={`Permit: ${selectedEst.businessPermitNumber} • ${selectedEst.dotAccreditationStatus}`}
          codeData={`MTODMS-ENTERPRISE-PASS-${selectedEst.id}-${selectedEst.businessPermitNumber}`}
          entityType="establishment"
          extraDetails={[
            { label: 'Establishment', value: selectedEst.name },
            { label: 'Proprietor', value: selectedEst.owner },
            { label: 'Category', value: selectedEst.category },
            { label: 'Barangay', value: `Brgy. ${selectedEst.barangay}` },
            { label: 'Business Permit', value: selectedEst.businessPermitNumber },
            { label: 'DOT Status', value: selectedEst.dotAccreditationStatus },
            { label: 'Accreditation No.', value: selectedEst.dotAccreditationNumber || 'Pending' },
            { label: 'Validity Schedule', value: selectedEst.renewalSchedule },
          ]}
        />
      )}
    </div>
  );
};
