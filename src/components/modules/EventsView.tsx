import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Download,
  MapPin,
  Users,
  Coins,
  DollarSign,
  Award,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  FileCheck,
  Star,
  Sparkles,
  Eye,
  Printer,
  X,
  Filter,
  Grid,
  Table as TableIcon,
  Check,
  ChevronRight,
  BarChart3,
  AlertCircle,
  FileText,
  Share2,
  ExternalLink,
  ThumbsUp,
  Layers,
  TrendingUp,
  ShieldCheck,
  Building2,
  Mic,
  Gift,
  HelpCircle,
  Camera
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import { TourismEvent } from '../../types';

type SubTab = 'calendar' | 'logistics' | 'evaluation' | 'financial';

export const EventsView: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, isReadOnly } = useTourism();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<SubTab>('calendar');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterFinancial, setFilterFinancial] = useState('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dossierEvent, setDossierEvent] = useState<TourismEvent | null>(null);
  const [printableEvent, setPrintableEvent] = useState<TourismEvent | null>(null);
  const [inspectPhoto, setInspectPhoto] = useState<{ url: string; title: string } | null>(null);

  // Form Initial State (All 14 docx fields)
  const initialForm: Omit<TourismEvent, 'id'> = {
    eventName: '',
    date: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    venue: 'Malungon Municipal Sunken Arena',
    organizer: 'Municipal Tourism Office & LGU Malungon',
    budget: 500000,
    actualExpense: 0,
    participantsExpected: 3000,
    attendanceActual: 0,
    sponsors: ['Provincial Government of Sarangani', 'DOT Region XII', 'LGU Malungon'],
    guests: ['Municipal Mayor', 'Sangguniang Bayan Members', 'Tribal Chieftains'],
    performers: ['Lamlifew Cultural Troupe', 'Malungon Youth Symphonic Band'],
    programFlow: '08:00 AM Opening Ceremony • 10:00 AM Cultural Exhibits • 02:00 PM Competitions • 06:00 PM Awarding & Cultural Gala',
    documentationUrls: [
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
    ],
    evaluationRating: 4.8,
    financialReportStatus: 'Pending Submission',
    status: 'Upcoming',
  };

  const [formData, setFormData] = useState(initialForm);
  // Multi-item text states
  const [formSponsorsText, setFormSponsorsText] = useState('');
  const [formGuestsText, setFormGuestsText] = useState('');
  const [formPerformersText, setFormPerformersText] = useState('');
  const [formDocsText, setFormDocsText] = useState('');

  // Filtered events
  const filtered = events.filter((ev) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      ev.eventName.toLowerCase().includes(term) ||
      ev.venue.toLowerCase().includes(term) ||
      ev.organizer.toLowerCase().includes(term) ||
      ev.sponsors.some((s) => s.toLowerCase().includes(term)) ||
      ev.guests.some((g) => g.toLowerCase().includes(term));

    const matchesStatus = filterStatus === 'ALL' || ev.status === filterStatus;
    const matchesFinancial = filterFinancial === 'ALL' || ev.financialReportStatus === filterFinancial;

    return matchesSearch && matchesStatus && matchesFinancial;
  });

  // Aggregated KPIs
  const totalEvents = events.length;
  const upcomingCount = events.filter((e) => e.status === 'Upcoming').length;
  const ongoingCount = events.filter((e) => e.status === 'Ongoing').length;
  const completedCount = events.filter((e) => e.status === 'Completed').length;
  const totalBudget = events.reduce((sum, e) => sum + e.budget, 0);
  const totalActualExpense = events.reduce((sum, e) => sum + (e.actualExpense || 0), 0);
  const totalExpectedParticipants = events.reduce((sum, e) => sum + e.participantsExpected, 0);
  const totalActualAttendance = events.reduce((sum, e) => sum + (e.attendanceActual || 0), 0);
  const averageRating = (
    events.reduce((sum, e) => sum + (e.evaluationRating || 0), 0) / (events.length || 1)
  ).toFixed(1);

  // Recharts financial comparison data
  const financialChartData = events.map((e) => ({
    name: e.eventName.length > 18 ? e.eventName.substring(0, 18) + '...' : e.eventName,
    Budget: e.budget / 1000,
    Actual: (e.actualExpense || 0) / 1000,
  }));

  // Open Form
  const handleOpenForm = (ev?: TourismEvent) => {
    if (ev) {
      setEditingId(ev.id);
      setFormData({
        eventName: ev.eventName,
        date: ev.date,
        endDate: ev.endDate || ev.date,
        venue: ev.venue,
        organizer: ev.organizer,
        budget: ev.budget,
        actualExpense: ev.actualExpense,
        participantsExpected: ev.participantsExpected,
        attendanceActual: ev.attendanceActual,
        sponsors: ev.sponsors,
        guests: ev.guests,
        performers: ev.performers,
        programFlow: ev.programFlow,
        documentationUrls: ev.documentationUrls,
        evaluationRating: ev.evaluationRating,
        financialReportStatus: ev.financialReportStatus,
        status: ev.status,
      });
      setFormSponsorsText(ev.sponsors.join('\n'));
      setFormGuestsText(ev.guests.join('\n'));
      setFormPerformersText(ev.performers.join('\n'));
      setFormDocsText(ev.documentationUrls.join('\n'));
    } else {
      setEditingId(null);
      setFormData(initialForm);
      setFormSponsorsText(initialForm.sponsors.join('\n'));
      setFormGuestsText(initialForm.guests.join('\n'));
      setFormPerformersText(initialForm.performers.join('\n'));
      setFormDocsText(initialForm.documentationUrls.join('\n'));
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventName.trim()) return;

    const payload: Omit<TourismEvent, 'id'> = {
      ...formData,
      sponsors: formSponsorsText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
      guests: formGuestsText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
      performers: formPerformersText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
      documentationUrls: formDocsText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
    };

    if (editingId) {
      updateEvent(editingId, payload);
    } else {
      addEvent(payload);
    }
    setIsFormOpen(false);
  };

  // Full CSV Export covering all 14 official docx fields
  const handleExportCSV = () => {
    const headers = [
      'Event ID',
      'Event Name',
      'Start Date',
      'End Date',
      'Venue',
      'Organizer',
      'Appropriated Budget (PHP)',
      'Actual Expense (PHP)',
      'Budget Variance (PHP)',
      'Participants Expected',
      'Attendance Actual',
      'Turnout Percentage (%)',
      'Sponsors',
      'Guests / VIPs',
      'Performers',
      'Program Flow Summary',
      'Event Status',
      'Evaluation Rating (1-5)',
      'Financial Liquidation Status',
    ];

    const rows = filtered.map((e) => {
      const turnout = e.participantsExpected > 0
        ? Math.round(((e.attendanceActual || 0) / e.participantsExpected) * 100)
        : 0;
      const variance = e.budget - (e.actualExpense || 0);

      return [
        `"${e.id}"`,
        `"${e.eventName.replace(/"/g, '""')}"`,
        `"${e.date}"`,
        `"${e.endDate || e.date}"`,
        `"${e.venue.replace(/"/g, '""')}"`,
        `"${e.organizer.replace(/"/g, '""')}"`,
        e.budget,
        e.actualExpense || 0,
        variance,
        e.participantsExpected,
        e.attendanceActual || 0,
        `${turnout}%`,
        `"${e.sponsors.join('; ').replace(/"/g, '""')}"`,
        `"${e.guests.join('; ').replace(/"/g, '""')}"`,
        `"${e.performers.join('; ').replace(/"/g, '""')}"`,
        `"${e.programFlow.replace(/"/g, '""')}"`,
        `"${e.status}"`,
        e.evaluationRating,
        `"${e.financialReportStatus}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Municipal_Tourism_Events_Master_Calendar_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>MODULE F • Events Management System & Municipal Festivals</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Events Management System (EMS)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official municipal event registry, program planning, VIP logistics, attendee turnout, evaluations, and COA financial liquidation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Calendar CSV</span>
          </button>
          {!isReadOnly && (
            <button
              onClick={() => handleOpenForm()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Program New Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Programmed Events</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalEvents} Events</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            {upcomingCount} Upcoming • {ongoingCount} Ongoing
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Turnout & Inflow</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {totalActualAttendance.toLocaleString()} <span className="text-xs font-normal text-slate-400">Pax</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Expected: {totalExpectedParticipants.toLocaleString()} Pax
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Appropriated Budget</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ₱{(totalBudget / 1000000).toFixed(2)}M
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Actual Disbursed: ₱{(totalActualExpense / 1000000).toFixed(2)}M
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Average Satisfaction</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{averageRating} / 5.0</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">Participant feedback rating</div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 px-4 rounded-t-xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'calendar'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events Calendar & Roster</span>
            <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800">
              {filtered.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'logistics'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Logistics, VIP Guests & Program Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'evaluation'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Post-Event Turnout & Evaluation</span>
          </button>

          <button
            onClick={() => setActiveTab('financial')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'financial'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Financials & COA Liquidation</span>
          </button>
        </nav>

        {activeTab === 'calendar' && (
          <div className="flex items-center space-x-1 py-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Show as Event Cards"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
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
              placeholder="Search event title, venue, organizer, VIP guests, or sponsors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="ALL">All Event Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={filterFinancial}
              onChange={(e) => setFilterFinancial(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="ALL">All Liquidation Statuses</option>
              <option value="Approved & Liquidated">Approved & Liquidated</option>
              <option value="Under Audit">Under Audit</option>
              <option value="Pending Submission">Pending Submission</option>
            </select>

            {(searchTerm || filterStatus !== 'ALL' || filterFinancial !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('ALL');
                  setFilterFinancial('ALL');
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
      {/* SUB-TAB 1: CALENDAR & ROSTER (Cards or Table)                             */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No tourism events found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or filter status.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-4">
              {filtered.map((ev) => {
                const turnoutPercent = ev.participantsExpected > 0
                  ? Math.round(((ev.attendanceActual || 0) / ev.participantsExpected) * 100)
                  : 0;

                return (
                  <div
                    key={ev.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-emerald-500 transition-all flex flex-col lg:flex-row gap-5"
                  >
                    {/* Date Block */}
                    <div className="w-full lg:w-36 shrink-0 flex lg:flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-center">
                      <Calendar className="w-6 h-6 text-emerald-700 mb-1" />
                      <div className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                        {new Date(ev.date).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="text-3xl font-black text-emerald-950 leading-tight">
                        {ev.date.substring(8, 10)}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                        {ev.endDate && ev.endDate !== ev.date
                          ? `to ${new Date(ev.endDate).toLocaleString('default', { month: 'short' })} ${ev.endDate.substring(8, 10)}`
                          : new Date(ev.date).getFullYear()}
                      </div>
                    </div>

                    {/* Main Event Body */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-base hover:text-emerald-700 transition-colors cursor-pointer"
                              onClick={() => setDossierEvent(ev)}>
                            {ev.eventName}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ev.status === 'Upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : ev.status === 'Ongoing'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ev.status === 'Completed'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {ev.status}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                            <span className="font-bold text-slate-800">{ev.evaluationRating}</span>
                            <span>/ 5.0</span>
                          </div>
                        </div>
                      </div>

                      {/* Venue, Expected vs Actual, Budget */}
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-800">{ev.venue}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {ev.attendanceActual > 0
                              ? `${ev.attendanceActual.toLocaleString()} Actual Pax (${turnoutPercent}%)`
                              : `${ev.participantsExpected.toLocaleString()} Expected Pax`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                          <span>Budget: <strong>₱{ev.budget.toLocaleString()}</strong></span>
                          {ev.actualExpense > 0 && (
                            <span className="text-emerald-700 font-semibold">
                              (Actual: ₱{ev.actualExpense.toLocaleString()})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Program Flow Preview */}
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-1">
                        <div className="line-clamp-2">
                          <span className="font-semibold text-slate-900">Program Flow: </span>
                          {ev.programFlow}
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap gap-4 pt-1">
                          <span>Organizer: <strong>{ev.organizer}</strong></span>
                          <span>Sponsors: <strong>{ev.sponsors.slice(0, 3).join(', ')}</strong></span>
                        </div>
                      </div>

                      {/* Liquidation Status & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-slate-500">Liquidation:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            ev.financialReportStatus.includes('Approved')
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.financialReportStatus.includes('Audit')
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {ev.financialReportStatus}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setDossierEvent(ev)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Event Brief</span>
                          </button>
                          <button
                            onClick={() => setPrintableEvent(ev)}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Report</span>
                          </button>
                          {!isReadOnly && (
                            <>
                              <button
                                onClick={() => handleOpenForm(ev)}
                                className="p-1.5 text-slate-400 hover:text-blue-700 rounded hover:bg-slate-100"
                                title="Edit Event"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete ${ev.eventName}?`)) {
                                    deleteEvent(ev.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-700 rounded hover:bg-slate-100"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
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
                      <th className="px-4 py-3">Event Name & Date</th>
                      <th className="px-4 py-3">Venue</th>
                      <th className="px-4 py-3">Organizer</th>
                      <th className="px-4 py-3">Budget & Expense</th>
                      <th className="px-4 py-3">Turnout (Pax)</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Liquidation</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{ev.eventName}</div>
                          <div className="text-[11px] text-emerald-700 font-medium">{ev.date} to {ev.endDate || ev.date}</div>
                        </td>
                        <td className="px-4 py-3">{ev.venue}</td>
                        <td className="px-4 py-3 text-slate-600">{ev.organizer}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">₱{ev.budget.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-500">Act: ₱{(ev.actualExpense || 0).toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">
                            {ev.attendanceActual > 0 ? ev.attendanceActual.toLocaleString() : '-'}
                          </div>
                          <div className="text-[10px] text-slate-500">Exp: {ev.participantsExpected.toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ev.status === 'Upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : ev.status === 'Ongoing'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {ev.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            ev.financialReportStatus.includes('Approved')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {ev.financialReportStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => setDossierEvent(ev)}
                              className="p-1.5 text-slate-400 hover:text-emerald-700 rounded hover:bg-slate-100"
                              title="Event Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setPrintableEvent(ev)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                              title="Print Brief"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleOpenForm(ev)}
                                  className="p-1.5 text-slate-400 hover:text-blue-700 rounded hover:bg-slate-100"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete ${ev.eventName}?`)) {
                                      deleteEvent(ev.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-rose-700 rounded hover:bg-slate-100"
                                  title="Delete"
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
        </>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: LOGISTICS, VIP GUESTS & PROGRAM FLOW                           */}
      {/* ========================================================================= */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-700 mb-1">
              <Layers className="w-4 h-4" />
              <h3 className="font-bold text-slate-900 text-sm">Event Operations, VIP Protocol & Performers Directory</h3>
            </div>
            <p className="text-xs text-slate-500">
              Protocol lists for distinguished guests, performing cultural troupes, official sponsors, and detailed program sequences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((ev) => (
              <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-base">{ev.eventName}</h4>
                    <span className="text-xs text-emerald-700 font-semibold">{ev.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.venue}</span>
                  </p>
                </div>

                {/* Program Flow */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Program Flow Schedule:</span>
                  </span>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
                    {ev.programFlow}
                  </div>
                </div>

                {/* VIP Guests */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>VIP Dignitaries & Guests ({ev.guests.length}):</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ev.guests.map((g, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-medium border border-blue-100">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performers */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                    <Mic className="w-3.5 h-3.5 text-purple-600" />
                    <span>Performers & Cultural Artists ({ev.performers.length}):</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ev.performers.map((p, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-medium border border-purple-100">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sponsors */}
                <div>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    <span>Official Sponsors & Partners:</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ev.sponsors.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-medium border border-amber-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: POST-EVENT TURNOUT & EVALUATION                                */}
      {/* ========================================================================= */}
      {activeTab === 'evaluation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Overall Turnout Ratio</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {totalExpectedParticipants > 0
                  ? Math.round((totalActualAttendance / totalExpectedParticipants) * 100)
                  : 0}%
              </div>
              <div className="text-xs text-emerald-700 font-medium mt-1">
                {totalActualAttendance.toLocaleString()} attendees of {totalExpectedParticipants.toLocaleString()} projected
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Average Satisfaction</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <span>{averageRating}</span>
                <span className="text-xs font-normal text-slate-400">/ 5.0</span>
                <div className="flex text-amber-400">
                  {'★'.repeat(Math.round(parseFloat(averageRating)))}
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-1">Standard DOT Post-Event Exit Surveys</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Completed Festivals</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{completedCount} Executed</div>
              <div className="text-xs text-slate-500 mt-1">Full post-activity documentation submitted</div>
            </div>
          </div>

          {/* Turnout & Evaluation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((ev) => {
              const turnout = ev.participantsExpected > 0
                ? Math.round(((ev.attendanceActual || 0) / ev.participantsExpected) * 100)
                : 0;

              return (
                <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{ev.eventName}</h4>
                      <p className="text-xs text-slate-500">{ev.date} • {ev.venue}</p>
                    </div>
                    <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{ev.evaluationRating} / 5.0</span>
                    </div>
                  </div>

                  {/* Turnout Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">Turnout Achievement Rate</span>
                      <span className="font-bold text-slate-900">
                        {ev.attendanceActual > 0 ? ev.attendanceActual.toLocaleString() : 0} / {ev.participantsExpected.toLocaleString()} Pax ({turnout}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${
                          turnout >= 100 ? 'bg-emerald-600' : turnout >= 75 ? 'bg-blue-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, turnout)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Documentation Photos */}
                  {ev.documentationUrls && ev.documentationUrls.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1.5">
                        <Camera className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Event Photo & Media Archives ({ev.documentationUrls.length}):</span>
                      </span>
                      <div className="flex gap-2 overflow-x-auto">
                        {ev.documentationUrls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                            onClick={() => setInspectPhoto({ url, title: `${ev.eventName} (Photo #${idx + 1})` })}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status: <strong>{ev.status}</strong></span>
                    <button
                      onClick={() => setPrintableEvent(ev)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                      Print Evaluation Report →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: FINANCIAL MONITORING & COA LIQUIDATION                          */}
      {/* ========================================================================= */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Programmed Budget</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{totalBudget.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">LGU Appropriation & Grants</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Actual Disbursed</span>
              <div className="text-2xl font-bold text-emerald-800 mt-1">₱{totalActualExpense.toLocaleString()}</div>
              <div className="text-xs text-emerald-700 font-medium mt-1">
                Net Savings: ₱{(totalBudget - totalActualExpense).toLocaleString()}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">COA Liquidation Rate</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {Math.round(
                  (events.filter((e) => e.financialReportStatus === 'Approved & Liquidated').length /
                    (events.length || 1)) *
                    100
                )}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Compliant with COA circulars</div>
            </div>
          </div>

          {/* Recharts Budget vs Actual Expense */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Event Budget vs. Actual Expenditure (in ₱ Thousands)</h4>
            <p className="text-xs text-slate-500 mb-4">Financial variance comparison across municipal tourism events.</p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: number) => [`₱${(val * 1000).toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="Budget" fill="#059669" name="Appropriated Budget (k)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual" fill="#0284c7" name="Actual Expenditures (k)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Financial Liquidation Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Events Liquidation Audit Register</h4>
              <span className="text-xs text-slate-500">COA Form & LGU Compliance</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Event Title</th>
                    <th className="px-4 py-3">Appropriated Budget</th>
                    <th className="px-4 py-3">Actual Disbursed</th>
                    <th className="px-4 py-3">Variance / Savings</th>
                    <th className="px-4 py-3">COA Liquidation Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((ev) => {
                    const variance = ev.budget - (ev.actualExpense || 0);
                    return (
                      <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">{ev.eventName}</td>
                        <td className="px-4 py-3 font-medium">₱{ev.budget.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-800">₱{(ev.actualExpense || 0).toLocaleString()}</td>
                        <td className={`px-4 py-3 font-semibold ${variance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          ₱{variance.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            ev.financialReportStatus === 'Approved & Liquidated'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.financialReportStatus === 'Under Audit'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {ev.financialReportStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setPrintableEvent(ev)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Audit Report</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT EVENT                                                 */}
      {/* ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-950">
              <div>
                <h3 className="font-bold text-base text-white">
                  {editingId ? 'Edit Tourism Event Details' : 'Program New Tourism Event / Festival'}
                </h3>
                <p className="text-xs text-emerald-200">Section F • Official Events Management System (EMS)</p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-emerald-200 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Event Name & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18th Slang Festival & Cultural Summit"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Start Date, End Date, Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Municipal Sunken Arena"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Organizer, Budget, Actual Expense */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Organizer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MTO Malungon & Tribal Council"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Appropriated Budget (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Actual Expense (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formData.actualExpense}
                    onChange={(e) => setFormData({ ...formData, actualExpense: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Expected vs Actual Attendance, Liquidation Status, Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.participantsExpected}
                    onChange={(e) => setFormData({ ...formData, participantsExpected: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Actual Attendance</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.attendanceActual}
                    onChange={(e) => setFormData({ ...formData, attendanceActual: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Liquidation Status</label>
                  <select
                    value={formData.financialReportStatus}
                    onChange={(e) => setFormData({ ...formData, financialReportStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Pending Submission">Pending Submission</option>
                    <option value="Under Audit">Under Audit</option>
                    <option value="Approved & Liquidated">Approved & Liquidated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Evaluation Score (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={1}
                    max={5}
                    value={formData.evaluationRating}
                    onChange={(e) => setFormData({ ...formData, evaluationRating: parseFloat(e.target.value) || 5 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Program Flow Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program Flow & Activities Schedule</label>
                <textarea
                  rows={2}
                  value={formData.programFlow}
                  onChange={(e) => setFormData({ ...formData, programFlow: e.target.value })}
                  placeholder="e.g. Day 1: Civic-Military Parade; Day 2: Cultural Competitions; Day 3: Fireworks"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              {/* Multi-item inputs: Sponsors, VIP Guests, Performers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Sponsors (one per line)</label>
                  <textarea
                    rows={2}
                    value={formSponsorsText}
                    onChange={(e) => setFormSponsorsText(e.target.value)}
                    placeholder="DOT Region XII&#10;Provincial Government"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">VIP Guests / Dignitaries (one per line)</label>
                  <textarea
                    rows={2}
                    value={formGuestsText}
                    onChange={(e) => setFormGuestsText(e.target.value)}
                    placeholder="Municipal Mayor&#10;Provincial Governor"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Performers / Artists (one per line)</label>
                  <textarea
                    rows={2}
                    value={formPerformersText}
                    onChange={(e) => setFormPerformersText(e.target.value)}
                    placeholder="Lamlifew Cultural Troupe&#10;Youth Symphonic Band"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Photo & Documentation URLs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Media Documentation / Photo URLs (one per line)</label>
                <textarea
                  rows={2}
                  value={formDocsText}
                  onChange={(e) => setFormDocsText(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                />
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
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingId ? 'Save Event' : 'Confirm Event Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EVENT DOSSIER / EXECUTIVE PROGRAM BRIEF                          */}
      {/* ========================================================================= */}
      {dossierEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
              <img
                src={dossierEvent.documentationUrls[0] || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3'}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

              <button
                onClick={() => setDossierEvent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-1.5 backdrop-blur-xs transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white">
                    {dossierEvent.status}
                  </span>
                  <h3 className="text-xl font-bold mt-1 text-white">{dossierEvent.eventName}</h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{dossierEvent.venue} • {dossierEvent.date} to {dossierEvent.endDate || dossierEvent.date}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    const ev = dossierEvent;
                    setDossierEvent(null);
                    setPrintableEvent(ev);
                  }}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Activity Report</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Budget</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">₱{dossierEvent.budget.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Actual Expense</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">₱{(dossierEvent.actualExpense || 0).toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Turnout</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {dossierEvent.attendanceActual > 0
                      ? `${dossierEvent.attendanceActual.toLocaleString()} Pax`
                      : `${dossierEvent.participantsExpected.toLocaleString()} Exp`}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Rating</span>
                  <div className="text-sm font-bold text-amber-600 mt-0.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{dossierEvent.evaluationRating} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Program Flow */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Official Program Flow</h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {dossierEvent.programFlow}
                </div>
              </div>

              {/* VIPs & Performers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">VIP Dignitaries & Guests</h4>
                  <div className="flex flex-wrap gap-1">
                    {dossierEvent.guests.map((g, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium border border-blue-100">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Performers & Cultural Artists</h4>
                  <div className="flex flex-wrap gap-1">
                    {dossierEvent.performers.map((p, i) => (
                      <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg text-xs font-medium border border-purple-100">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sponsors & Liquidation */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-slate-700 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <span className="font-semibold text-emerald-950">Official Sponsors:</span>
                  <div className="mt-1 text-slate-600">{dossierEvent.sponsors.join(', ')}</div>
                </div>
                <div>
                  <span className="font-semibold text-emerald-950">COA Liquidation Status:</span>
                  <div className="mt-1 font-bold text-emerald-800">{dossierEvent.financialReportStatus}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: PRINTABLE POST-ACTIVITY & EVENT BRIEF REPORT                     */}
      {/* ========================================================================= */}
      {printableEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2 text-xs">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Official LGU Event Post-Activity & Liquidation Report</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Print Report
                </button>
                <button
                  onClick={() => setPrintableEvent(null)}
                  className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Paper Document */}
            <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 space-y-6">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="text-[11px] uppercase tracking-widest text-slate-600 font-serif">Republic of the Philippines</div>
                <div className="text-xs font-serif text-slate-700">Province of Sarangani • Municipality of Malungon</div>
                <div className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-1">
                  OFFICE OF THE MUNICIPAL TOURISM OFFICER
                </div>
                <div className="text-[10px] text-slate-500 font-serif italic mt-0.5">
                  Official Post-Activity Briefing & Financial Liquidation Summary • COA Circular Compliance
                </div>
              </div>

              {/* Title & Control No */}
              <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                <div>
                  <h2 className="text-xl font-black uppercase text-slate-900">{printableEvent.eventName}</h2>
                  <div className="text-xs text-slate-600">Venue: {printableEvent.venue}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-[10px] text-slate-400">CONTROL NO:</div>
                  <div className="font-mono font-bold text-slate-800">EMS-{printableEvent.id.toUpperCase()}</div>
                </div>
              </div>

              {/* Activity Details Table */}
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600 w-1/3">Inclusive Dates</td>
                    <td className="px-3 py-2 font-bold text-slate-900">
                      {printableEvent.date} to {printableEvent.endDate || printableEvent.date}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Lead Organizer</td>
                    <td className="px-3 py-2">{printableEvent.organizer}</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Appropriated Budget</td>
                    <td className="px-3 py-2 font-bold">₱{printableEvent.budget.toLocaleString()}.00</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Actual Expenditures</td>
                    <td className="px-3 py-2 font-bold text-emerald-800">₱{(printableEvent.actualExpense || 0).toLocaleString()}.00</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Net Variance / Savings</td>
                    <td className="px-3 py-2 font-bold text-emerald-700">
                      ₱{(printableEvent.budget - (printableEvent.actualExpense || 0)).toLocaleString()}.00
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Participant Turnout</td>
                    <td className="px-3 py-2 font-bold">
                      {printableEvent.attendanceActual > 0
                        ? `${printableEvent.attendanceActual.toLocaleString()} Attendees (Projected: ${printableEvent.participantsExpected.toLocaleString()})`
                        : `${printableEvent.participantsExpected.toLocaleString()} Projected Participants`}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Post-Activity Evaluation Score</td>
                    <td className="px-3 py-2 font-bold text-amber-700">{printableEvent.evaluationRating} / 5.0 Rating</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold text-slate-600">COA Liquidation Status</td>
                    <td className="px-3 py-2 font-bold text-emerald-800">{printableEvent.financialReportStatus}</td>
                  </tr>
                </tbody>
              </table>

              {/* Program & Sponsors */}
              <div className="space-y-3 text-xs">
                <div className="p-3 border border-slate-200 rounded">
                  <div className="font-bold text-slate-800 mb-1">Program Flow Summary:</div>
                  <p className="text-slate-700">{printableEvent.programFlow}</p>
                </div>
                <div className="p-3 border border-slate-200 rounded">
                  <div className="font-bold text-slate-800 mb-1">Official Sponsors:</div>
                  <p className="text-slate-700">{printableEvent.sponsors.join(', ')}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="border-b border-slate-800 w-36 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">ACTIVITY LEAD</div>
                  <div className="text-[10px] text-slate-500">Event Coordinator</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-36 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">CRISTINA D. CONSTANTINO-LA PAZ</div>
                  <div className="text-[10px] text-slate-500">Municipal Tourism Action Officer-Designate</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-36 mx-auto mb-1"></div>
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
              <h4 className="font-bold text-base">{inspectPhoto.title}</h4>
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
    </div>
  );
};
