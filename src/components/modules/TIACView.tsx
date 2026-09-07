import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  PhoneCall,
  Search,
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Package,
  Calendar,
  MapPin,
  FileSpreadsheet,
  Printer,
  Download,
  Trash2,
  Eye,
  Star,
  ShieldAlert,
  Share2,
  LifeBuoy,
  ThumbsUp,
  MessageSquare,
  BookOpen,
  Users,
  Check,
  ExternalLink,
  Radio,
  FileText,
  ChevronRight,
  Info,
  Phone,
  Mail,
  Globe,
  Award,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import {
  VisitorAssistanceLog,
  LostAndFoundItem,
  EmergencyCaseLog,
  TouristFeedbackEntry,
  FAQItem
} from '../../types';

export const TIACView: React.FC = () => {
  const {
    tiacLogs,
    addTiacLog,
    updateTiacLog,
    deleteTiacLog,
    lostAndFound,
    addLostItem,
    claimLostItem,
    deleteLostItem,
    emergencyLogs,
    addEmergencyLog,
    updateEmergencyLog,
    touristFeedback,
    addTouristFeedback,
    faqs,
    addFAQ,
    currentUser,
    isReadOnly
  } = useTourism();

  // Active Sub-tab State
  const [activeTab, setActiveTab] = useState<'assistance' | 'lostfound' | 'emergency' | 'feedback' | 'faqs'>('assistance');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [lostCategoryFilter, setLostCategoryFilter] = useState('ALL');
  const [lostStatusFilter, setLostStatusFilter] = useState('ALL');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('ALL');

  // Modal States
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Selected item for Claim / Inspection / Print
  const [selectedItemToClaim, setSelectedItemToClaim] = useState<LostAndFoundItem | null>(null);
  const [claimantNameInput, setClaimantNameInput] = useState('');
  const [claimantContactInput, setClaimantContactInput] = useState('');
  const [claimantIdPresented, setClaimantIdPresented] = useState('PhilSys National ID');

  // Printable Slips / Forms Modal State
  const [selectedSlipLog, setSelectedSlipLog] = useState<VisitorAssistanceLog | null>(null);
  const [selectedReceiptItem, setSelectedReceiptItem] = useState<LostAndFoundItem | null>(null);

  // Form States
  const [logForm, setLogForm] = useState<Omit<VisitorAssistanceLog, 'id'>>({
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    visitorName: '',
    contact: '+63 9',
    visitorOrigin: 'Davao City',
    groupSize: 4,
    inquiryChannel: 'Walk-in Desk',
    assistanceType: 'Walk-in Inquiries',
    destinationInterest: 'Kalon Barak Ridge',
    details: '',
    actionTaken: 'Provided municipal tourism brochures, scenic ridge trail guide, and safety briefing.',
    officerInCharge: currentUser?.name || 'Tourism Information Officer',
    status: 'Resolved',
    urgencyLevel: 'Standard',
  });

  const [lostForm, setLostForm] = useState<Omit<LostAndFoundItem, 'id'>>({
    itemDescription: '',
    category: 'Electronics / Gadgets',
    locationFound: 'Kalon Barak Ridge Viewing Deck',
    dateFound: new Date().toISOString().substring(0, 10),
    foundBy: 'Tourism Information Desk Staff',
    custodyOfficer: currentUser?.name || 'TIAC Property Custodian',
    storageLocation: 'TIAC Vault Shelf A-2',
    status: 'Unclaimed',
  });

  const [emergencyForm, setEmergencyForm] = useState<Omit<EmergencyCaseLog, 'id'>>({
    incidentNumber: `EMG-${new Date().getFullYear()}-${String(emergencyLogs.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    incidentType: 'Medical Assistance',
    location: 'Kalon Barak Eco-Park Trailhead',
    reportedBy: '',
    contactNumber: '+63 9',
    respondingAgencies: ['MDRRMO Malungon Rescue 911', 'Tourism Assistance Desk'],
    actionsTaken: 'Dispatched MDRRMO emergency ambulance team and municipal rescue responders.',
    outcomeStatus: 'Active / Responding',
    officerInCharge: currentUser?.name || 'TIAC Duty Officer',
  });

  const [feedbackForm, setFeedbackForm] = useState<Omit<TouristFeedbackEntry, 'id'>>({
    date: new Date().toISOString().substring(0, 10),
    visitorName: '',
    visitorOrigin: 'General Santos City',
    destinationVisited: 'Kalon Barak Ridge',
    overallRating: 5,
    cleanlinessRating: 5,
    safetyRating: 5,
    hospitalityRating: 5,
    comments: '',
    recommendToOthers: true,
  });

  const [faqForm, setFaqForm] = useState<Omit<FAQItem, 'id'>>({
    category: 'Attractions & Permits',
    question: '',
    answer: '',
    relatedDestinations: 'Kalon Barak Ridge, Lamlifew Village',
  });

  // KPI Calculations
  const totalAssistanceLogs = tiacLogs.length;
  const walkInCount = tiacLogs.filter((l) => l.inquiryChannel === 'Walk-in Desk' || l.assistanceType === 'Walk-in Inquiries').length;
  const digitalCount = totalAssistanceLogs - walkInCount;
  const resolvedLogsCount = tiacLogs.filter((l) => l.status === 'Resolved').length;
  const resolutionRate = totalAssistanceLogs > 0 ? Math.round((resolvedLogsCount / totalAssistanceLogs) * 100) : 100;

  const totalLostItems = lostAndFound.length;
  const claimedLostItems = lostAndFound.filter((i) => i.status === 'Claimed by Owner').length;
  const lostReturnRate = totalLostItems > 0 ? Math.round((claimedLostItems / totalLostItems) * 100) : 0;

  const activeEmergencies = emergencyLogs.filter((e) => e.outcomeStatus === 'Active / Responding').length;

  const avgCsat = useMemo(() => {
    if (touristFeedback.length === 0) return 4.9;
    const sum = touristFeedback.reduce((acc, curr) => acc + curr.overallRating, 0);
    return Number((sum / touristFeedback.length).toFixed(1));
  }, [touristFeedback]);

  const recommendPercent = useMemo(() => {
    if (touristFeedback.length === 0) return 98;
    const count = touristFeedback.filter((f) => f.recommendToOthers).length;
    return Math.round((count / touristFeedback.length) * 100);
  }, [touristFeedback]);

  // Filtered Lists
  const filteredLogs = useMemo(() => {
    return tiacLogs.filter((log) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        log.visitorName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.destinationInterest && log.destinationInterest.toLowerCase().includes(q)) ||
        log.officerInCharge.toLowerCase().includes(q);

      const matchesChannel = channelFilter === 'ALL' || log.inquiryChannel === channelFilter;
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
      const matchesUrgency = urgencyFilter === 'ALL' || log.urgencyLevel === urgencyFilter;

      return matchesSearch && matchesChannel && matchesStatus && matchesUrgency;
    });
  }, [tiacLogs, searchTerm, channelFilter, statusFilter, urgencyFilter]);

  const filteredLostItems = useMemo(() => {
    return lostAndFound.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        item.itemDescription.toLowerCase().includes(q) ||
        item.locationFound.toLowerCase().includes(q) ||
        item.foundBy.toLowerCase().includes(q);

      const matchesCategory = lostCategoryFilter === 'ALL' || item.category === lostCategoryFilter;
      const matchesStatus = lostStatusFilter === 'ALL' || item.status === lostStatusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [lostAndFound, searchTerm, lostCategoryFilter, lostStatusFilter]);

  const filteredEmergencies = useMemo(() => {
    return emergencyLogs.filter((emg) => {
      const q = searchTerm.toLowerCase();
      return (
        emg.incidentNumber.toLowerCase().includes(q) ||
        emg.incidentType.toLowerCase().includes(q) ||
        emg.location.toLowerCase().includes(q) ||
        emg.reportedBy.toLowerCase().includes(q)
      );
    });
  }, [emergencyLogs, searchTerm]);

  const filteredFeedback = useMemo(() => {
    return touristFeedback.filter((fb) => {
      const q = searchTerm.toLowerCase();
      return (
        fb.visitorName.toLowerCase().includes(q) ||
        fb.destinationVisited.toLowerCase().includes(q) ||
        fb.comments.toLowerCase().includes(q) ||
        fb.visitorOrigin.toLowerCase().includes(q)
      );
    });
  }, [touristFeedback, searchTerm]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        (faq.relatedDestinations && faq.relatedDestinations.toLowerCase().includes(q));

      const matchesCategory = faqCategoryFilter === 'ALL' || faq.category === faqCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchTerm, faqCategoryFilter]);

  // Handlers
  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.visitorName) return;
    addTiacLog(logForm);
    setIsLogModalOpen(false);
    setLogForm({
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      visitorName: '',
      contact: '+63 9',
      visitorOrigin: 'Davao City',
      groupSize: 4,
      inquiryChannel: 'Walk-in Desk',
      assistanceType: 'Walk-in Inquiries',
      destinationInterest: 'Kalon Barak Ridge',
      details: '',
      actionTaken: 'Provided municipal tourism brochures, scenic ridge trail guide, and safety briefing.',
      officerInCharge: currentUser?.name || 'Tourism Information Officer',
      status: 'Resolved',
      urgencyLevel: 'Standard',
    });
  };

  const handleCreateLost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostForm.itemDescription) return;
    addLostItem(lostForm);
    setIsLostModalOpen(false);
    setLostForm({
      itemDescription: '',
      category: 'Electronics / Gadgets',
      locationFound: 'Kalon Barak Ridge Viewing Deck',
      dateFound: new Date().toISOString().substring(0, 10),
      foundBy: 'Tourism Information Desk Staff',
      custodyOfficer: currentUser?.name || 'TIAC Property Custodian',
      storageLocation: 'TIAC Vault Shelf A-2',
      status: 'Unclaimed',
    });
  };

  const handleConfirmClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemToClaim || !claimantNameInput) return;
    claimLostItem(selectedItemToClaim.id, `${claimantNameInput} (ID: ${claimantIdPresented}, Contact: ${claimantContactInput})`);
    setIsClaimModalOpen(false);
    setSelectedItemToClaim(null);
    setClaimantNameInput('');
    setClaimantContactInput('');
  };

  const handleCreateEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyForm.reportedBy) return;
    addEmergencyLog(emergencyForm);
    setIsEmergencyModalOpen(false);
    setEmergencyForm({
      incidentNumber: `EMG-${new Date().getFullYear()}-${String(emergencyLogs.length + 2).padStart(3, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      incidentType: 'Medical Assistance',
      location: 'Kalon Barak Eco-Park Trailhead',
      reportedBy: '',
      contactNumber: '+63 9',
      respondingAgencies: ['MDRRMO Malungon Rescue 911', 'Tourism Assistance Desk'],
      actionsTaken: 'Dispatched MDRRMO emergency ambulance team and municipal rescue responders.',
      outcomeStatus: 'Active / Responding',
      officerInCharge: currentUser?.name || 'TIAC Duty Officer',
    });
  };

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.visitorName) return;
    addTouristFeedback(feedbackForm);
    setIsFeedbackModalOpen(false);
    setFeedbackForm({
      date: new Date().toISOString().substring(0, 10),
      visitorName: '',
      visitorOrigin: 'General Santos City',
      destinationVisited: 'Kalon Barak Ridge',
      overallRating: 5,
      cleanlinessRating: 5,
      safetyRating: 5,
      hospitalityRating: 5,
      comments: '',
      recommendToOthers: true,
    });
  };

  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;
    addFAQ(faqForm);
    setIsFaqModalOpen(false);
    setFaqForm({
      category: 'Attractions & Permits',
      question: '',
      answer: '',
      relatedDestinations: 'Kalon Barak Ridge, Lamlifew Village',
    });
  };

  // CSV Export Helpers
  const handleExportAssistanceCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Visitor Name', 'Origin', 'Group Size', 'Contact', 'Channel', 'Assistance Type', 'Destination Interest', 'Urgency', 'Status', 'Officer', 'Details', 'Action Taken'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.visitorName.replace(/"/g, '""')}"`,
      `"${(l.visitorOrigin || '').replace(/"/g, '""')}"`,
      l.groupSize || 1,
      `"${l.contact}"`,
      `"${l.inquiryChannel || 'Walk-in Desk'}"`,
      `"${l.assistanceType}"`,
      `"${(l.destinationInterest || '').replace(/"/g, '""')}"`,
      `"${l.urgencyLevel || 'Standard'}"`,
      `"${l.status}"`,
      `"${l.officerInCharge.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.actionTaken.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MTODMS_TIAC_Visitor_Assistance_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportLostCSV = () => {
    const headers = ['Item ID', 'Description', 'Category', 'Location Found', 'Date Found', 'Turned Over By', 'Custody Officer', 'Storage Location', 'Status', 'Claimant Name', 'Date Claimed'];
    const rows = filteredLostItems.map((i) => [
      `"${i.id}"`,
      `"${i.itemDescription.replace(/"/g, '""')}"`,
      `"${i.category || 'Personal Items / Bags'}"`,
      `"${i.locationFound.replace(/"/g, '""')}"`,
      `"${i.dateFound}"`,
      `"${i.foundBy.replace(/"/g, '""')}"`,
      `"${(i.custodyOfficer || '').replace(/"/g, '""')}"`,
      `"${(i.storageLocation || '').replace(/"/g, '""')}"`,
      `"${i.status}"`,
      `"${(i.claimantName || '').replace(/"/g, '""')}"`,
      `"${i.dateClaimed || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MTODMS_Lost_and_Found_Vault_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFeedbackCSV = () => {
    const headers = ['Feedback ID', 'Date', 'Visitor Name', 'Origin', 'Destination Visited', 'Overall Rating', 'Cleanliness Rating', 'Safety Rating', 'Hospitality Rating', 'Recommend to Others', 'Comments'];
    const rows = filteredFeedback.map((f) => [
      `"${f.id}"`,
      `"${f.date}"`,
      `"${f.visitorName.replace(/"/g, '""')}"`,
      `"${f.visitorOrigin.replace(/"/g, '""')}"`,
      `"${f.destinationVisited.replace(/"/g, '""')}"`,
      f.overallRating,
      f.cleanlinessRating,
      f.safetyRating,
      f.hospitalityRating,
      f.recommendToOthers ? 'Yes' : 'No',
      `"${f.comments.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MTODMS_TIAC_Tourist_Feedback_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="p-2.5 bg-teal-700/60 backdrop-blur rounded-xl border border-teal-400/30">
              <Compass className="w-6 h-6 text-teal-200" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                Republic of the Philippines • Sarangani Province • Section M
              </span>
              <h1 className="text-2xl font-black tracking-tight">
                Tourism Information &amp; Assistance Center (TIAC)
              </h1>
            </div>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl">
            Frontline tourist reception, walk-in and online inquiry desk, lost and found vault registry, emergency response coordination, and visitor satisfaction monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'assistance' && (
            <button
              onClick={handleExportAssistanceCSV}
              className="inline-flex items-center px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur border border-white/20 transition-colors shadow-sm"
              title="Export Assistance Records"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-300" />
              Export CSV
            </button>
          )}

          {activeTab === 'lostfound' && (
            <button
              onClick={handleExportLostCSV}
              className="inline-flex items-center px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur border border-white/20 transition-colors shadow-sm"
              title="Export Lost & Found Registry"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-amber-300" />
              Export Vault CSV
            </button>
          )}

          {activeTab === 'feedback' && (
            <button
              onClick={handleExportFeedbackCSV}
              className="inline-flex items-center px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur border border-white/20 transition-colors shadow-sm"
              title="Export CSAT Feedback CSV"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-yellow-300" />
              Export CSAT CSV
            </button>
          )}

          {!isReadOnly && activeTab === 'assistance' && (
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-teal-500/30"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Log Visitor Assistance
            </button>
          )}

          {!isReadOnly && activeTab === 'lostfound' && (
            <button
              onClick={() => setIsLostModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-amber-500/30"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Record Recovered Property
            </button>
          )}

          {!isReadOnly && activeTab === 'emergency' && (
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-rose-500/30"
            >
              <ShieldAlert className="w-4 h-4 mr-1.5" />
              Log Emergency Incident
            </button>
          )}

          {!isReadOnly && activeTab === 'feedback' && (
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-emerald-500/30"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Submit Feedback Entry
            </button>
          )}

          {!isReadOnly && activeTab === 'faqs' && (
            <button
              onClick={() => setIsFaqModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add FAQ Item
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Inquiries Handled</div>
            <div className="text-lg font-bold text-slate-800">{totalAssistanceLogs}</div>
            <div className="text-[10px] text-teal-600 font-semibold">{walkInCount} Walk-in • {digitalCount} Digital</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Resolution Rate</div>
            <div className="text-lg font-bold text-emerald-700">{resolutionRate}%</div>
            <div className="text-[10px] text-slate-500">{resolvedLogsCount} / {totalAssistanceLogs} Completed</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Lost &amp; Found Vault</div>
            <div className="text-lg font-bold text-amber-700">{claimedLostItems} Claimed</div>
            <div className="text-[10px] text-amber-600 font-medium">{lostReturnRate}% Claim Recovery</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className={`p-2.5 rounded-lg ${activeEmergencies > 0 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Emergency Status</div>
            <div className={`text-lg font-bold ${activeEmergencies > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
              {activeEmergencies} Active
            </div>
            <div className="text-[10px] text-slate-500">MDRRMO 911 Ready</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-lg">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Visitor CSAT</div>
            <div className="text-lg font-bold text-yellow-700">{avgCsat} / 5.0</div>
            <div className="text-[10px] text-emerald-600 font-semibold">{recommendPercent}% Positive NPS</div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="border-b border-slate-200 flex space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => { setActiveTab('assistance'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'assistance'
              ? 'bg-white border-t-2 border-teal-600 text-teal-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4 mr-2 text-teal-600" />
          Visitor Assistance &amp; Inquiries
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-teal-100 text-teal-800 font-bold">
            {tiacLogs.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('lostfound'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'lostfound'
              ? 'bg-white border-t-2 border-amber-600 text-amber-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4 h-4 mr-2 text-amber-600" />
          Lost &amp; Found Property Registry
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {lostAndFound.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('emergency'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'emergency'
              ? 'bg-white border-t-2 border-rose-600 text-rose-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 mr-2 text-rose-600" />
          Emergency &amp; Referral Desk
          {activeEmergencies > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
              {activeEmergencies} Active
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveTab('feedback'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'bg-white border-t-2 border-emerald-600 text-emerald-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ThumbsUp className="w-4 h-4 mr-2 text-emerald-600" />
          Visitor CSAT &amp; Feedback Surveys
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {touristFeedback.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('faqs'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'faqs'
              ? 'bg-white border-t-2 border-blue-600 text-blue-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
          Frontline FAQ &amp; Knowledge Base
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
            {faqs.length}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: VISITOR ASSISTANCE & INQUIRIES */}
      {activeTab === 'assistance' && (
        <div className="space-y-4">
          {/* Controls / Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search visitor, origin, interest, officer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Inquiry Channels</option>
                <option value="Walk-in Desk">Walk-in Desk</option>
                <option value="Phone Hotline">Phone Hotline</option>
                <option value="Email">Email</option>
                <option value="Social Media">Social Media</option>
                <option value="Tourism Booth">Tourism Booth</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Resolved">Resolved</option>
                <option value="Referred">Referred</option>
                <option value="Pending Follow-up">Pending Follow-up</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Urgencies</option>
                <option value="Standard">Standard</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Assistance Logs Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Visitor &amp; Origin</th>
                    <th className="px-4 py-3">Channel &amp; Type</th>
                    <th className="px-4 py-3">Destination / Inquiry</th>
                    <th className="px-4 py-3">Details &amp; Action Taken</th>
                    <th className="px-4 py-3">Urgency &amp; Status</th>
                    <th className="px-4 py-3">Officer</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No visitor assistance logs match the specified filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const urgencyColor =
                        log.urgencyLevel === 'Emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : log.urgencyLevel === 'Urgent'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700';

                      const statusColor =
                        log.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'Referred'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800';

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{log.visitorName}</div>
                            <div className="text-[10px] text-slate-500">
                              {log.visitorOrigin || 'Origin Unspecified'} • {log.groupSize ? `${log.groupSize} pax` : 'Solo'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.contact}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                              {log.inquiryChannel || 'Walk-in Desk'}
                            </span>
                            <div className="text-[11px] font-medium text-slate-600 mt-1">
                              {log.assistanceType}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-teal-800">
                              {log.destinationInterest || 'General Municipality'}
                            </div>
                            <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="text-[11px] text-slate-800 line-clamp-2" title={log.details}>
                              {log.details}
                            </p>
                            <p className="text-[10px] text-emerald-700 font-medium mt-0.5 line-clamp-1" title={log.actionTaken}>
                              ↳ {log.actionTaken}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${urgencyColor}`}>
                                {log.urgencyLevel || 'Standard'}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColor}`}>
                                {log.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[11px] text-slate-600">
                            {log.officerInCharge}
                          </td>
                          <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedSlipLog(log)}
                              className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                              title="Print LGU TIAC Intake & Referral Slip (Form 01)"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            {!isReadOnly && (
                              <button
                                onClick={() => {
                                  const nextStatus =
                                    log.status === 'Resolved'
                                      ? 'Referred'
                                      : log.status === 'Referred'
                                      ? 'Pending Follow-up'
                                      : 'Resolved';
                                  updateTiacLog(log.id, { status: nextStatus });
                                }}
                                className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Cycle Status (Resolved / Referred / Pending)"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {!isReadOnly && (
                              <button
                                onClick={() => {
                                  if (confirm(`Remove visitor assistance record for ${log.visitorName}?`)) {
                                    deleteTiacLog(log.id);
                                  }
                                }}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LOST & FOUND PROPERTY REGISTRY */}
      {activeTab === 'lostfound' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search lost item, location, finder..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={lostCategoryFilter}
                onChange={(e) => setLostCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Electronics / Gadgets">Electronics / Gadgets</option>
                <option value="Personal Items / Bags">Personal Items / Bags</option>
                <option value="Wallets & IDs">Wallets &amp; IDs</option>
                <option value="Documents / Keys">Documents / Keys</option>
                <option value="Apparel & Gear">Apparel &amp; Gear</option>
              </select>

              <select
                value={lostStatusFilter}
                onChange={(e) => setLostStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Vault Statuses</option>
                <option value="Unclaimed">Unclaimed in Vault</option>
                <option value="Claimed by Owner">Claimed by Owner</option>
                <option value="Turned over to PNP">Turned over to PNP</option>
              </select>
            </div>
          </div>

          {/* Lost and Found Grid / Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Property Description &amp; Cat.</th>
                    <th className="px-4 py-3">Recovery Location &amp; Date</th>
                    <th className="px-4 py-3">Turned Over By</th>
                    <th className="px-4 py-3">Custody Vault Location</th>
                    <th className="px-4 py-3">Status / Claim Info</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLostItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No lost and found items currently in registry matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLostItems.map((item) => {
                      const isClaimed = item.status === 'Claimed by Owner';
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{item.itemDescription}</div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              {item.category || 'Personal Items / Bags'}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {item.id}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-800 flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 inline" />
                              {item.locationFound}
                            </div>
                            <div className="text-[10px] text-slate-500">Found: {item.dateFound}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-700">{item.foundBy}</div>
                            <div className="text-[10px] text-slate-400">{item.contactNumber || 'No contact provided'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-mono text-slate-800 text-[11px] bg-slate-100 px-2 py-1 rounded inline-block">
                              {item.storageLocation || 'TIAC Vault Cabinet'}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Custodian: {item.custodyOfficer || 'TIAC Staff'}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isClaimed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'Turned over to PNP'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.status}
                            </span>
                            {item.claimantName && (
                              <div className="text-[10px] text-slate-600 mt-1 font-medium">
                                Claimed by: <span className="font-semibold">{item.claimantName}</span>
                              </div>
                            )}
                            {item.dateClaimed && (
                              <div className="text-[10px] text-slate-400">{item.dateClaimed}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedReceiptItem(item)}
                              className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Print LGU TIAC Property Receipt (Form 02)"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {!isReadOnly && !isClaimed && (
                              <button
                                onClick={() => {
                                  setSelectedItemToClaim(item);
                                  setIsClaimModalOpen(true);
                                }}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-colors"
                              >
                                Release to Owner
                              </button>
                            )}

                            {!isReadOnly && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete lost property item "${item.itemDescription}"?`)) {
                                    deleteLostItem(item.id);
                                  }
                                }}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: EMERGENCY RESPONSE & REFERRAL DESK */}
      {activeTab === 'emergency' && (
        <div className="space-y-6">
          {/* Emergency Hotlines Emergency Bar */}
          <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-rose-700/40">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="p-3 bg-rose-600 rounded-xl animate-pulse text-white">
                  <LifeBuoy className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-white">
                    Municipality of Malungon Emergency Coordination Hotlines
                  </h3>
                  <p className="text-xs text-rose-200">
                    24/7 direct inter-agency dispatch with MDRRMO Rescue 911, PNP Malungon, Municipal Health Office, and BFP
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
                <div className="bg-rose-800/60 p-2 rounded-lg border border-rose-500/30 text-center">
                  <div className="text-[10px] font-bold text-rose-300 uppercase">MDRRMO Rescue 911</div>
                  <div className="text-xs font-mono font-bold text-white">0917-843-7372</div>
                </div>
                <div className="bg-rose-800/60 p-2 rounded-lg border border-rose-500/30 text-center">
                  <div className="text-[10px] font-bold text-rose-300 uppercase">PNP Malungon</div>
                  <div className="text-xs font-mono font-bold text-white">0998-598-7278</div>
                </div>
                <div className="bg-rose-800/60 p-2 rounded-lg border border-rose-500/30 text-center">
                  <div className="text-[10px] font-bold text-rose-300 uppercase">Health Office (MHO)</div>
                  <div className="text-xs font-mono font-bold text-white">(083) 554-0021</div>
                </div>
                <div className="bg-rose-800/60 p-2 rounded-lg border border-rose-500/30 text-center">
                  <div className="text-[10px] font-bold text-rose-300 uppercase">TIAC Hotline</div>
                  <div className="text-xs font-mono font-bold text-white">0966-451-9284</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Incidents Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Incident Emergency &amp; Response Dispatch Logs</h3>
                <p className="text-xs text-slate-500">Real-time tracking of visitor incidents, medical cases, trail rescues, and vehicle breakdowns</p>
              </div>
              <div className="text-xs font-semibold text-slate-600">
                {filteredEmergencies.length} Recorded Incidents
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Incident # &amp; Date</th>
                    <th className="px-4 py-3">Incident Type &amp; Location</th>
                    <th className="px-4 py-3">Reported By &amp; Contact</th>
                    <th className="px-4 py-3">Responding Agencies</th>
                    <th className="px-4 py-3">Actions Taken</th>
                    <th className="px-4 py-3">Outcome Status</th>
                    {!isReadOnly && <th className="px-4 py-3 text-right">Update Status</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmergencies.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No active emergency cases currently logged. All municipal tourism zones clear.
                      </td>
                    </tr>
                  ) : (
                    filteredEmergencies.map((emg) => {
                      const isActive = emg.outcomeStatus === 'Active / Responding';
                      return (
                        <tr key={emg.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono font-bold text-rose-700">{emg.incidentNumber}</span>
                            <div className="text-[10px] text-slate-500 mt-0.5">{emg.timestamp}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900">{emg.incidentType}</span>
                            <div className="text-[11px] text-slate-600 flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 mr-1" />
                              {emg.location}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-800">{emg.reportedBy}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{emg.contactNumber}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {emg.respondingAgencies.map((agency, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                  {agency}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="text-[11px] text-slate-700">{emg.actionsTaken}</p>
                            <div className="text-[10px] text-slate-400 mt-1">Officer: {emg.officerInCharge}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-rose-500 text-white animate-pulse'
                                  : emg.outcomeStatus === 'Stabilized & Transported'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {emg.outcomeStatus}
                            </span>
                          </td>
                          {!isReadOnly && (
                            <td className="px-4 py-3 text-right">
                              <select
                                value={emg.outcomeStatus}
                                onChange={(e) =>
                                  updateEmergencyLog(emg.id, {
                                    outcomeStatus: e.target.value as EmergencyCaseLog['outcomeStatus']
                                  })
                                }
                                className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none"
                              >
                                <option value="Active / Responding">Active / Responding</option>
                                <option value="Stabilized & Transported">Stabilized &amp; Transported</option>
                                <option value="Resolved On-site">Resolved On-site</option>
                              </select>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Referral Services Registry Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 mb-1 flex items-center">
              <Share2 className="w-4 h-4 text-teal-600 mr-2" />
              Municipal Referral &amp; Guide Dispatch Directory
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Authorized municipal referral service desk connecting tourists with certified guides, habal-habal transport, and homestays
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-xs text-teal-800 mb-1">Accredited Tour Guides Guild</div>
                <p className="text-[11px] text-slate-600 mb-2">DOT &amp; LGU-trained Tagakaolo &amp; Blaan cultural guides for Kalon Barak &amp; Lamlifew Village.</p>
                <div className="text-[10px] font-semibold text-slate-700">Dispatch Desk: 0917-552-1982</div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-xs text-blue-800 mb-1">MHODA Tourist Transport Assoc.</div>
                <p className="text-[11px] text-slate-600 mb-2">DOT accredited motorcycle/habal-habal and 4x4 pickup shuttle service to mountain viewing ridges.</p>
                <div className="text-[10px] font-semibold text-slate-700">Dispatch Desk: 0928-331-4820</div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-xs text-purple-800 mb-1">Community Homestays Network</div>
                <p className="text-[11px] text-slate-600 mb-2">Verified local homestay referrals and reservation desk for mountain overnight visitors.</p>
                <div className="text-[10px] font-semibold text-slate-700">TIAC Desk Ext: 104</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: VISITOR CSAT & FEEDBACK SURVEYS */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* CSAT Metric Scorecards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Overall Satisfaction</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-amber-600">{avgCsat}</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <div className="flex text-amber-400 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Cleanliness &amp; Environment</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-emerald-600">4.8</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-1">Zero-litter trail compliance</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Safety &amp; Signages</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-blue-600">4.9</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <div className="text-[10px] text-blue-700 font-medium mt-1">Active emergency trail patrols</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 mb-1">Would Recommend Malungon</div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-teal-600">{recommendPercent}%</span>
                <span className="text-xs text-slate-400">Promoters</span>
              </div>
              <div className="text-[10px] text-teal-700 font-medium mt-1">High Net Promoter Score</div>
            </div>
          </div>

          {/* Feedback Cards & Feed */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Tourist Feedback &amp; Survey Submissions</h3>
                <p className="text-xs text-slate-500">Visitor comments, ratings, and recommendations gathered at TIAC desks and online feedback QR codes</p>
              </div>
              <div className="text-xs font-semibold text-slate-600">
                {filteredFeedback.length} Feedback Surveys
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredFeedback.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No feedback records found matching search filters.
                </div>
              ) : (
                filteredFeedback.map((fb) => (
                  <div key={fb.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{fb.visitorName}</span>
                        <span className="text-xs text-slate-400">• {fb.visitorOrigin}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                          {fb.destinationVisited}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex text-amber-400">
                          {Array.from({ length: fb.overallRating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{fb.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                      &quot;{fb.comments}&quot;
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] text-slate-500">
                      <span>Cleanliness: <strong className="text-slate-700">{fb.cleanlinessRating}/5</strong></span>
                      <span>Safety: <strong className="text-slate-700">{fb.safetyRating}/5</strong></span>
                      <span>Hospitality: <strong className="text-slate-700">{fb.hospitalityRating}/5</strong></span>
                      <span className={fb.recommendToOthers ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                        {fb.recommendToOthers ? '✓ Highly Recommends Malungon' : 'Does Not Recommend'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: FRONTLINE FAQ & KNOWLEDGE DIRECTORY */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search FAQ question or answer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={faqCategoryFilter}
                onChange={(e) => setFaqCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Logistics & Travel">Logistics &amp; Travel</option>
                <option value="Attractions & Permits">Attractions &amp; Permits</option>
                <option value="Accommodations & Rates">Accommodations &amp; Rates</option>
                <option value="Culture & Etiquette">Culture &amp; Etiquette</option>
                <option value="Emergency & Safety">Emergency &amp; Safety</option>
              </select>
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFaqs.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-slate-400 bg-white rounded-xl border border-slate-200">
                No FAQ items found matching query.
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {faq.category}
                      </span>
                      {faq.relatedDestinations && (
                        <span className="text-[10px] text-slate-400">{faq.relatedDestinations}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mb-2 flex items-start">
                      <HelpCircle className="w-4 h-4 text-blue-600 mr-1.5 shrink-0 mt-0.5" />
                      {faq.question}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span>Malungon Tourism Frontline Reference</span>
                    <span className="font-mono">ID: {faq.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: LOG VISITOR ASSISTANCE */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Log Frontline Visitor Assistance</h3>
                <p className="text-xs text-teal-200">Record tourist walk-in or digital frontline reception</p>
              </div>
              <button onClick={() => setIsLogModalOpen(false)} className="text-teal-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateLog} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Visitor / Head of Group</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={logForm.visitorName}
                    onChange={(e) => setLogForm({ ...logForm, visitorName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    required
                    value={logForm.contact}
                    onChange={(e) => setLogForm({ ...logForm, contact: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Origin / City</label>
                  <input
                    type="text"
                    value={logForm.visitorOrigin}
                    onChange={(e) => setLogForm({ ...logForm, visitorOrigin: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Group Size (Pax)</label>
                  <input
                    type="number"
                    min="1"
                    value={logForm.groupSize}
                    onChange={(e) => setLogForm({ ...logForm, groupSize: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Channel</label>
                  <select
                    value={logForm.inquiryChannel}
                    onChange={(e) => setLogForm({ ...logForm, inquiryChannel: e.target.value as VisitorAssistanceLog['inquiryChannel'] })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Walk-in Desk">Walk-in Desk</option>
                    <option value="Phone Hotline">Phone Hotline</option>
                    <option value="Email">Email</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Tourism Booth">Tourism Booth</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assistance Type</label>
                  <select
                    value={logForm.assistanceType}
                    onChange={(e) => setLogForm({ ...logForm, assistanceType: e.target.value as VisitorAssistanceLog['assistanceType'] })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Walk-in Inquiries">Walk-in Inquiries</option>
                    <option value="Online / Telephone Inquiry">Online / Telephone Inquiry</option>
                    <option value="Referral / Guide Booking">Referral / Guide Booking</option>
                    <option value="Information Requests">Information Requests</option>
                    <option value="Emergency Assistance">Emergency Assistance</option>
                    <option value="Lost & Found">Lost &amp; Found</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Interest</label>
                  <input
                    type="text"
                    value={logForm.destinationInterest}
                    onChange={(e) => setLogForm({ ...logForm, destinationInterest: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={logForm.urgencyLevel}
                    onChange={(e) => setLogForm({ ...logForm, urgencyLevel: e.target.value as VisitorAssistanceLog['urgencyLevel'] })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry / Request Details</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Inquiry about Kalon Barak camping permits, sunset schedules, and 4x4 transport..."
                  value={logForm.details}
                  onChange={(e) => setLogForm({ ...logForm, details: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Action Taken / Frontline Resolution</label>
                <textarea
                  rows={2}
                  value={logForm.actionTaken}
                  onChange={(e) => setLogForm({ ...logForm, actionTaken: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  Save Assistance Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD RECOVERED LOST ITEM */}
      {isLostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-amber-800 to-slate-900 text-white p-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Record Recovered Lost Property</h3>
                <p className="text-xs text-amber-200">Turnover to TIAC Property Custody Vault</p>
              </div>
              <button onClick={() => setIsLostModalOpen(false)} className="text-amber-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateLost} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Black leather wallet with PhilSys ID and cash"
                  value={lostForm.itemDescription}
                  onChange={(e) => setLostForm({ ...lostForm, itemDescription: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={lostForm.category}
                    onChange={(e) => setLostForm({ ...lostForm, category: e.target.value as LostAndFoundItem['category'] })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Electronics / Gadgets">Electronics / Gadgets</option>
                    <option value="Personal Items / Bags">Personal Items / Bags</option>
                    <option value="Wallets & IDs">Wallets &amp; IDs</option>
                    <option value="Documents / Keys">Documents / Keys</option>
                    <option value="Apparel & Gear">Apparel &amp; Gear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date Found</label>
                  <input
                    type="date"
                    required
                    value={lostForm.dateFound}
                    onChange={(e) => setLostForm({ ...lostForm, dateFound: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location Found</label>
                <input
                  type="text"
                  required
                  value={lostForm.locationFound}
                  onChange={(e) => setLostForm({ ...lostForm, locationFound: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Turned Over By (Finder)</label>
                  <input
                    type="text"
                    required
                    value={lostForm.foundBy}
                    onChange={(e) => setLostForm({ ...lostForm, foundBy: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Vault Location</label>
                  <input
                    type="text"
                    value={lostForm.storageLocation}
                    onChange={(e) => setLostForm({ ...lostForm, storageLocation: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLostModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  Confirm Vault Custody
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CLAIM LOST PROPERTY MODAL */}
      {isClaimModalOpen && selectedItemToClaim && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Release Property to Owner</h3>
                <p className="text-xs text-emerald-200">Verify identification prior to turnover</p>
              </div>
              <button onClick={() => setIsClaimModalOpen(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmClaim} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                <div className="font-semibold text-slate-900">{selectedItemToClaim.itemDescription}</div>
                <div className="text-[11px] text-slate-500 mt-1">Found at: {selectedItemToClaim.locationFound} ({selectedItemToClaim.dateFound})</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Verified Claimant Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan dela Cruz"
                  value={claimantNameInput}
                  onChange={(e) => setClaimantNameInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Claimant Contact Number</label>
                <input
                  type="text"
                  required
                  placeholder="+63 917 123 4567"
                  value={claimantContactInput}
                  onChange={(e) => setClaimantContactInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Government ID Presented</label>
                <select
                  value={claimantIdPresented}
                  onChange={(e) => setClaimantIdPresented(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                >
                  <option value="PhilSys National ID">PhilSys National ID</option>
                  <option value="Passport">Philippine Passport</option>
                  <option value="Driver's License">Driver&apos;s License (LTO)</option>
                  <option value="UMID / SSS">UMID / SSS</option>
                  <option value="PRC License">PRC License</option>
                  <option value="Voter's ID">Voter&apos;s ID / Barangay ID</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  Confirm Release &amp; Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: LOG EMERGENCY INCIDENT */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-rose-800 to-slate-900 text-white p-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Log Tourism Emergency Incident</h3>
                <p className="text-xs text-rose-200">Alert MDRRMO 911, PNP, and Municipal Health</p>
              </div>
              <button onClick={() => setIsEmergencyModalOpen(false)} className="text-rose-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateEmergency} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Number</label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={emergencyForm.incidentNumber}
                    className="w-full px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Type</label>
                  <select
                    value={emergencyForm.incidentType}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, incidentType: e.target.value as EmergencyCaseLog['incidentType'] })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Medical Assistance">Medical Assistance</option>
                    <option value="Trail Incident / Lost Hiker">Trail Incident / Lost Hiker</option>
                    <option value="Vehicular Breakdown">Vehicular Breakdown</option>
                    <option value="Weather Advisory Distress">Weather Advisory Distress</option>
                    <option value="Minor Injury">Minor Injury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exact Location of Incident</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kalon Barak Eco-Park Trailhead Marker 3"
                  value={emergencyForm.location}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, location: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reported By</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ranger J. Alcala"
                    value={emergencyForm.reportedBy}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, reportedBy: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    required
                    value={emergencyForm.contactNumber}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, contactNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Actions Taken / Dispatch Summary</label>
                <textarea
                  rows={3}
                  required
                  value={emergencyForm.actionsTaken}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, actionsTaken: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  Dispatch &amp; Save Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: SUBMIT TOURIST FEEDBACK */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Tourist CSAT &amp; Feedback Survey</h3>
                <p className="text-xs text-emerald-200">Record visitor review and rating</p>
              </div>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="text-emerald-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateFeedback} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Visitor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Carlo Mendoza"
                    value={feedbackForm.visitorName}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, visitorName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Visitor Origin</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Davao City"
                    value={feedbackForm.visitorOrigin}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, visitorOrigin: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Visited</label>
                <input
                  type="text"
                  required
                  value={feedbackForm.destinationVisited}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, destinationVisited: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Overall (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={feedbackForm.overallRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, overallRating: parseInt(e.target.value) || 5 })}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cleanliness</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={feedbackForm.cleanlinessRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, cleanlinessRating: parseInt(e.target.value) || 5 })}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Safety</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={feedbackForm.safetyRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, safetyRating: parseInt(e.target.value) || 5 })}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hospitality</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={feedbackForm.hospitalityRating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, hospitalityRating: parseInt(e.target.value) || 5 })}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Visitor Comments / Testimonial</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Remarkable cool climate and welcoming Blaan cultural community..."
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recommendCheck"
                  checked={feedbackForm.recommendToOthers}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, recommendToOthers: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="recommendCheck" className="text-xs font-semibold text-slate-700">
                  Visitor would actively recommend Malungon to fellow tourists (NPS Promoter)
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD FAQ ITEM */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-blue-800 to-slate-900 text-white p-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Add Frontline FAQ Entry</h3>
                <p className="text-xs text-blue-200">Expand TIAC staff quick-reference knowledge directory</p>
              </div>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-blue-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateFaq} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value as FAQItem['category'] })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Logistics & Travel">Logistics &amp; Travel</option>
                    <option value="Attractions & Permits">Attractions &amp; Permits</option>
                    <option value="Accommodations & Rates">Accommodations &amp; Rates</option>
                    <option value="Culture & Etiquette">Culture & Etiquette</option>
                    <option value="Emergency & Safety">Emergency &amp; Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Related Destinations</label>
                  <input
                    type="text"
                    value={faqForm.relatedDestinations}
                    onChange={(e) => setFaqForm({ ...faqForm, relatedDestinations: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Frequently Asked Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Are pets allowed at Kalon Barak Ridge?"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Desk Answer</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Official municipal policy, fees, or regulations..."
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  Save FAQ Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL 1: LGU TIAC FORM 01 - VISITOR ASSISTANCE INTAKE & REFERRAL SLIP */}
      {selectedSlipLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6">
              {/* Printable Document Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                <div className="text-xs uppercase tracking-widest font-semibold text-slate-500">
                  Republic of the Philippines • Province of Sarangani
                </div>
                <div className="text-lg font-black text-slate-900 uppercase">
                  Municipality of Malungon
                </div>
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                  Municipal Tourism Office — Tourism Information &amp; Assistance Center (TIAC)
                </div>
                <div className="mt-2 inline-block px-3 py-1 bg-teal-800 text-white text-xs font-bold uppercase tracking-wider rounded">
                  LGU TIAC FORM 01: Official Visitor Assistance &amp; Referral Slip
                </div>
              </div>

              {/* Reference & Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Control Reference No.:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedSlipLog.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date &amp; Time Logged:</span>
                  <span className="font-semibold text-slate-800">{selectedSlipLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Inquiry Channel:</span>
                  <span className="font-semibold text-slate-800">{selectedSlipLog.inquiryChannel || 'Walk-in Desk'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Urgency Classification:</span>
                  <span className="font-semibold text-slate-800">{selectedSlipLog.urgencyLevel || 'Standard'}</span>
                </div>
              </div>

              {/* Visitor Profile */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2 border-b pb-1">
                  1. Visitor Demographics &amp; Party
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Visitor / Group Leader:</span>
                    <span className="font-bold text-slate-900">{selectedSlipLog.visitorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Origin:</span>
                    <span className="font-semibold text-slate-800">{selectedSlipLog.visitorOrigin || 'Unspecified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Party Size:</span>
                    <span className="font-semibold text-slate-800">{selectedSlipLog.groupSize ? `${selectedSlipLog.groupSize} Persons` : '1 Person'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact Info:</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedSlipLog.contact}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Destination of Interest:</span>
                    <span className="font-semibold text-teal-800">{selectedSlipLog.destinationInterest || 'Municipality-wide'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Assistance Category:</span>
                    <span className="font-semibold text-slate-800">{selectedSlipLog.assistanceType}</span>
                  </div>
                </div>
              </div>

              {/* Inquiry & Action Taken */}
              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-700 mb-1 border-b pb-1">
                    2. Specific Inquiries / Tourism Services Requested
                  </h4>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 leading-relaxed">
                    {selectedSlipLog.details}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-700 mb-1 border-b pb-1">
                    3. Frontline Action Taken &amp; Referral Endorsement
                  </h4>
                  <div className="p-3 bg-teal-50/50 rounded border border-teal-200 text-xs text-slate-800 leading-relaxed">
                    {selectedSlipLog.actionTaken}
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-300">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    {selectedSlipLog.visitorName}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Tourist / Inquirer Signature
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    {selectedSlipLog.officerInCharge}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Attending TIAC Officer / Desk Custodian
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-2 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => setSelectedSlipLog(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow flex items-center"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Official Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL 2: LGU TIAC FORM 02 - LOST AND FOUND TURNOVER & CLAIM RECEIPT */}
      {selectedReceiptItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6">
              {/* Printable Document Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                <div className="text-xs uppercase tracking-widest font-semibold text-slate-500">
                  Republic of the Philippines • Province of Sarangani
                </div>
                <div className="text-lg font-black text-slate-900 uppercase">
                  Municipality of Malungon
                </div>
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  Municipal Tourism Office — Property Custody &amp; Vault Desk
                </div>
                <div className="mt-2 inline-block px-3 py-1 bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded">
                  LGU TIAC FORM 02: Lost and Found Property Turnover &amp; Claim Receipt
                </div>
              </div>

              {/* Reference & Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Property Tag ID:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReceiptItem.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date Recovered:</span>
                  <span className="font-semibold text-slate-800">{selectedReceiptItem.dateFound}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Category:</span>
                  <span className="font-semibold text-slate-800">{selectedReceiptItem.category || 'Personal Property'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Vault Location:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedReceiptItem.storageLocation || 'TIAC Vault'}</span>
                </div>
              </div>

              {/* Property Specs */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2 border-b pb-1">
                  1. Recovered Property Description
                </h4>
                <div className="p-3 bg-amber-50/50 rounded border border-amber-200 text-xs font-semibold text-slate-900 mb-2">
                  {selectedReceiptItem.itemDescription}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Location Found:</span>
                    <span className="font-semibold text-slate-800">{selectedReceiptItem.locationFound}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Turned Over By (Finder):</span>
                    <span className="font-semibold text-slate-800">{selectedReceiptItem.foundBy}</span>
                  </div>
                </div>
              </div>

              {/* Claim Verification */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2 border-b pb-1">
                  2. Verification &amp; Release Status
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Current Status:</span>
                    <span className="font-bold text-emerald-700 uppercase">{selectedReceiptItem.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Claimant / Owner Name:</span>
                    <span className="font-bold text-slate-900">{selectedReceiptItem.claimantName || 'Pending Claim Verification'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Release:</span>
                    <span className="font-semibold text-slate-800">{selectedReceiptItem.dateClaimed || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Custody Officer:</span>
                    <span className="font-semibold text-slate-800">{selectedReceiptItem.custodyOfficer || 'TIAC Custodian'}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-300">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    {selectedReceiptItem.claimantName || '___________________________'}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Claimant / Owner Signature
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    {selectedReceiptItem.custodyOfficer || currentUser?.name || 'TIAC Property Custodian'}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    TIAC Property Vault Custodian
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-2 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => setSelectedReceiptItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow flex items-center"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Official Property Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
