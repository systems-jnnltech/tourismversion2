import React, { useState } from 'react';
import {
  Mountain,
  MapPin,
  Compass,
  Plus,
  Search,
  Download,
  Users,
  Navigation,
  ShieldCheck,
  Edit2,
  Trash2,
  Clock,
  Camera,
  Coins,
  CheckCircle2,
  AlertCircle,
  Eye,
  Printer,
  QrCode,
  Layers,
  ArrowUpDown,
  Filter,
  Grid,
  Table as TableIcon,
  Phone,
  User,
  Activity,
  ExternalLink,
  RefreshCw,
  X,
  ShieldAlert,
  FileText,
  Check,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  Info,
  Car,
  Footprints
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { TourismDestination, DestinationClassification } from '../../types';
import { GISMapModal } from '../common/GISMapModal';
import { QRCodeModal } from '../common/QRCodeModal';

type SubTab = 'catalog' | 'capacity' | 'logistics' | 'facilities' | 'gallery';

export const DestinationView: React.FC = () => {
  const { destinations, addDestination, updateDestination, deleteDestination, isReadOnly, municipalityInfo } = useTourism();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<SubTab>('catalog');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterBarangay, setFilterBarangay] = useState('ALL');
  const [filterAccess, setFilterAccess] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [gisModalOpen, setGisModalOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(undefined);

  // Detail Dossier & Factsheet Modal
  const [dossierDestination, setDossierDestination] = useState<TourismDestination | null>(null);
  const [factsheetDestination, setFactsheetDestination] = useState<TourismDestination | null>(null);

  // QR Code Modal
  const [qrDestination, setQrDestination] = useState<TourismDestination | null>(null);

  // Photo viewer modal
  const [inspectPhoto, setInspectPhoto] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  // Form Initial State (All 19+ specification fields)
  const initialForm: Omit<TourismDestination, 'id'> = {
    siteName: '',
    barangay: 'Poblacion',
    gpsCoordinates: '6.2714° N, 125.2638° E',
    lat: 6.2714,
    lng: 125.2638,
    elevation: '780 meters above sea level',
    accessibility: 'All vehicles',
    distanceFromMunicipalHallKm: 8.5,
    travelTimeMinutes: 20,
    classification: 'Natural / Eco-tourism',
    attractions: ['Scenic mountain viewpoints', 'Refreshing mountain breeze', 'Highland panorama'],
    facilitiesAvailable: ['Clean Restrooms', 'Cottages', 'Viewing Deck', 'Cafe', 'Parking Space'],
    safetyEquipment: ['First Aid Post', 'Radio Communication', 'Trained Tourism Police'],
    tourismActivities: ['Sightseeing', 'Photography', 'Camping', 'Coffee Tasting'],
    carryingCapacityDaily: 400,
    currentVisitorsToday: 85,
    entranceFee: 50,
    contactPerson: 'Site Coordinator',
    contactNumber: '+63 920 111 2233',
    status: 'Open / Normal Operations',
    photos: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    ],
    droneImagesCount: 6,
    hasGisMap: true,
  };

  const [formData, setFormData] = useState(initialForm);
  // Input fields for comma/newline separated multi-items
  const [formAttractionsText, setFormAttractionsText] = useState('');
  const [formFacilitiesText, setFormFacilitiesText] = useState('');
  const [formSafetyText, setFormSafetyText] = useState('');
  const [formActivitiesText, setFormActivitiesText] = useState('');
  const [formPhotosText, setFormPhotosText] = useState('');

  // Filtered destinations
  const filtered = destinations.filter((dest) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      dest.siteName.toLowerCase().includes(term) ||
      dest.barangay.toLowerCase().includes(term) ||
      dest.classification.toLowerCase().includes(term) ||
      dest.attractions.some((a) => a.toLowerCase().includes(term)) ||
      dest.tourismActivities.some((act) => act.toLowerCase().includes(term));

    const matchesClass = filterClass === 'ALL' || dest.classification === filterClass;
    const matchesBrgy = filterBarangay === 'ALL' || dest.barangay.toLowerCase() === filterBarangay.toLowerCase();
    const matchesAccess = filterAccess === 'ALL' || dest.accessibility === filterAccess;
    const matchesStatus = filterStatus === 'ALL' || dest.status === filterStatus;

    return matchesSearch && matchesClass && matchesBrgy && matchesAccess && matchesStatus;
  });

  // Aggregated KPIs
  const totalDestinations = destinations.length;
  const totalDailyCapacity = destinations.reduce((sum, d) => sum + d.carryingCapacityDaily, 0);
  const totalVisitorsToday = destinations.reduce((sum, d) => sum + d.currentVisitorsToday, 0);
  const overallLoadFactor = Math.round((totalVisitorsToday / (totalDailyCapacity || 1)) * 100);
  const totalDroneScans = destinations.reduce((sum, d) => sum + (d.droneImagesCount || 0), 0);

  // Barangay list for filter
  const uniqueBarangays = Array.from(new Set(destinations.map((d) => d.barangay))).sort();

  // Headcount adjuster for field rangers
  const handleAdjustVisitors = (destId: string, delta: number) => {
    const dest = destinations.find((d) => d.id === destId);
    if (!dest) return;
    const newCount = Math.max(0, dest.currentVisitorsToday + delta);
    updateDestination(destId, { currentVisitorsToday: newCount });
  };

  const handleResetVisitors = (destId: string) => {
    updateDestination(destId, { currentVisitorsToday: 0 });
  };

  // Open Form
  const handleOpenForm = (dest?: TourismDestination) => {
    if (dest) {
      setEditingId(dest.id);
      setFormData({
        siteName: dest.siteName,
        barangay: dest.barangay,
        gpsCoordinates: dest.gpsCoordinates,
        lat: dest.lat,
        lng: dest.lng,
        elevation: dest.elevation,
        accessibility: dest.accessibility,
        distanceFromMunicipalHallKm: dest.distanceFromMunicipalHallKm,
        travelTimeMinutes: dest.travelTimeMinutes,
        classification: dest.classification,
        attractions: dest.attractions,
        facilitiesAvailable: dest.facilitiesAvailable,
        safetyEquipment: dest.safetyEquipment,
        tourismActivities: dest.tourismActivities,
        carryingCapacityDaily: dest.carryingCapacityDaily,
        currentVisitorsToday: dest.currentVisitorsToday,
        entranceFee: dest.entranceFee,
        contactPerson: dest.contactPerson,
        contactNumber: dest.contactNumber,
        status: dest.status,
        photos: dest.photos,
        droneImagesCount: dest.droneImagesCount,
        hasGisMap: dest.hasGisMap,
      });
      setFormAttractionsText(dest.attractions.join('\n'));
      setFormFacilitiesText(dest.facilitiesAvailable.join('\n'));
      setFormSafetyText(dest.safetyEquipment.join('\n'));
      setFormActivitiesText(dest.tourismActivities.join('\n'));
      setFormPhotosText(dest.photos.join('\n'));
    } else {
      setEditingId(null);
      setFormData(initialForm);
      setFormAttractionsText(initialForm.attractions.join('\n'));
      setFormFacilitiesText(initialForm.facilitiesAvailable.join('\n'));
      setFormSafetyText(initialForm.safetyEquipment.join('\n'));
      setFormActivitiesText(initialForm.tourismActivities.join('\n'));
      setFormPhotosText(initialForm.photos.join('\n'));
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.siteName.trim()) return;

    const payload: Omit<TourismDestination, 'id'> = {
      ...formData,
      attractions: formAttractionsText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
      facilitiesAvailable: formFacilitiesText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
      safetyEquipment: formSafetyText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
      tourismActivities: formActivitiesText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
      photos: formPhotosText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
    };

    if (editingId) {
      updateDestination(editingId, payload);
    } else {
      addDestination(payload);
    }
    setIsFormOpen(false);
  };

  const handleOpenGIS = (siteId?: string) => {
    setSelectedSiteId(siteId);
    setGisModalOpen(true);
  };

  // Full CSV Export covering all 19 official docx fields
  const handleExportCSV = () => {
    const headers = [
      'Site ID',
      'Tourism Site Name',
      'Barangay',
      'GPS Coordinates',
      'Latitude',
      'Longitude',
      'Elevation',
      'Accessibility',
      'Distance from Mun Hall (km)',
      'Travel Time (mins)',
      'Tourism Classification',
      'Attractions',
      'Facilities Available',
      'Safety Equipment',
      'Tourism Activities',
      'Daily Carrying Capacity',
      'Current Visitors Today',
      'Load Factor (%)',
      'Entrance Fee (PHP)',
      'Contact Person',
      'Contact Number',
      'Status',
      'Drone Images Count',
    ];

    const rows = filtered.map((d) => {
      const load = Math.round((d.currentVisitorsToday / (d.carryingCapacityDaily || 1)) * 100);
      return [
        `"${d.id}"`,
        `"${d.siteName.replace(/"/g, '""')}"`,
        `"${d.barangay.replace(/"/g, '""')}"`,
        `"${d.gpsCoordinates}"`,
        d.lat,
        d.lng,
        `"${d.elevation.replace(/"/g, '""')}"`,
        `"${d.accessibility.replace(/"/g, '""')}"`,
        d.distanceFromMunicipalHallKm,
        d.travelTimeMinutes,
        `"${d.classification.replace(/"/g, '""')}"`,
        `"${d.attractions.join('; ').replace(/"/g, '""')}"`,
        `"${d.facilitiesAvailable.join('; ').replace(/"/g, '""')}"`,
        `"${d.safetyEquipment.join('; ').replace(/"/g, '""')}"`,
        `"${d.tourismActivities.join('; ').replace(/"/g, '""')}"`,
        d.carryingCapacityDaily,
        d.currentVisitorsToday,
        `${load}%`,
        d.entranceFee,
        `"${d.contactPerson.replace(/"/g, '""')}"`,
        `"${d.contactNumber.replace(/"/g, '""')}"`,
        `"${d.status.replace(/"/g, '""')}"`,
        d.droneImagesCount || 0,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Tourism_Destinations_Master_Inventory_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Mountain className="w-4 h-4" />
            <span>MODULE E • Tourism Destination Database & Geo-Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Tourism Destination Registry (TDR)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official municipal repository for tourism spots, carrying capacity telemetry, road logistics, drone photogrammetry, and Leaflet GIS mapping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenGIS()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-100 shadow-xs transition-colors"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Open Interactive GIS Map</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-medium hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Master CSV</span>
          </button>
          {!isReadOnly && (
            <button
              onClick={() => handleOpenForm()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register Destination</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Registered Eco-Sites</span>
            <Mountain className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalDestinations} Destinations</div>
          <div className="text-xs text-indigo-600 font-medium mt-1">Across 31 Barangays of Malungon</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Carrying Capacity</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalDailyCapacity.toLocaleString()} Pax/Day</div>
          <div className="text-xs text-slate-500 mt-1">Sustainable threshold cap</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Current Visitors In-Site</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {totalVisitorsToday.toLocaleString()} <span className="text-xs font-normal text-slate-400">Pax</span>
          </div>
          <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
            overallLoadFactor > 85 ? 'text-rose-600' : overallLoadFactor > 60 ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            <span>{overallLoadFactor}% Overall Load Factor</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-normal">
              {overallLoadFactor > 85 ? 'Near Limit' : 'Sustainable'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Drone Scans & GIS</span>
            <Camera className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{totalDroneScans} Drone Scans</div>
          <div className="text-xs text-slate-500 mt-1">100% Geo-referenced photogrammetry</div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 px-4 rounded-t-xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'catalog'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Destinations Catalog</span>
            <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-indigo-100 text-indigo-800">
              {filtered.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('capacity')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'capacity'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Carrying Capacity & Ranger Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'logistics'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Geographic Logistics & Access</span>
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'facilities'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Facilities & Safety Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'gallery'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Drone Photogrammetry & Gallery</span>
          </button>
        </nav>

        {activeTab === 'catalog' && (
          <div className="flex items-center space-x-1 py-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Show as Visual Cards"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Show as Data Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search destination site, barangay, attractions, or activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Classification */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="ALL">All Classifications</option>
              <option value="Natural / Eco-tourism">Natural / Eco-tourism</option>
              <option value="Cultural & Heritage">Cultural & Heritage</option>
              <option value="Adventure & Sports">Adventure & Sports</option>
              <option value="Agri-tourism / Farm">Agri-tourism / Farm</option>
              <option value="Recreational / Leisure">Recreational / Leisure</option>
            </select>

            {/* Barangay */}
            <select
              value={filterBarangay}
              onChange={(e) => setFilterBarangay(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="ALL">All Barangays</option>
              {uniqueBarangays.map((b) => (
                <option key={b} value={b}>
                  Brgy. {b}
                </option>
              ))}
            </select>

            {/* Accessibility */}
            <select
              value={filterAccess}
              onChange={(e) => setFilterAccess(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="ALL">All Accessibility</option>
              <option value="All vehicles">All vehicles</option>
              <option value="4x4 Only / Mountain Road">4x4 Only / Mountain Road</option>
              <option value="Trek / Walking Only">Trek / Walking Only</option>
              <option value="Water Transport">Water Transport</option>
            </select>

            {/* Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open / Normal Operations">Open / Normal Operations</option>
              <option value="Regulated / Controlled">Regulated / Controlled</option>
              <option value="Weather Advisory / Restricted">Weather Advisory / Restricted</option>
              <option value="Closed for Rehabilitation">Closed for Rehabilitation</option>
            </select>

            {(searchTerm || filterClass !== 'ALL' || filterBarangay !== 'ALL' || filterAccess !== 'ALL' || filterStatus !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterClass('ALL');
                  setFilterBarangay('ALL');
                  setFilterAccess('ALL');
                  setFilterStatus('ALL');
                }}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: CATALOG (Visual Cards or Table View)                           */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
              <Mountain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No destinations found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or classification filters.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((dest) => {
                const capRatio = Math.round((dest.currentVisitorsToday / (dest.carryingCapacityDaily || 1)) * 100);
                return (
                  <div
                    key={dest.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                  >
                    {/* Photo Banner */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={dest.photos[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                        alt={dest.siteName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                        {dest.classification}
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs ${
                            dest.status.includes('Open')
                              ? 'bg-emerald-600 text-white'
                              : dest.status.includes('Regulated')
                              ? 'bg-amber-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {dest.status}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                        <Camera className="w-3 h-3 text-indigo-300" />
                        <span>{dest.droneImagesCount || 0} Drone Scans</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                            {dest.siteName}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>Barangay {dest.barangay}, Malungon</span>
                        </p>

                        {/* Distance, Time, and Accessibility */}
                        <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs grid grid-cols-2 gap-2 text-slate-600">
                          <div>
                            <span className="text-slate-400">Mun. Hall: </span>
                            <span className="font-bold text-slate-800">{dest.distanceFromMunicipalHallKm} km</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Travel Time: </span>
                            <span className="font-bold text-slate-800">{dest.travelTimeMinutes} mins</span>
                          </div>
                          <div className="col-span-2 flex items-center gap-1 text-[11px] truncate">
                            <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-500">Access:</span>
                            <span className="font-medium text-slate-700 truncate">{dest.accessibility}</span>
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="mt-3 text-xs text-slate-600 line-clamp-2">
                          <span className="font-semibold text-slate-800">Highlights: </span>
                          {dest.attractions.slice(0, 3).join(', ')}
                        </div>

                        {/* Activities Pills */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {dest.tourismActivities.slice(0, 3).map((act, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-medium border border-indigo-100"
                            >
                              {act}
                            </span>
                          ))}
                          {dest.tourismActivities.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                              +{dest.tourismActivities.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Live Visitor Meter */}
                        <div className="mt-3.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-700 font-medium flex items-center gap-1">
                              <Users className="w-3 h-3 text-indigo-600" />
                              Daily Capacity Load:
                            </span>
                            <span className="font-bold text-slate-900">
                              {dest.currentVisitorsToday} / {dest.carryingCapacityDaily} ({capRatio}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                capRatio > 85 ? 'bg-rose-500' : capRatio > 60 ? 'bg-amber-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${Math.min(100, capRatio)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Fees & Elevation */}
                        <div className="mt-2.5 text-xs text-slate-600 flex justify-between">
                          <span>Entrance Fee: <strong className="text-slate-800">₱{dest.entranceFee}</strong></span>
                          <span>Elevation: <strong className="text-slate-800">{dest.elevation}</strong></span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setDossierDestination(dest)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Dossier</span>
                          </button>
                          <button
                            onClick={() => handleOpenGIS(dest.id)}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>GIS Map</span>
                          </button>
                          <button
                            onClick={() => setQrDestination(dest)}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                            title="Generate QR Pass"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {!isReadOnly && (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleOpenForm(dest)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                              title="Edit Destination Data"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${dest.siteName}? This action cannot be undone.`)) {
                                  deleteDestination(dest.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Destination"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Destination Site</th>
                      <th className="px-4 py-3">Barangay</th>
                      <th className="px-4 py-3">Classification</th>
                      <th className="px-4 py-3">Elevation & GPS</th>
                      <th className="px-4 py-3">Distance / Time</th>
                      <th className="px-4 py-3">Carrying Capacity</th>
                      <th className="px-4 py-3">Entrance</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((dest) => {
                      const load = Math.round((dest.currentVisitorsToday / (dest.carryingCapacityDaily || 1)) * 100);
                      return (
                        <tr key={dest.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <img
                                src={dest.photos[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <div className="font-semibold text-slate-900">{dest.siteName}</div>
                                <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                                  {dest.attractions.slice(0, 2).join(', ')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">{dest.barangay}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                              {dest.classification}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-800">{dest.elevation}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{dest.gpsCoordinates}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div>{dest.distanceFromMunicipalHallKm} km from Hall</div>
                            <div className="text-slate-400 text-[11px]">~{dest.travelTimeMinutes} mins ({dest.accessibility})</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">
                              {dest.currentVisitorsToday} / {dest.carryingCapacityDaily} pax
                            </div>
                            <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  load > 85 ? 'bg-rose-500' : load > 60 ? 'bg-amber-500' : 'bg-indigo-600'
                                }`}
                                style={{ width: `${Math.min(100, load)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">₱{dest.entranceFee}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                dest.status.includes('Open')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : dest.status.includes('Regulated')
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {dest.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => setDossierDestination(dest)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                                title="View Dossier"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenGIS(dest.id)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
                                title="Open GIS Map"
                              >
                                <Compass className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setQrDestination(dest)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                                title="QR Code"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                              {!isReadOnly && (
                                <>
                                  <button
                                    onClick={() => handleOpenForm(dest)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Delete ${dest.siteName}?`)) {
                                        deleteDestination(dest.id);
                                      }
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: CARRYING CAPACITY & RANGER TELEMETRY                           */}
      {/* ========================================================================= */}
      {activeTab === 'capacity' && (
        <div className="space-y-6">
          {/* Instructions and status banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-900">
              <div className="font-semibold text-sm">Real-time Carrying Capacity & Field Ranger Headcount Telemetry</div>
              <p className="mt-0.5 text-amber-800">
                Tourism officers and stationed site rangers adjust visitor loads in real-time to prevent ecological degradation under Philippine Republic Act 9593 and Municipal Environmental Ordinances. Headcount adjustments immediately synchronize with the Executive Dashboard.
              </p>
            </div>
          </div>

          {/* Cards for each destination with live capacity controller */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((dest) => {
              const load = Math.round((dest.currentVisitorsToday / (dest.carryingCapacityDaily || 1)) * 100);
              const isOver = load > 100;
              const isWarning = load > 80;

              return (
                <div key={dest.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={dest.photos[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{dest.siteName}</h4>
                        <p className="text-xs text-slate-500">Brgy. {dest.barangay} • {dest.classification}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isOver
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isOver ? 'CRITICAL EXCEEDED' : isWarning ? 'NEAR LIMIT' : 'NORMAL LOAD'}
                    </span>
                  </div>

                  {/* Progress Bar & Telemetry Gauge */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-600">Current In-Site Headcount</span>
                      <span className="font-bold text-slate-900">
                        {dest.currentVisitorsToday} / {dest.carryingCapacityDaily} Pax ({load}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver ? 'bg-rose-600' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, load)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Field Ranger Headcount Adjuster */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-500">Ranger Controls:</span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleAdjustVisitors(dest.id, -10)}
                        disabled={isReadOnly || dest.currentVisitorsToday <= 0}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors disabled:opacity-40"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleAdjustVisitors(dest.id, -5)}
                        disabled={isReadOnly || dest.currentVisitorsToday <= 0}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors disabled:opacity-40"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleAdjustVisitors(dest.id, 5)}
                        disabled={isReadOnly}
                        className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded border border-indigo-200 transition-colors disabled:opacity-40"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleAdjustVisitors(dest.id, 10)}
                        disabled={isReadOnly}
                        className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded border border-indigo-200 transition-colors disabled:opacity-40"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleResetVisitors(dest.id)}
                        disabled={isReadOnly || dest.currentVisitorsToday === 0}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded border border-rose-200 transition-colors disabled:opacity-40"
                        title="Reset headcount to 0 for end-of-day clearance"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Safety & Contact Footnote */}
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>Lead Ranger: <strong>{dest.contactPerson}</strong></span>
                    <span>Fee: <strong>₱{dest.entranceFee}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: GEOGRAPHIC LOGISTICS & ROAD ACCESS                             */}
      {/* ========================================================================= */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <Compass className="w-4 h-4" />
              <h3 className="font-bold text-slate-900 text-sm">Municipal Hall Transit & Terrain Logistics Matrix</h3>
            </div>
            <p className="text-xs text-slate-500">
              Reference dispatch distances and access categories benchmarked from the Malungon Municipal Hall Command Center (Poblacion).
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase">Closest Destination</div>
                <div className="text-lg font-bold text-slate-900 mt-1">
                  {destinations.reduce((prev, curr) => (prev.distanceFromMunicipalHallKm < curr.distanceFromMunicipalHallKm ? prev : curr)).siteName}
                </div>
                <div className="text-xs text-indigo-600 font-medium mt-0.5">
                  {Math.min(...destinations.map((d) => d.distanceFromMunicipalHallKm))} km from Municipal Hall
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase">Highest Elevation Point</div>
                <div className="text-lg font-bold text-slate-900 mt-1">Kalon Barak Skyline Ridge</div>
                <div className="text-xs text-indigo-600 font-medium mt-0.5">780 to 850 Meters Above Sea Level (MASL)</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase">Average Travel Time</div>
                <div className="text-lg font-bold text-slate-900 mt-1">
                  {Math.round(destinations.reduce((acc, d) => acc + d.travelTimeMinutes, 0) / (destinations.length || 1))} Mins
                </div>
                <div className="text-xs text-slate-500 mt-0.5">From Poblacion Town Center</div>
              </div>
            </div>
          </div>

          {/* Logistics Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Site Name</th>
                    <th className="px-4 py-3">Barangay</th>
                    <th className="px-4 py-3">GPS Coordinates</th>
                    <th className="px-4 py-3">Elevation (MASL)</th>
                    <th className="px-4 py-3">Road Accessibility</th>
                    <th className="px-4 py-3">Distance</th>
                    <th className="px-4 py-3">Travel Time</th>
                    <th className="px-4 py-3 text-right">Route Map</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((dest) => (
                    <tr key={dest.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">{dest.siteName}</td>
                      <td className="px-4 py-3 text-slate-700">{dest.barangay}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-indigo-600">{dest.gpsCoordinates}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{dest.elevation}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          dest.accessibility.includes('All')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : dest.accessibility.includes('4x4')
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {dest.accessibility}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{dest.distanceFromMunicipalHallKm} km</td>
                      <td className="px-4 py-3 text-slate-600">{dest.travelTimeMinutes} mins</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenGIS(dest.id)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>View Route</span>
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

      {/* ========================================================================= */}
      {/* SUB-TAB 4: FACILITIES, SAFETY EQUIPMENT & ACTIVITIES                      */}
      {/* ========================================================================= */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest) => (
              <div key={dest.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{dest.siteName}</h4>
                    <span className="text-[10px] text-slate-400">Brgy. {dest.barangay}</span>
                  </div>

                  {/* Facilities Section */}
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Facilities Available ({dest.facilitiesAvailable.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dest.facilitiesAvailable.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Safety Equipment Section */}
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mb-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Safety Equipment & Readiness</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dest.safetyEquipment.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Activities Section */}
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-sky-700 flex items-center gap-1 mb-1.5">
                      <Activity className="w-3.5 h-3.5 text-sky-600" />
                      <span>Permitted Tourism Activities</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dest.tourismActivities.map((act, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[10px] font-medium border border-sky-200">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Contact: {dest.contactPerson}</span>
                  <button
                    onClick={() => setDossierDestination(dest)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: DRONE PHOTOGRAMMETRY & PHOTO GALLERY                           */}
      {/* ========================================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
                <Camera className="w-4 h-4" />
                <span>Aerial Photogrammetry & Orthomosaic Media Assets</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">High-Resolution Visual Assets & Drone Imagery</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-perspective aerial scans capturing topological elevations, ridge viewpoints, and eco-trail canopy.
              </p>
            </div>
            <div className="px-4 py-2 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold text-center">
              {totalDroneScans} Drone Scans Archived
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest) => (
              <div key={dest.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group">
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={dest.photos[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                    alt={dest.siteName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() =>
                      setInspectPhoto({
                        url: dest.photos[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
                        title: dest.siteName,
                        subtitle: `Barangay ${dest.barangay} • ${dest.elevation}`,
                      })
                    }
                  />
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <Camera className="w-3 h-3 text-indigo-300" />
                    <span>{dest.droneImagesCount || 0} Aerial Scans</span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                    {dest.gpsCoordinates}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{dest.siteName}</h4>
                  <p className="text-xs text-slate-500">Barangay {dest.barangay} • {dest.classification}</p>
                  
                  {/* Photo Thumbnails */}
                  <div className="flex gap-2 pt-2 overflow-x-auto">
                    {dest.photos.map((photoUrl, idx) => (
                      <img
                        key={idx}
                        src={photoUrl}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                        onClick={() =>
                          setInspectPhoto({
                            url: photoUrl,
                            title: `${dest.siteName} (Asset #${idx + 1})`,
                            subtitle: `Barangay ${dest.barangay} • Elevation: ${dest.elevation}`,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT DESTINATION                                           */}
      {/* ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">
                  {editingId ? 'Edit Tourism Destination Record' : 'Register New Tourism Destination'}
                </h3>
                <p className="text-xs text-slate-400">Section E • Official Tourism Destination Database Architecture</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Site Name & Barangay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tourism Site Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kalon Barak Skyline Ridge"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Barangay Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Poblacion, Alkikan, etc."
                    value={formData.barangay}
                    onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Classification & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tourism Classification *</label>
                  <select
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value as DestinationClassification })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Natural / Eco-tourism">Natural / Eco-tourism</option>
                    <option value="Cultural & Heritage">Cultural & Heritage</option>
                    <option value="Adventure & Sports">Adventure & Sports</option>
                    <option value="Agri-tourism / Farm">Agri-tourism / Farm</option>
                    <option value="Recreational / Leisure">Recreational / Leisure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Open / Normal Operations">Open / Normal Operations</option>
                    <option value="Regulated / Controlled">Regulated / Controlled</option>
                    <option value="Weather Advisory / Restricted">Weather Advisory / Restricted</option>
                    <option value="Closed for Rehabilitation">Closed for Rehabilitation</option>
                  </select>
                </div>
              </div>

              {/* GPS Coordinates & Elevation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GPS Coordinates String</label>
                  <input
                    type="text"
                    value={formData.gpsCoordinates}
                    onChange={(e) => setFormData({ ...formData, gpsCoordinates: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                    placeholder="6.2714° N, 125.2638° E"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude (Decimal)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude (Decimal)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Elevation, Accessibility, Distance & Travel Time */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Elevation (MASL)</label>
                  <input
                    type="text"
                    value={formData.elevation}
                    onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
                    placeholder="e.g. 780m MASL"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Accessibility Mode</label>
                  <select
                    value={formData.accessibility}
                    onChange={(e) => setFormData({ ...formData, accessibility: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="All vehicles">All vehicles</option>
                    <option value="4x4 Only / Mountain Road">4x4 Only / Mountain Road</option>
                    <option value="Trek / Walking Only">Trek / Walking Only</option>
                    <option value="Water Transport">Water Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Distance from Mun Hall (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.distanceFromMunicipalHallKm}
                    onChange={(e) => setFormData({ ...formData, distanceFromMunicipalHallKm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Time (Mins)</label>
                  <input
                    type="number"
                    value={formData.travelTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, travelTimeMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Carrying Capacity, Current Visitors, Entrance Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Carrying Capacity (Pax) *</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.carryingCapacityDaily}
                    onChange={(e) => setFormData({ ...formData, carryingCapacityDaily: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Visitors Today</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.currentVisitorsToday}
                    onChange={(e) => setFormData({ ...formData, currentVisitorsToday: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Entrance Fee (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.entranceFee}
                    onChange={(e) => setFormData({ ...formData, entranceFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Contact Person & Contact Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Site Coordinator / Ranger Lead</label>
                  <input
                    type="text"
                    placeholder="e.g. Dennis Cabigon"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +63 917 123 4567"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Multi-Item Textareas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Key Attractions (one per line)</label>
                  <textarea
                    rows={3}
                    value={formAttractionsText}
                    onChange={(e) => setFormAttractionsText(e.target.value)}
                    placeholder="Panoramic view&#10;Sea of clouds&#10;Highland coffee deck"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Facilities Available (one per line)</label>
                  <textarea
                    rows={3}
                    value={formFacilitiesText}
                    onChange={(e) => setFormFacilitiesText(e.target.value)}
                    placeholder="Clean Restrooms&#10;View Deck&#10;Camping Grounds&#10;Cafe"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Safety Equipment (one per line)</label>
                  <textarea
                    rows={3}
                    value={formSafetyText}
                    onChange={(e) => setFormSafetyText(e.target.value)}
                    placeholder="First Aid Station&#10;Emergency Radio&#10;Tourism Police Post"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tourism Activities (one per line)</label>
                  <textarea
                    rows={3}
                    value={formActivitiesText}
                    onChange={(e) => setFormActivitiesText(e.target.value)}
                    placeholder="Sightseeing&#10;Camping&#10;Photography&#10;Hiking"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Photos & Drone scans */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Photo URLs (one per line)</label>
                  <textarea
                    rows={2}
                    value={formPhotosText}
                    onChange={(e) => setFormPhotosText(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Drone Scans Count</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.droneImagesCount}
                    onChange={(e) => setFormData({ ...formData, droneImagesCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DESTINATION DOSSIER / PROFILE SHEET                              */}
      {/* ========================================================================= */}
      {dossierDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Header with image */}
            <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
              <img
                src={dossierDestination.photos[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

              <button
                onClick={() => setDossierDestination(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-1.5 backdrop-blur-xs transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                      {dossierDestination.classification}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-600 text-white">
                      {dossierDestination.status}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">{dossierDestination.siteName}</h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Barangay {dossierDestination.barangay}, Municipality of Malungon, Sarangani</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const dest = dossierDestination;
                      setDossierDestination(null);
                      handleOpenGIS(dest.id);
                    }}
                    className="px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Launch GIS Map</span>
                  </button>
                  <button
                    onClick={() => {
                      setFactsheetDestination(dossierDestination);
                    }}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Factsheet</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dossier Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Elevation</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{dossierDestination.elevation}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">From Mun. Hall</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{dossierDestination.distanceFromMunicipalHallKm} km (~{dossierDestination.travelTimeMinutes}m)</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Daily Capacity</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{dossierDestination.carryingCapacityDaily} Visitors</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Entrance Fee</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">₱{dossierDestination.entranceFee} / Pax</div>
                </div>
              </div>

              {/* Carrying Capacity Telemetry */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Environmental Carrying Capacity Telemetry
                  </span>
                  <span className="font-bold text-slate-900">
                    {dossierDestination.currentVisitorsToday} / {dossierDestination.carryingCapacityDaily} Pax (
                    {Math.round((dossierDestination.currentVisitorsToday / (dossierDestination.carryingCapacityDaily || 1)) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((dossierDestination.currentVisitorsToday / (dossierDestination.carryingCapacityDaily || 1)) * 100)
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Attractions & Activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Attractions & Features</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {dossierDestination.attractions.map((att, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{att}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Permitted Tourism Activities</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dossierDestination.tourismActivities.map((act, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Facilities & Safety Equipment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Facilities & Visitor Infrastructure</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dossierDestination.facilitiesAvailable.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Safety Equipment & Disaster Preparedness</h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {dossierDestination.safetyEquipment.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Geographic Logistics & Personnel */}
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-700 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-900">Geographic & Logistics Details:</div>
                  <div className="mt-1 space-y-0.5 text-slate-600">
                    <div>GPS Datum: <span className="font-mono text-indigo-700">{dossierDestination.gpsCoordinates}</span> (Lat: {dossierDestination.lat}, Lng: {dossierDestination.lng})</div>
                    <div>Road Accessibility: <strong>{dossierDestination.accessibility}</strong></div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">On-Site Management:</div>
                  <div className="mt-1 space-y-0.5 text-slate-600">
                    <div>Coordinator: <strong>{dossierDestination.contactPerson}</strong></div>
                    <div>Hotline: <strong>{dossierDestination.contactNumber}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: OFFICIAL PRINTABLE DESTINATION FACTSHEET                         */}
      {/* ========================================================================= */}
      {factsheetDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2 text-xs">
                <Printer className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Official LGU Tourism Destination Factsheet</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Print Document
                </button>
                <button
                  onClick={() => setFactsheetDestination(null)}
                  className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Paper Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 space-y-6">
              {/* Official Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="text-[11px] uppercase tracking-widest text-slate-600 font-serif">Republic of the Philippines</div>
                <div className="text-xs font-serif text-slate-700">Province of Sarangani • Municipality of Malungon</div>
                <div className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-1">
                  OFFICE OF THE MUNICIPAL TOURISM OFFICER
                </div>
                <div className="text-[10px] text-slate-500 font-serif italic mt-0.5">
                  Eco-Tourism Destination Master Inventory • DOT-Region XII Accredited Repository
                </div>
              </div>

              {/* Document Title */}
              <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                <div>
                  <h2 className="text-xl font-black uppercase text-slate-900">{factsheetDestination.siteName}</h2>
                  <div className="text-xs text-slate-600">Barangay {factsheetDestination.barangay}, Malungon, Sarangani</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-[10px] text-slate-400">CONTROL NO:</div>
                  <div className="font-mono font-bold text-slate-800">TDR-{factsheetDestination.id.toUpperCase()}</div>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600 w-1/3">Tourism Classification</td>
                    <td className="px-3 py-2 font-bold text-slate-900">{factsheetDestination.classification}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">GPS Coordinates</td>
                    <td className="px-3 py-2 font-mono">{factsheetDestination.gpsCoordinates} (Lat: {factsheetDestination.lat}, Lng: {factsheetDestination.lng})</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Elevation</td>
                    <td className="px-3 py-2 font-bold">{factsheetDestination.elevation}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Road Accessibility</td>
                    <td className="px-3 py-2">{factsheetDestination.accessibility}</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Distance / Travel Time</td>
                    <td className="px-3 py-2">{factsheetDestination.distanceFromMunicipalHallKm} km (~{factsheetDestination.travelTimeMinutes} mins from Municipal Hall)</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Daily Carrying Capacity Limit</td>
                    <td className="px-3 py-2 font-bold text-emerald-800">{factsheetDestination.carryingCapacityDaily} Pax / Day</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Standard Entrance Fee</td>
                    <td className="px-3 py-2 font-bold">₱{factsheetDestination.entranceFee}.00</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">On-Site Coordinator</td>
                    <td className="px-3 py-2">{factsheetDestination.contactPerson} ({factsheetDestination.contactNumber})</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold text-slate-600">Current Regulatory Status</td>
                    <td className="px-3 py-2 font-bold text-indigo-800">{factsheetDestination.status}</td>
                  </tr>
                </tbody>
              </table>

              {/* Features & Safety */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 border border-slate-200 rounded">
                  <div className="font-bold text-slate-800 mb-1">Key Attractions:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    {factsheetDestination.attractions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 border border-slate-200 rounded">
                  <div className="font-bold text-slate-800 mb-1">Safety Equipment Verified:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    {factsheetDestination.safetyEquipment.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-b border-slate-800 w-48 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">CRISTINA D. CONSTANTINO-LA PAZ</div>
                  <div className="text-[10px] text-slate-500">Municipal Tourism Action Officer-Designate</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-48 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">HON. REYNALDO F. CONSTANTINO</div>
                  <div className="text-[10px] text-slate-500">Municipal Mayor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: PHOTO INSPECTION MODAL                                           */}
      {/* ========================================================================= */}
      {inspectPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-white mb-2">
              <div>
                <h4 className="font-bold text-base">{inspectPhoto.title}</h4>
                <p className="text-xs text-slate-400">{inspectPhoto.subtitle}</p>
              </div>
              <button
                onClick={() => setInspectPhoto(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={inspectPhoto.url}
              alt=""
              className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl border border-slate-800"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: QR CODE SITE PASS                                                */}
      {/* ========================================================================= */}
      {qrDestination && (
        <QRCodeModal
          isOpen={true}
          onClose={() => setQrDestination(null)}
          title={`Tourism Site Pass: ${qrDestination.siteName}`}
          subtitle={`Barangay ${qrDestination.barangay} • MTO Malungon Official Geo-Marker`}
          codeData={`MTODMS-DEST-${qrDestination.id}-${qrDestination.gpsCoordinates}`}
          entityType="destination"
          extraDetails={[
            { label: 'Site Name', value: qrDestination.siteName },
            { label: 'Barangay', value: qrDestination.barangay },
            { label: 'Classification', value: qrDestination.classification },
            { label: 'Elevation', value: qrDestination.elevation },
            { label: 'Carrying Capacity', value: `${qrDestination.carryingCapacityDaily} Pax/Day` },
            { label: 'Coordinator', value: qrDestination.contactPerson },
          ]}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: LEAFLET INTERACTIVE GIS MAP MODAL                                */}
      {/* ========================================================================= */}
      <GISMapModal
        isOpen={gisModalOpen}
        onClose={() => setGisModalOpen(false)}
        selectedDestinationId={selectedSiteId}
      />
    </div>
  );
};
