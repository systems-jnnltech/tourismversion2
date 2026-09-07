import React, { useState, useMemo } from 'react';
import {
  Store,
  Plus,
  Search,
  Download,
  Package,
  GraduationCap,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
  Coins,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  LayoutGrid,
  List,
  Eye,
  FileSpreadsheet,
  QrCode,
  Tag,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  X,
  Printer,
  Check
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
import { MSMETourism } from '../../types';
import { QRCodeModal } from '../common/QRCodeModal';

type SubTabKey = 'all' | 'inventory' | 'assistance' | 'analytics';
type ViewMode = 'grid' | 'table';

const ALL_PRODUCT_CATEGORIES: MSMETourism['productCategory'][] = [
  'Handicrafts & Weaving',
  'Processed Food & Delicacies',
  'Coffee & Cacao',
  'Souvenirs & Apparel',
  'Organic Agri-products',
  'Indigenous Arts',
];

export const MSMEView: React.FC = () => {
  const { msmes, addMsme, updateMsme, deleteMsme, isReadOnly, currentUser, municipalityInfo } = useTourism();

  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<SubTabKey>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterReg, setFilterReg] = useState<string>('ALL');
  const [filterBarangay, setFilterBarangay] = useState<string>('ALL');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedMsme, setSelectedMsme] = useState<MSMETourism | null>(null);

  // Form Initial Data (covers all 15 docx fields)
  const initialForm: Omit<MSMETourism, 'id'> = {
    name: '',
    owner: '',
    productCategory: 'Handicrafts & Weaving',
    localProducts: 'Handwoven Inabal textiles, beaded accessories, traditional tribal embroidery',
    productionCapacity: '40 units / month',
    marketLocation: 'Municipal Pasalubong Center & Provincial Trade Fairs',
    registrationStatus: 'Fully Registered',
    dtiRegistration: `DTI-R12-${Math.floor(1000000 + Math.random() * 9000000)}`,
    birRegistration: `234-567-${Math.floor(100 + Math.random() * 900)}-000`,
    barangay: 'Poblacion',
    contactInformation: '+63 917 555 4321',
    trainingsAttended: ['DTI OTOP Product Packaging & Barcoding 2025', 'Digital E-Commerce Bootcamp'],
    financialAssistanceReceived: 'DOST SETUP Technology Modernization Grant (₱120,000)',
    productPhotos: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    ],
    inventoryCount: 35,
    averagePrice: 1500,
  };
  const [formData, setFormData] = useState(initialForm);
  const [trainingsInput, setTrainingsInput] = useState(formData.trainingsAttended.join(', '));
  const [photosInput, setPhotosInput] = useState(formData.productPhotos.join(', '));

  // Unique Barangays
  const uniqueBarangays = useMemo(() => {
    const set = new Set<string>();
    msmes.forEach((m) => {
      if (m.barangay) set.add(m.barangay);
    });
    return Array.from(set).sort();
  }, [msmes]);

  // Filtered List
  const filtered = useMemo(() => {
    return msmes.filter((m) => {
      const matchesSearch =
        !searchTerm.trim() ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.localProducts.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.productCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.marketLocation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = filterCategory === 'ALL' || m.productCategory === filterCategory;
      const matchesReg = filterReg === 'ALL' || m.registrationStatus === filterReg;
      const matchesBgy = filterBarangay === 'ALL' || m.barangay === filterBarangay;

      return matchesSearch && matchesCat && matchesReg && matchesBgy;
    });
  }, [msmes, searchTerm, filterCategory, filterReg, filterBarangay]);

  // Statistical Key Aggregates
  const totalMSMEs = msmes.length;
  const fullyRegCount = msmes.filter((m) => m.registrationStatus === 'Fully Registered').length;
  const formalRatio = totalMSMEs > 0 ? Math.round((fullyRegCount / totalMSMEs) * 100) : 0;
  const totalInventory = msmes.reduce((sum, m) => sum + m.inventoryCount, 0);
  const inventoryValue = msmes.reduce((sum, m) => sum + m.inventoryCount * m.averagePrice, 0);

  // Category Distribution for Recharts
  const categoryChartData = useMemo(() => {
    const map: Record<string, { count: number; stock: number; value: number }> = {};
    msmes.forEach((m) => {
      if (!map[m.productCategory]) map[m.productCategory] = { count: 0, stock: 0, value: 0 };
      map[m.productCategory].count += 1;
      map[m.productCategory].stock += m.inventoryCount;
      map[m.productCategory].value += m.inventoryCount * m.averagePrice;
    });

    return Object.entries(map).map(([name, val]) => ({
      name,
      producers: val.count,
      inventoryUnits: val.stock,
      totalValueThousands: Math.round(val.value / 1000),
    }));
  }, [msmes]);

  const COLORS = ['#d97706', '#059669', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Form Open Handler
  const handleOpenForm = (msme?: MSMETourism) => {
    if (msme) {
      setEditingId(msme.id);
      setFormData({
        name: msme.name,
        owner: msme.owner,
        productCategory: msme.productCategory,
        localProducts: msme.localProducts,
        productionCapacity: msme.productionCapacity,
        marketLocation: msme.marketLocation,
        registrationStatus: msme.registrationStatus,
        dtiRegistration: msme.dtiRegistration,
        birRegistration: msme.birRegistration || '',
        barangay: msme.barangay,
        contactInformation: msme.contactInformation,
        trainingsAttended: msme.trainingsAttended || [],
        financialAssistanceReceived: msme.financialAssistanceReceived || '',
        productPhotos: msme.productPhotos || [],
        inventoryCount: msme.inventoryCount,
        averagePrice: msme.averagePrice,
      });
      setTrainingsInput((msme.trainingsAttended || []).join(', '));
      setPhotosInput((msme.productPhotos || []).join(', '));
    } else {
      setEditingId(null);
      setFormData({
        ...initialForm,
        dtiRegistration: `DTI-R12-${Math.floor(1000000 + Math.random() * 9000000)}`,
        birRegistration: `234-567-${Math.floor(100 + Math.random() * 900)}-000`,
      });
      setTrainingsInput(initialForm.trainingsAttended.join(', '));
      setPhotosInput(initialForm.productPhotos.join(', '));
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedTrainings = trainingsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const parsedPhotos = photosInput
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const submission: Omit<MSMETourism, 'id'> = {
      ...formData,
      trainingsAttended: parsedTrainings.length > 0 ? parsedTrainings : ['LGU Tourism Artisan Onboarding'],
      productPhotos: parsedPhotos.length > 0 ? parsedPhotos : ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'],
    };

    if (editingId) {
      updateMsme(editingId, submission);
    } else {
      addMsme(submission);
    }
    setIsFormOpen(false);
  };

  // Open Dossier Modal
  const handleOpenDossier = (m: MSMETourism) => {
    setSelectedMsme(m);
    setDossierModalOpen(true);
  };

  // Open QR Traceability Modal
  const handleOpenQR = (m: MSMETourism) => {
    setSelectedMsme(m);
    setQrModalOpen(true);
  };

  // Export CSV covering all 15 docx fields
  const handleExportCSV = () => {
    const headers = [
      'MSME Name',
      'Owner / Artisan',
      'Product Category',
      'Local Products',
      'Production Capacity',
      'Market Location',
      'Registration Status',
      'DTI Registration',
      'BIR TIN',
      'Barangay',
      'Contact Information',
      'Trainings Attended',
      'Financial Assistance Received',
      'Inventory Stock Count',
      'Average Price (PHP)',
    ];

    const rows = filtered.map((m) => [
      `"${m.name}"`,
      `"${m.owner}"`,
      `"${m.productCategory}"`,
      `"${m.localProducts.replace(/"/g, '""')}"`,
      `"${m.productionCapacity}"`,
      `"${m.marketLocation.replace(/"/g, '""')}"`,
      `"${m.registrationStatus}"`,
      `"${m.dtiRegistration}"`,
      `"${m.birRegistration || 'N/A'}"`,
      `"${m.barangay}"`,
      `"${m.contactInformation}"`,
      `"${(m.trainingsAttended || []).join('; ').replace(/"/g, '""')}"`,
      `"${(m.financialAssistanceReceived || 'None').replace(/"/g, '""')}"`,
      m.inventoryCount,
      m.averagePrice,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Malungon_MSME_Tourism_Registry_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome & Controls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Module D • Local Artisans & Enterprise Database</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            MSME Tourism Database (MSMETD)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Livelihood monitoring for Blaan & Tagakaolo master weavers, coffee & cacao growers, delicacy processors, and One Town One Product (OTOP) merchandise.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Registry CSV</span>
          </button>

          {!isReadOnly && (
            <button
              onClick={() => handleOpenForm()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register Tourism MSME</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Registered MSMEs</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalMSMEs}</div>
          <div className="text-xs text-amber-700 font-medium mt-1">Community artisan enterprises</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Formal Registration Rate</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1 flex items-baseline gap-1.5">
            <span>{formalRatio}%</span>
            <span className="text-xs font-semibold text-slate-500">({fullyRegCount} Registered)</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">DTI & BIR Business Name Registered</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${formalRatio}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Finished Goods Stock</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalInventory.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Pasalubong inventory available</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inventory Valuation</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">
            ₱{(inventoryValue / 1000).toFixed(0)}k
          </div>
          <div className="text-xs text-slate-500 mt-1">Direct community economic asset value</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>

      {/* 4 Operational Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: 'all', label: `All MSMEs Catalog (${filtered.length})`, icon: Store },
            { key: 'inventory', label: 'Product Inventory & Market Access', icon: Package },
            { key: 'assistance', label: 'Capacity Building & Livelihood Grants', icon: GraduationCap },
            { key: 'analytics', label: 'Market & Economic Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as SubTabKey)}
                className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher (Grid vs Table) for Tab 1 */}
        {activeTab === 'all' && (
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Show as Product Showcase Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Show as Detailed Table"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: ALL MSMES CATALOG & SHOWCASE */}
      {activeTab === 'all' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Multi-Criteria Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by enterprise name, artisan, product, or barangay..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-1 focus:ring-amber-500"
              >
                <option value="ALL">All Product Categories (6)</option>
                {ALL_PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={filterReg}
                onChange={(e) => setFilterReg(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-1 focus:ring-amber-500"
              >
                <option value="ALL">All Registration Statuses</option>
                <option value="Fully Registered">Fully Registered</option>
                <option value="DTI Only">DTI Only</option>
                <option value="In Progress">In Progress</option>
              </select>

              <select
                value={filterBarangay}
                onChange={(e) => setFilterBarangay(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:ring-1 focus:ring-amber-500"
              >
                <option value="ALL">All Barangays</option>
                {uniqueBarangays.map((bgy) => (
                  <option key={bgy} value={bgy}>
                    Brgy. {bgy}
                  </option>
                ))}
              </select>

              {(searchTerm || filterCategory !== 'ALL' || filterReg !== 'ALL' || filterBarangay !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('ALL');
                    setFilterReg('ALL');
                    setFilterBarangay('ALL');
                  }}
                  className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* VIEW MODE 1: SHOWCASE CARD GRID */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.length === 0 ? (
                <div className="col-span-full bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
                  No tourism MSMEs match the specified filter criteria.
                </div>
              ) : (
                filtered.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col overflow-hidden group"
                  >
                    <div className="h-44 bg-slate-100 overflow-hidden relative">
                      <img
                        src={m.productPhotos[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'}
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
                          {m.productCategory}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-emerald-700 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                        ₱{m.averagePrice.toLocaleString()} avg
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition-colors">
                          {m.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Artisan / Proprietor: <span className="font-semibold text-slate-800">{m.owner}</span>
                        </p>

                        <div className="mt-2 text-xs text-slate-600 space-y-1">
                          <div className="line-clamp-2 text-slate-700 font-medium">
                            <span className="font-bold text-slate-900">Products: </span>
                            {m.localProducts}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Capacity: {m.productionCapacity} • Stock: {m.inventoryCount} units</span>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Brgy. {m.barangay} • {m.marketLocation}</span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            {m.registrationStatus}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-mono border border-blue-200">
                            {m.dtiRegistration}
                          </span>
                          {m.birRegistration && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono">
                              TIN: {m.birRegistration}
                            </span>
                          )}
                        </div>

                        {/* Trainings & Grants */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] space-y-1">
                          <div className="text-slate-600 flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{m.trainingsAttended[0] || 'LGU Tourism Enterprise enrolled'}</span>
                          </div>
                          {m.financialAssistanceReceived && (
                            <div className="text-slate-600 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{m.financialAssistanceReceived}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{m.contactInformation}</span>
                        </span>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenDossier(m)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenQR(m)}
                            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Product Provenance QR Badge"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          {!isReadOnly && (
                            <>
                              <button
                                onClick={() => handleOpenForm(m)}
                                className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit MSME"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete ${m.name}?`)) {
                                    deleteMsme(m.id);
                                  }
                                }}
                                className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete MSME"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* VIEW MODE 2: DETAILED TABLE */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Enterprise / Proprietor</th>
                      <th className="px-4 py-3.5">Category & Barangay</th>
                      <th className="px-4 py-3.5">Local Products & Specialties</th>
                      <th className="px-4 py-3.5">Capacity & Stock</th>
                      <th className="px-3 py-3.5">Market Outlet</th>
                      <th className="px-3 py-3.5">Compliance</th>
                      <th className="px-3 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900 text-sm">{m.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">Proprietor: {m.owner}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{m.contactInformation}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold">
                            {m.productCategory}
                          </span>
                          <div className="text-xs text-slate-500 mt-1">Brgy. {m.barangay}</div>
                        </td>

                        <td className="px-4 py-3.5 max-w-xs">
                          <div className="font-medium text-slate-800 line-clamp-2">{m.localProducts}</div>
                          <div className="text-[11px] text-emerald-700 font-bold mt-0.5">₱{m.averagePrice.toLocaleString()} avg</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-900">{m.inventoryCount} units stock</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Cap: {m.productionCapacity}</div>
                        </td>

                        <td className="px-3 py-3.5 max-w-[180px] truncate" title={m.marketLocation}>
                          {m.marketLocation}
                        </td>

                        <td className="px-3 py-3.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {m.registrationStatus}
                          </span>
                          <div className="font-mono text-[10px] text-slate-500 mt-1">{m.dtiRegistration}</div>
                        </td>

                        <td className="px-3 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => handleOpenDossier(m)}
                              className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Full Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenQR(m)}
                              className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Product Provenance QR"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleOpenForm(m)}
                                  className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit MSME"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete ${m.name}?`)) {
                                      deleteMsme(m.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete MSME"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PRODUCT INVENTORY & MARKET ACCESS */}
      {activeTab === 'inventory' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-700" />
                <span>Finished Goods Inventory & Market Distribution Outlets</span>
              </h3>
              <p className="text-xs text-slate-500">
                Tracking warehouse finished product stock, monthly production capacities, and retail pasalubong channels
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Producer / MSME</th>
                    <th className="p-3">Product Category</th>
                    <th className="p-3">Primary Goods</th>
                    <th className="p-3 text-right">Stock (Units)</th>
                    <th className="p-3 text-right">Avg Unit Price</th>
                    <th className="p-3 text-right">Inventory Valuation</th>
                    <th className="p-3">Market Distribution Channels</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {msmes.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{m.name}</td>
                      <td className="p-3">{m.productCategory}</td>
                      <td className="p-3 max-w-xs truncate">{m.localProducts}</td>
                      <td className="p-3 text-right font-extrabold text-slate-900">{m.inventoryCount}</td>
                      <td className="p-3 text-right">₱{m.averagePrice.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-emerald-800">
                        ₱{(m.inventoryCount * m.averagePrice).toLocaleString()}
                      </td>
                      <td className="p-3 max-w-xs truncate text-slate-600">{m.marketLocation}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={3} className="p-3 uppercase">Total Finished Goods Inventory</td>
                    <td className="p-3 text-right text-indigo-900">{totalInventory.toLocaleString()} units</td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right text-emerald-900">₱{inventoryValue.toLocaleString()}</td>
                    <td className="p-3 text-slate-500">Pasalubong & Trade Centers</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CAPACITY BUILDING & LIVELIHOOD GRANTS */}
      {activeTab === 'assistance' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>Artisan Capacity Building & Technical Assistance Records</span>
              </h3>
              <p className="text-xs text-slate-500">
                Skills development, packaging modernizations, and financial grants received from DTI, DOST, and LGU
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {msmes.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                      <p className="text-xs text-slate-500">{m.productCategory} • Brgy. {m.barangay}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {m.registrationStatus}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <div>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Trainings Completed:</span>
                      </span>
                      <ul className="list-disc list-inside text-slate-600 mt-1 pl-1 space-y-0.5">
                        {m.trainingsAttended.map((t, idx) => (
                          <li key={idx} className="truncate">{t}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Grants & Tech Assistance:</span>
                      </span>
                      <div className="text-amber-900 font-semibold mt-0.5 pl-1">
                        {m.financialAssistanceReceived || 'None registered'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MARKET & ECONOMIC ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Valuation by Category */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-700" />
                <span>Inventory Valuation by Product Category</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">Gross market value (₱ Thousands) of current finished goods</p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                      formatter={(val: any) => [`₱${Number(val).toLocaleString()}k`, 'Valuation']}
                    />
                    <Bar dataKey="totalValueThousands" name="Valuation (₱k)" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Producers Distribution Donut */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-700" />
                <span>Artisan Producers Distribution</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">Sectoral breakdown of registered community enterprises</p>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryChartData} dataKey="producers" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={48}>
                      {categoryChartData.map((entry, index) => (
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

      {/* MODAL 1: Registration & Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingId ? 'Edit Tourism MSME Profile' : 'Register Tourism MSME / Artisan'}
                </h3>
                <p className="text-xs text-amber-200">LGU Malungon Community Enterprise Registry • RA 9593</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-amber-200 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business / Artisan Enterprise Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lamlifew Master Weavers Association"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proprietor / Representative</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bae Estelita Bantilan"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Category</label>
                  <select
                    value={formData.productCategory}
                    onChange={(e) => setFormData({ ...formData, productCategory: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    {ALL_PRODUCT_CATEGORIES.map((cat) => (
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
                    placeholder="e.g. Datal Tampal"
                    value={formData.barangay}
                    onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registration Status</label>
                  <select
                    value={formData.registrationStatus}
                    onChange={(e) => setFormData({ ...formData, registrationStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium"
                  >
                    <option value="Fully Registered">Fully Registered</option>
                    <option value="DTI Only">DTI Only</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Local Products & Specialties Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Handwoven Inabal fabrics, beaded accessories, traditional Tagakaolo embroidery..."
                  value={formData.localProducts}
                  onChange={(e) => setFormData({ ...formData, localProducts: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Production Capacity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 meters of fabric / 100 bottles"
                    value={formData.productionCapacity}
                    onChange={(e) => setFormData({ ...formData, productionCapacity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Market Distribution Outlets / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Municipal Pasalubong Center, Kalon Barak Ridge Booth"
                    value={formData.marketLocation}
                    onChange={(e) => setFormData({ ...formData, marketLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">DTI Registration Number</label>
                  <input
                    type="text"
                    value={formData.dtiRegistration}
                    onChange={(e) => setFormData({ ...formData, dtiRegistration: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">BIR TIN (Tax ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. 234-567-890-000"
                    value={formData.birRegistration}
                    onChange={(e) => setFormData({ ...formData, birRegistration: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone / Email</label>
                  <input
                    type="text"
                    required
                    placeholder="+63 9XX XXX XXXX"
                    value={formData.contactInformation}
                    onChange={(e) => setFormData({ ...formData, contactInformation: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Finished Inventory Stock (Units)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.inventoryCount}
                    onChange={(e) => setFormData({ ...formData, inventoryCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Average Unit Price (PHP ₱)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.averagePrice}
                    onChange={(e) => setFormData({ ...formData, averagePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trainings & Seminars Attended (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. DTI OTOP Product Packaging 2025, Digital E-Commerce, Food Safety"
                  value={trainingsInput}
                  onChange={(e) => setTrainingsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Financial & Technology Grants Received</label>
                  <input
                    type="text"
                    placeholder="e.g. DOST SETUP Grant (₱120,000), DTI Shared Facility"
                    value={formData.financialAssistanceReceived}
                    onChange={(e) => setFormData({ ...formData, financialAssistanceReceived: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Photo URL(s) (comma separated)</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={photosInput}
                    onChange={(e) => setPhotosInput(e.target.value)}
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
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  {editingId ? 'Save MSME Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MSME Profile Dossier Modal */}
      {dossierModalOpen && selectedMsme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedMsme.name}</h3>
                <p className="text-xs text-amber-200">{selectedMsme.productCategory} • Brgy. {selectedMsme.barangay}</p>
              </div>
              <button onClick={() => setDossierModalOpen(false)} className="text-amber-200 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="h-48 rounded-xl overflow-hidden border border-slate-200 relative">
                <img
                  src={selectedMsme.productPhotos[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'}
                  alt={selectedMsme.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white px-2.5 py-1 rounded-md font-bold text-xs backdrop-blur-xs">
                  {selectedMsme.productCategory}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Stock Count</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedMsme.inventoryCount} units</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Average Price</div>
                  <div className="font-bold text-emerald-800 text-sm mt-0.5">₱{selectedMsme.averagePrice.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Capacity</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">{selectedMsme.productionCapacity}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div><strong>Proprietor / Artisan:</strong> {selectedMsme.owner}</div>
                <div><strong>Location:</strong> Barangay {selectedMsme.barangay}, Malungon, Sarangani</div>
                <div><strong>Products:</strong> {selectedMsme.localProducts}</div>
                <div><strong>Market Outlets:</strong> {selectedMsme.marketLocation}</div>
                <div><strong>DTI Registration:</strong> {selectedMsme.dtiRegistration}</div>
                <div><strong>BIR TIN:</strong> {selectedMsme.birRegistration || 'N/A'}</div>
                <div><strong>Contact:</strong> {selectedMsme.contactInformation}</div>
                <div><strong>Grants / Assistance:</strong> {selectedMsme.financialAssistanceReceived || 'None registered'}</div>
                <div>
                  <strong>Trainings Attended:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700">
                    {selectedMsme.trainingsAttended.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Product Provenance QR Traceability Badge */}
      {selectedMsme && (
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setSelectedMsme(null);
          }}
          title={`Product Provenance: ${selectedMsme.name}`}
          subtitle={`OTOP Certified • Barangay ${selectedMsme.barangay}`}
          codeData={`MTODMS-MSME-PROVENANCE-${selectedMsme.id}-${selectedMsme.dtiRegistration}`}
          entityType="establishment"
          extraDetails={[
            { label: 'Producer', value: selectedMsme.name },
            { label: 'Master Artisan', value: selectedMsme.owner },
            { label: 'Category', value: selectedMsme.productCategory },
            { label: 'Barangay', value: `Brgy. ${selectedMsme.barangay}` },
            { label: 'DTI Registration', value: selectedMsme.dtiRegistration },
            { label: 'Certification', value: 'Municipal Tourism Verified Authentic' },
          ]}
        />
      )}
    </div>
  );
};
