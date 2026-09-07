import React, { useState } from 'react';
import {
  BookOpenCheck,
  TrendingUp,
  BarChart2,
  FileSpreadsheet,
  Layers,
  Compass,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Printer,
  X,
  Building2,
  DollarSign,
  Coins,
  Sparkles,
  Sliders,
  Calendar,
  ChevronRight,
  ExternalLink,
  Award,
  Check,
  MapPin,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import { TourismResearch } from '../../types';

type SubTab = 'studies' | 'forecasting' | 'planning' | 'investment' | 'accomplishments';

interface InvestmentProject {
  id: string;
  projectTitle: string;
  barangay: string;
  category: string;
  capitalRequirement: number; // in PHP
  fundingMechanism: 'Public-Private Partnership (PPP)' | 'LGU Local Development Fund' | 'TIEZA / National Grant';
  projectStatus: 'Conceptual / Feasibility' | 'Detailed Engineering Design' | 'Procurement / Bidding' | 'Ongoing Construction';
  projectedROI: string;
  priorityLevel: 'High' | 'Critical' | 'Medium';
}

const INITIAL_INVESTMENT_PROJECTS: InvestmentProject[] = [
  {
    id: 'inv-proj-01',
    projectTitle: 'Kalon Barak Highland Skywalk & Eco-Cable Facility',
    barangay: 'Poblacion',
    category: 'Highland Eco-Tourism',
    capitalRequirement: 45000000,
    fundingMechanism: 'Public-Private Partnership (PPP)',
    projectStatus: 'Detailed Engineering Design',
    projectedROI: '18.5% IRR (5-Year Payback)',
    priorityLevel: 'Critical',
  },
  {
    id: 'inv-proj-02',
    projectTitle: 'Lamlifew Living Traditions Cultural Heritage Lodge & Weaving Pavilion',
    barangay: 'Datal Tampal',
    category: 'Cultural Tourism',
    capitalRequirement: 18000000,
    fundingMechanism: 'TIEZA / National Grant',
    projectStatus: 'Procurement / Bidding',
    projectedROI: '14.2% Community Dividend',
    priorityLevel: 'High',
  },
  {
    id: 'inv-proj-03',
    projectTitle: 'Malungon Central Agri-Tourism Logistics & Cold Chain Pasalubong Hub',
    barangay: 'Malandag',
    category: 'Agri-Tourism & MSME',
    capitalRequirement: 28000000,
    fundingMechanism: 'LGU Local Development Fund',
    projectStatus: 'Ongoing Construction',
    projectedROI: '21.0% Economic Multiplier',
    priorityLevel: 'High',
  },
  {
    id: 'inv-proj-04',
    projectTitle: 'Upper Biangan River Tubing Safety Terminal & Ranger Station',
    barangay: 'Upper Biangan',
    category: 'Adventure & Sports',
    capitalRequirement: 8500000,
    fundingMechanism: 'LGU Local Development Fund',
    projectStatus: 'Conceptual / Feasibility',
    projectedROI: '16.0% Municipal Revenue',
    priorityLevel: 'Medium',
  },
  {
    id: 'inv-proj-05',
    projectTitle: 'Banate Mountain Bike Downhill Circuit & Trails Hub',
    barangay: 'Banate',
    category: 'Sports Tourism',
    capitalRequirement: 6200000,
    fundingMechanism: 'TIEZA / National Grant',
    projectStatus: 'Detailed Engineering Design',
    projectedROI: '12.5% Direct Receipts',
    priorityLevel: 'Medium',
  },
];

export const ResearchPlanningView: React.FC = () => {
  const { research, addResearch, updateResearch, deleteResearch, isReadOnly, municipalityInfo } = useTourism();

  // Active Tab
  const [activeTab, setActiveTab] = useState<SubTab>('studies');

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [editingStudyId, setEditingStudyId] = useState<string | null>(null);
  const [dossierStudy, setDossierStudy] = useState<TourismResearch | null>(null);
  const [printableDigest, setPrintableDigest] = useState(false);

  // Dynamic Econometric Simulation Sliders
  const [projectedGrowthRate, setProjectedGrowthRate] = useState<number>(25); // %
  const [avgDailySpend, setAvgDailySpend] = useState<number>(1850); // PHP

  // Form Initial State (All 7 docx research fields)
  const initialStudyForm: Omit<TourismResearch, 'id'> = {
    title: '',
    leadResearcher: 'Municipal Tourism Research Team',
    year: new Date().getFullYear(),
    category: 'Visitor Survey',
    keyFindings: '',
    fileUrl: 'https://malungon.gov.ph/tourism/research/report.pdf',
    status: 'Adopted by LGU',
  };
  const [studyFormData, setStudyFormData] = useState(initialStudyForm);

  // Baseline Historical Forecast Data
  const baseForecastData = [
    { year: '2022', arrivals: 18400, revenue: 14.2, isProjection: false },
    { year: '2023', arrivals: 26200, revenue: 21.5, isProjection: false },
    { year: '2024', arrivals: 34800, revenue: 31.8, isProjection: false },
    { year: '2025', arrivals: 44100, revenue: 42.6, isProjection: false },
    { year: '2026', arrivals: 55000, revenue: 58.0, isProjection: false },
  ];

  // Dynamic Simulator Computations based on sliders
  const simulatedArrivals2027 = Math.round(55000 * (1 + projectedGrowthRate / 100));
  const simulatedRevenue2027 = Number(((simulatedArrivals2027 * avgDailySpend * 2.2) / 1000000).toFixed(1));

  const simulatedArrivals2028 = Math.round(simulatedArrivals2027 * (1 + projectedGrowthRate / 100));
  const simulatedRevenue2028 = Number(((simulatedArrivals2028 * avgDailySpend * 2.3) / 1000000).toFixed(1));

  const dynamicForecastData = [
    ...baseForecastData,
    { year: '2027 (Simulated)', arrivals: simulatedArrivals2027, revenue: simulatedRevenue2027, isProjection: true },
    { year: '2028 (Simulated)', arrivals: simulatedArrivals2028, revenue: simulatedRevenue2028, isProjection: true },
  ];

  // Filtered research studies
  const filteredResearch = research.filter((study) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      study.title.toLowerCase().includes(term) ||
      study.leadResearcher.toLowerCase().includes(term) ||
      study.keyFindings.toLowerCase().includes(term);

    const matchesCat = filterCategory === 'ALL' || study.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || study.status === filterStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Handlers for Research Study Form
  const handleOpenStudyForm = (study?: TourismResearch) => {
    if (study) {
      setEditingStudyId(study.id);
      setStudyFormData({
        title: study.title,
        leadResearcher: study.leadResearcher,
        year: study.year,
        category: study.category,
        keyFindings: study.keyFindings,
        fileUrl: study.fileUrl,
        status: study.status,
      });
    } else {
      setEditingStudyId(null);
      setStudyFormData(initialStudyForm);
    }
    setIsStudyModalOpen(true);
  };

  const handleSaveStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studyFormData.title.trim()) return;

    if (editingStudyId && updateResearch) {
      updateResearch(editingStudyId, studyFormData);
    } else {
      addResearch(studyFormData);
    }
    setIsStudyModalOpen(false);
  };

  const handleDeleteStudy = (id: string, title: string) => {
    if (window.confirm(`Delete research study "${title}"?`)) {
      if (deleteResearch) {
        deleteResearch(id);
      }
    }
  };

  // CSV Export for Research Studies
  const handleExportCSV = () => {
    const headers = ['Study ID', 'Title', 'Lead Researcher', 'Year', 'Category', 'Key Findings', 'Status', 'File URL'];
    const rows = filteredResearch.map((study) => [
      `"${study.id}"`,
      `"${study.title.replace(/"/g, '""')}"`,
      `"${study.leadResearcher.replace(/"/g, '""')}"`,
      study.year,
      `"${study.category}"`,
      `"${study.keyFindings.replace(/"/g, '""')}"`,
      `"${study.status}"`,
      `"${study.fileUrl}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Malungon_Tourism_Research_Studies_Roster_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
            <BookOpenCheck className="w-4 h-4" />
            <span>MODULE H • Research, Strategic Planning & Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Research & Planning Unit (RPU)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empirical baseline surveys, econometric forecasting, MTDP 2024–2030 roadmap, SWOT analysis, and capital investment portfolio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPrintableDigest(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print MTDP Digest</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Research CSV</span>
          </button>
          {!isReadOnly && (
            <button
              onClick={() => handleOpenStudyForm()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Enrol Research Study</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Adopted Studies</span>
            <BookOpenCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{research.length} Publications</div>
          <div className="text-xs text-teal-700 font-medium mt-1">LGU Policy-Adopted Researches</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">MTDP 2024–2030 Status</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">Year 3 / Phase II</div>
          <div className="text-xs text-slate-500 mt-1">74% Target Indicator Achievement</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Economic Multiplier</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">1.85x Multiplier</div>
          <div className="text-xs text-slate-500 mt-1">Direct to indirect local economic turnover</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Investment Pipeline</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">₱105.7M</div>
          <div className="text-xs text-amber-700 font-medium mt-1">5 Priority PPP & Grant Projects</div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 px-4 rounded-t-xl flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('studies')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'studies'
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Research & Baseline Studies</span>
            <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-teal-100 text-teal-800">
              {filteredResearch.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('forecasting')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'forecasting'
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Econometric Forecasting & Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('planning')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'planning'
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>MTDP Pillars & SWOT Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('investment')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'investment'
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Investment Portfolio & Capital Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('accomplishments')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'accomplishments'
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Annual Accomplishments</span>
          </button>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: COMMISSIONED RESEARCH STUDIES                                   */}
      {/* ========================================================================= */}
      {activeTab === 'studies' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search study title, researcher, or empirical findings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Categories</option>
                <option value="Visitor Survey">Visitor Survey</option>
                <option value="Economic Impact Assessment">Economic Impact Assessment</option>
                <option value="Carrying Capacity Study">Carrying Capacity Study</option>
                <option value="Master Plan">Master Plan</option>
                <option value="SWOT Analysis">SWOT Analysis</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Adoption Statuses</option>
                <option value="Adopted by LGU">Adopted by LGU</option>
                <option value="Published">Published</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          </div>

          {/* Research Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Empirical Tourism Studies & Publications</h3>
                <p className="text-xs text-slate-500">Peer-reviewed research supporting Sangguniang Bayan ordinances</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-800 rounded border border-teal-200">
                {filteredResearch.length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Study Title & Lead</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Key Empirical Findings</th>
                    <th className="px-3 py-3.5">Year</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResearch.map((study) => (
                    <tr key={study.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-bold text-slate-900 text-sm">{study.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Lead: {study.leadResearcher}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {study.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 max-w-md text-xs leading-relaxed">
                        {study.keyFindings}
                      </td>
                      <td className="px-3 py-3.5 font-mono text-slate-800 font-bold">{study.year}</td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            study.status === 'Adopted by LGU'
                              ? 'bg-teal-100 text-teal-800'
                              : study.status === 'Published'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {study.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setDossierStudy(study)}
                            className="p-1.5 text-slate-400 hover:text-teal-700 rounded hover:bg-slate-100"
                            title="View Abstract & Findings"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isReadOnly && (
                            <>
                              <button
                                onClick={() => handleOpenStudyForm(study)}
                                className="p-1.5 text-slate-400 hover:text-blue-700 rounded hover:bg-slate-100"
                                title="Edit Study"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudy(study.id, study.title)}
                                className="p-1.5 text-slate-400 hover:text-rose-700 rounded hover:bg-slate-100"
                                title="Delete Study"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ECONOMETRIC FORECASTING & SIMULATOR                            */}
      {/* ========================================================================= */}
      {activeTab === 'forecasting' && (
        <div className="space-y-6">
          {/* Interactive Simulation Controls */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-600 text-white">
                  Monte Carlo & ARIMA Econometric Sandbox
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Interactive Municipal Inbound & Revenue Simulator</h3>
                <p className="text-xs text-teal-200">
                  Calibrate annual visitor growth elasticity and tourist spending power to project local economic revenue turnover.
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-teal-300">Projected 2028 Revenue</div>
                <div className="text-2xl font-black text-white">₱{simulatedRevenue2028} Million</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-teal-800">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-teal-200 font-semibold">Projected Annual Growth Rate:</span>
                  <span className="font-bold text-white">{projectedGrowthRate}% Year-over-Year</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={45}
                  value={projectedGrowthRate}
                  onChange={(e) => setProjectedGrowthRate(parseInt(e.target.value) || 20)}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-teal-400 mt-0.5">
                  <span>10% (Conservative)</span>
                  <span>25% (Baseline Target)</span>
                  <span>45% (Aggressive Surge)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-teal-200 font-semibold">Average Tourist Daily Expenditure:</span>
                  <span className="font-bold text-white">₱{avgDailySpend.toLocaleString()} / Day</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={4000}
                  step={50}
                  value={avgDailySpend}
                  onChange={(e) => setAvgDailySpend(parseInt(e.target.value) || 1850)}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-teal-400 mt-0.5">
                  <span>₱1,000 (Day-trip)</span>
                  <span>₱1,850 (Standard)</span>
                  <span>₱4,000 (Glamping & High-end)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recharts Trajectory */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>Statistical Forecast Trajectory: Tourist Volume vs. Economic Turnover (2022–2028)</span>
                </h4>
                <p className="text-xs text-slate-500">Historical Actuals (2022–2025) • 2026 Target • Calibrated Projections (2027–2028)</p>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-teal-600"></span> Arrivals (Pax)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-amber-500"></span> Receipts (PHP Millions)
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dynamicForecastData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="arrivals" name="Tourist Arrivals" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (PHP M)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: MTDP STRATEGIC PILLARS & SWOT MATRIX                           */}
      {/* ========================================================================= */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          {/* MTDP 2024-2030 Five Strategic Pillars */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-teal-700">
              <Compass className="w-4 h-4" />
              <h3 className="font-bold text-slate-900 text-sm">Municipal Tourism Development Plan (MTDP 2024–2030) Strategic Pillars</h3>
            </div>
            <p className="text-xs text-slate-500">
              Approved by Sangguniang Bayan Resolution 2024-88 as the official 6-year master roadmap.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
              <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200">
                <span className="text-[10px] uppercase font-bold text-teal-800">Pillar 1</span>
                <h4 className="font-bold text-slate-900 text-xs mt-1">Highland Eco-Tourism</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Kalon Barak Ridge, Upper Mainit nature reserves & carrying capacity enforcement.
                </p>
                <div className="mt-3 text-[10px] font-semibold text-teal-700">85% On Track</div>
              </div>

              <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-200">
                <span className="text-[10px] uppercase font-bold text-indigo-800">Pillar 2</span>
                <h4 className="font-bold text-slate-900 text-xs mt-1">Living Traditions</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Blaan & Tagakaolo IP master weavers, Lamlifew museum, and heritage conservation.
                </p>
                <div className="mt-3 text-[10px] font-semibold text-indigo-700">92% On Track</div>
              </div>

              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800">Pillar 3</span>
                <h4 className="font-bold text-slate-900 text-xs mt-1">Agro-MSME Integration</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Pasalubong centers, high-altitude coffee, cacao, and community livelihoods.
                </p>
                <div className="mt-3 text-[10px] font-semibold text-amber-700">70% On Track</div>
              </div>

              <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-800">Pillar 4</span>
                <h4 className="font-bold text-slate-900 text-xs mt-1">Climate Resilience</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  DRRMO weather telemetry, slope stabilization along trail corridors, clean energy.
                </p>
                <div className="mt-3 text-[10px] font-semibold text-rose-700">78% On Track</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-800">Pillar 5</span>
                <h4 className="font-bold text-slate-900 text-xs mt-1">Digital Governance</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  MTODMS cloud operations, GIS mapping, DOT standard compliance, data accuracy.
                </p>
                <div className="mt-3 text-[10px] font-semibold text-slate-700">95% Operational</div>
              </div>
            </div>
          </div>

          {/* Four-Quadrant SWOT Matrix */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Comprehensive Municipal Tourism SWOT Matrix</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Strengths */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>STRENGTHS (Internal Advantages)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-emerald-900">
                  <li>Highland microclimate at Kalon Barak Skyline Ridge (780m–850m MASL).</li>
                  <li>Genuine indigenous living traditions of Blaan and Tagakaolo master artisans.</li>
                  <li>Strategic location along General Santos – Davao national arterial highway.</li>
                  <li>Strong political commitment and integrated Tourism Code regulatory framework.</li>
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>WEAKNESSES (Internal Gaps)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-900">
                  <li>Accommodation shortage for large conventions (over 500 pax).</li>
                  <li>Patchy cellular and digital payment infrastructure in interior mountain trails.</li>
                  <li>Need for expanded formal DOT tour guiding certifications among community rangers.</li>
                </ul>
              </div>

              {/* Opportunities */}
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
                <div className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span>OPPORTUNITIES (External Trends)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-blue-900">
                  <li>Surging domestic demand for nature-based glamping and high-altitude retreats.</li>
                  <li>Expansion into sports tourism: MTB downhill challenges, sky marathons, trail running.</li>
                  <li>Global market exposure for authentic Blaan Mabal Tabih handwoven textiles.</li>
                </ul>
              </div>

              {/* Threats */}
              <div className="p-4 bg-rose-50/70 rounded-xl border border-rose-200 space-y-2">
                <div className="font-bold text-rose-950 text-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>THREATS (External Risks)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-rose-900">
                  <li>Climate-induced landslides along mountain ridge corridors during La Niña typhoons.</li>
                  <li>Over-tourism pressure on delicate highland watersheds without carrying capacity caps.</li>
                  <li>Risk of unauthorized imitation of indigenous tribal patterns.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: INVESTMENT PORTFOLIO & CAPITAL PROJECTS                        */}
      {/* ========================================================================= */}
      {activeTab === 'investment' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4" />
                <span>Municipal Tourism Investment Portfolio (MTIP)</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Priority Capital Development & PPP Investment Pipeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bankable capital infrastructure projects seeking Public-Private Partnerships, TIEZA grants, and LGU appropriations.
              </p>
            </div>
            <div className="px-4 py-2 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold text-center">
              ₱105.7M Total Pipeline Capital
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INITIAL_INVESTMENT_PROJECTS.map((proj) => (
              <div key={proj.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      {proj.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      proj.priorityLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {proj.priorityLevel} Priority
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2">{proj.projectTitle}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Barangay {proj.barangay}, Malungon</span>
                  </p>

                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capital Requirement:</span>
                      <strong className="text-slate-900">₱{(proj.capitalRequirement / 1000000).toFixed(1)} Million</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Funding Mechanism:</span>
                      <span className="text-slate-700 font-medium truncate max-w-[150px]">{proj.fundingMechanism}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Projected Feasibility:</span>
                      <span className="text-emerald-700 font-semibold">{proj.projectedROI}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Status: {proj.projectStatus}</span>
                  <span className="text-teal-700 font-semibold flex items-center gap-0.5">
                    <span>Prospectus</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: ANNUAL ACCOMPLISHMENT REPORTS                                  */}
      {/* ========================================================================= */}
      {activeTab === 'accomplishments' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Annual Accomplishment Reports & Milestone Deliverables</h3>
                <p className="text-xs text-slate-500">Official statutory submissions to the Municipal Mayor, DILG, and DOT Region XII</p>
              </div>
              <button
                onClick={() => setPrintableDigest(true)}
                className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Accomplishment Briefing</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      CY 2026 Mid-Year Accomplishment
                    </span>
                    <span className="text-xs text-slate-400">Adopted July 2026</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">
                    Mid-Year Tourism Performance, Carrying Capacity Audit & Slang Festival Mobilization
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    12,840 visitor registrations logged, 89% DOT establishment accreditation rate, zero major ecotourism safety incidents.
                  </p>
                </div>
                <button
                  onClick={() => setPrintableDigest(true)}
                  className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shrink-0"
                >
                  View Summary
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      CY 2025 Annual Accomplishment
                    </span>
                    <span className="text-xs text-slate-400">Sangguniang Bayan Approved</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">
                    Annual State of Municipal Tourism & Economic Contribution Report (CY 2025)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Record 44,100 visitor arrivals, ₱42.6M estimated direct tourism receipts, successful 17th Slang Festival execution.
                  </p>
                </div>
                <button
                  onClick={() => setPrintableDigest(true)}
                  className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 shrink-0"
                >
                  View Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT RESEARCH STUDY                                          */}
      {/* ========================================================================= */}
      {isStudyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-teal-900 text-white px-6 py-4 flex items-center justify-between border-b border-teal-950">
              <div>
                <h3 className="font-bold text-base text-white">
                  {editingStudyId ? 'Edit Tourism Research Study' : 'Enrol Commissioned Research Study'}
                </h3>
                <p className="text-xs text-teal-200">Section H • Research and Planning Unit (RPU)</p>
              </div>
              <button
                onClick={() => setIsStudyModalOpen(false)}
                className="text-teal-200 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudy} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Study Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Carrying Capacity & Ecological Limits of Kalon Barak Ridge"
                  value={studyFormData.title}
                  onChange={(e) => setStudyFormData({ ...studyFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Researcher / Institution *</label>
                  <input
                    type="text"
                    required
                    value={studyFormData.leadResearcher}
                    onChange={(e) => setStudyFormData({ ...studyFormData, leadResearcher: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year Conducted *</label>
                  <input
                    type="number"
                    min={2018}
                    max={2030}
                    value={studyFormData.year}
                    onChange={(e) => setStudyFormData({ ...studyFormData, year: parseInt(e.target.value) || 2026 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Research Category *</label>
                  <select
                    value={studyFormData.category}
                    onChange={(e) => setStudyFormData({ ...studyFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Visitor Survey">Visitor Survey</option>
                    <option value="Economic Impact Assessment">Economic Impact Assessment</option>
                    <option value="Carrying Capacity Study">Carrying Capacity Study</option>
                    <option value="Master Plan">Master Plan</option>
                    <option value="SWOT Analysis">SWOT Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">LGU Adoption Status *</label>
                  <select
                    value={studyFormData.status}
                    onChange={(e) => setStudyFormData({ ...studyFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Adopted by LGU">Adopted by LGU</option>
                    <option value="Published">Published</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Empirical Findings & Policy Implications *</label>
                <textarea
                  rows={3}
                  required
                  value={studyFormData.keyFindings}
                  onChange={(e) => setStudyFormData({ ...studyFormData, keyFindings: e.target.value })}
                  placeholder="Summarize core metrics, carrying capacity quotas, economic multipliers, or survey findings..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Document File / Google Drive URL</label>
                <input
                  type="url"
                  value={studyFormData.fileUrl}
                  onChange={(e) => setStudyFormData({ ...studyFormData, fileUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStudyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  {editingStudyId ? 'Save Study' : 'Enrol Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: STUDY DOSSIER & ABSTRACT                                           */}
      {/* ========================================================================= */}
      {dossierStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="bg-teal-900 text-white p-6 flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-700 text-white">
                  {dossierStudy.category} • Year {dossierStudy.year}
                </span>
                <h3 className="text-lg font-bold mt-1 text-white">{dossierStudy.title}</h3>
                <p className="text-xs text-teal-200">Lead Researcher: {dossierStudy.leadResearcher}</p>
              </div>
              <button onClick={() => setDossierStudy(null)} className="text-teal-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Core Findings & Policy Summary:</span>
                <p className="text-slate-800 leading-relaxed text-xs">{dossierStudy.keyFindings}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Adoption: <strong className="text-teal-700">{dossierStudy.status}</strong></span>
                <a
                  href={dossierStudy.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold"
                >
                  <span>Open Full PDF Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE MTDP DIGEST                                              */}
      {/* ========================================================================= */}
      {printableDigest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2 text-xs">
                <Printer className="w-4 h-4 text-teal-400" />
                <span className="font-semibold">Official LGU Research & MTDP Planning Digest</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Print Digest
                </button>
                <button
                  onClick={() => setPrintableDigest(false)}
                  className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 space-y-6">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="text-[11px] uppercase tracking-widest text-slate-600 font-serif">Republic of the Philippines</div>
                <div className="text-xs font-serif text-slate-700">Province of Sarangani • Municipality of Malungon</div>
                <div className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-1">
                  OFFICE OF THE MUNICIPAL TOURISM OFFICER
                </div>
                <div className="text-[10px] text-slate-500 font-serif italic mt-0.5">
                  Research & Planning Unit • Municipal Tourism Development Plan (MTDP 2024–2030) Briefing
                </div>
              </div>

              <div className="border-b border-slate-200 pb-2 flex justify-between items-end">
                <div>
                  <h2 className="text-lg font-black uppercase text-slate-900">MTDP Executive Strategic Briefing</h2>
                  <div className="text-xs text-slate-600">Econometric Forecast & Priority Investment Horizon</div>
                </div>
                <div className="text-xs font-mono font-bold text-slate-800">DOC REF: RPU-MTDP-2026</div>
              </div>

              {/* Summary table */}
              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600 w-1/3">Active Master Plan</td>
                    <td className="px-3 py-2 font-bold text-slate-900">Municipal Tourism Development Plan (MTDP 2024–2030)</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">CY 2026 Target Arrivals</td>
                    <td className="px-3 py-2 font-bold text-teal-800">55,000 Visitors (₱58.0 Million Projected Receipts)</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Simulated 2028 Projection</td>
                    <td className="px-3 py-2 font-bold text-emerald-800">
                      {simulatedArrivals2028.toLocaleString()} Visitors (₱{simulatedRevenue2028}M Receipts)
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Capital Investment Pipeline</td>
                    <td className="px-3 py-2 font-bold text-indigo-700">₱105.7 Million across 5 bankable projects</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold text-slate-600">Commissioned Policy Studies</td>
                    <td className="px-3 py-2">{research.length} Studies Adopted by LGU Malungon</td>
                  </tr>
                </tbody>
              </table>

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
    </div>
  );
};
