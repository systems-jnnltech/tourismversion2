import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Video,
  FileText,
  Compass,
  Download,
  Share2,
  Users,
  Eye,
  Calendar,
  ExternalLink,
  Award,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Printer,
  X,
  Building2,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Image as ImageIcon,
  Radio,
  Tv,
  Camera,
  CheckCircle2,
  DollarSign,
  Layers,
  MapPin,
  Sparkles,
  Link2
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import {
  MarketingCampaign,
  MarketingCollateralItem,
  MarketingPartner,
  CollateralCategory,
} from '../../types';

export const MarketingPromotionView: React.FC = () => {
  const {
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    marketingCollaterals,
    addCollateral,
    deleteCollateral,
    marketingPartners,
    addPartner,
    deletePartner,
    isReadOnly,
    municipalityInfo,
    currentUser,
  } = useTourism();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'campaigns' | 'collaterals' | 'calendar' | 'partnerships'>('campaigns');

  // Search and Filters for Campaigns
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Search and Filter for Collaterals
  const [collateralCategory, setCollateralCategory] = useState<string>('all');

  // Search and Filter for Partners
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<string>('all');

  // Modal States
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<MarketingCampaign | null>(null);

  // Collateral Modal State
  const [isCollateralModalOpen, setIsCollateralModalOpen] = useState(false);

  // Partner Modal State
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  // Print Form Modals
  const [isPrintBriefOpen, setIsPrintBriefOpen] = useState(false);
  const [isPrintLiquidationOpen, setIsPrintLiquidationOpen] = useState(false);
  const [formCampaign, setFormCampaign] = useState<MarketingCampaign | null>(null);

  // Campaign Form State
  const initialCampaignForm: Omit<MarketingCampaign, 'id'> = {
    campaignTitle: '',
    type: 'Promotional Campaign',
    targetAudience: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    budget: 350000,
    actualExpenses: 280000,
    channels: ['Facebook Reels', 'TikTok', 'Regional Roadshow'],
    leadPartner: 'DOT Region XII & Sarangani Tourism Board',
    status: 'Active',
    deliverablesSummary: '',
    keyDeliverables: [],
    viewsOrReach: 150000,
    roiLeadsGenerated: 1200,
    campaignManager: currentUser.name || 'CRISTINA D. CONSTANTINO-LA PAZ',
  };
  const [campaignFormData, setCampaignFormData] = useState<Omit<MarketingCampaign, 'id'>>(initialCampaignForm);
  const [channelsInput, setChannelsInput] = useState('Facebook Reels, TikTok, Regional Roadshow');
  const [deliverablesInput, setDeliverablesInput] = useState('');

  // Collateral Form State
  const initialCollateralForm: Omit<MarketingCollateralItem, 'id'> = {
    title: '',
    category: 'Brochure',
    targetAudience: 'Domestic Tourists, Walk-in Guests',
    fileFormat: 'Print PDF (300 DPI)',
    dimensionsOrDuration: '8.5 x 11 inches',
    quantityOrCopies: 5000,
    storageLocationOrUrl: 'Municipal Tourism Office & TIAC Outposts',
    dateProduced: new Date().toISOString().split('T')[0],
    status: 'In Distribution',
  };
  const [collateralFormData, setCollateralFormData] = useState<Omit<MarketingCollateralItem, 'id'>>(initialCollateralForm);

  // Partner Form State
  const initialPartnerForm: Omit<MarketingPartner, 'id'> = {
    name: '',
    type: 'Media Partner',
    contactPerson: '',
    contactDetails: '',
    reachAudience: '',
    collaborationScope: '',
    status: 'Active Partner',
  };
  const [partnerFormData, setPartnerFormData] = useState<Omit<MarketingPartner, 'id'>>(initialPartnerForm);

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch =
        c.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.leadPartner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || c.type === filterType;
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [campaigns, searchQuery, filterType, filterStatus]);

  // Filtered Collaterals
  const filteredCollaterals = useMemo(() => {
    return marketingCollaterals.filter((col) => {
      return collateralCategory === 'all' || col.category === collateralCategory;
    });
  }, [marketingCollaterals, collateralCategory]);

  // Filtered Partners
  const filteredPartners = useMemo(() => {
    return marketingPartners.filter((p) => {
      return partnerTypeFilter === 'all' || p.type === partnerTypeFilter;
    });
  }, [marketingPartners, partnerTypeFilter]);

  // KPI Metrics
  const metrics = useMemo(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter((c) => c.status === 'Active').length;
    const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0);
    const totalReach = campaigns.reduce((acc, c) => acc + c.viewsOrReach, 0);
    const totalLeads = campaigns.reduce((acc, c) => acc + (c.roiLeadsGenerated || 0), 0);
    const totalCollaterals = marketingCollaterals.length;
    return { totalCampaigns, activeCampaigns, totalBudget, totalReach, totalLeads, totalCollaterals };
  }, [campaigns, marketingCollaterals]);

  // Handlers for Campaigns
  const handleOpenAddCampaign = () => {
    setCampaignFormData(initialCampaignForm);
    setChannelsInput('Facebook Reels, TikTok, Regional Roadshow');
    setDeliverablesInput('');
    setIsEditingCampaign(false);
    setIsCampaignModalOpen(true);
  };

  const handleOpenEditCampaign = (camp: MarketingCampaign) => {
    setSelectedCampaign(camp);
    setCampaignFormData({
      campaignTitle: camp.campaignTitle,
      type: camp.type,
      targetAudience: camp.targetAudience,
      startDate: camp.startDate,
      endDate: camp.endDate,
      budget: camp.budget,
      actualExpenses: camp.actualExpenses || Math.round(camp.budget * 0.9),
      channels: camp.channels,
      leadPartner: camp.leadPartner,
      status: camp.status,
      deliverablesSummary: camp.deliverablesSummary,
      keyDeliverables: camp.keyDeliverables || [],
      viewsOrReach: camp.viewsOrReach,
      roiLeadsGenerated: camp.roiLeadsGenerated || 0,
      campaignManager: camp.campaignManager || 'CRISTINA D. CONSTANTINO-LA PAZ',
    });
    setChannelsInput(camp.channels.join(', '));
    setDeliverablesInput(camp.keyDeliverables ? camp.keyDeliverables.join(', ') : '');
    setIsEditingCampaign(true);
    setIsCampaignModalOpen(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedChannels = channelsInput
      ? channelsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const parsedDeliverables = deliverablesInput
      ? deliverablesInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...campaignFormData,
      channels: parsedChannels,
      keyDeliverables: parsedDeliverables,
    };

    if (isEditingCampaign && selectedCampaign) {
      updateCampaign(selectedCampaign.id, payload);
    } else {
      addCampaign(payload);
    }

    setIsCampaignModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (campaignToDelete) {
      deleteCampaign(campaignToDelete.id);
      setIsDeleteModalOpen(false);
      setCampaignToDelete(null);
      if (selectedCampaign?.id === campaignToDelete.id) {
        setIsDossierOpen(false);
      }
    }
  };

  // Handlers for Collateral
  const handleSaveCollateral = (e: React.FormEvent) => {
    e.preventDefault();
    addCollateral(collateralFormData);
    setIsCollateralModalOpen(false);
    setCollateralFormData(initialCollateralForm);
  };

  // Handlers for Partner
  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    addPartner(partnerFormData);
    setIsPartnerModalOpen(false);
    setPartnerFormData(initialPartnerForm);
  };

  // CSV Export for Campaigns
  const handleExportCampaignsCsv = () => {
    const headers = [
      'Campaign ID',
      'Campaign Title',
      'Type',
      'Target Audience',
      'Start Date',
      'End Date',
      'Budget (PHP)',
      'Actual Expenses (PHP)',
      'Reach / Views',
      'Leads Generated',
      'Lead Partner',
      'Status',
    ];
    const rows = filteredCampaigns.map((c) => [
      c.id,
      `"${c.campaignTitle.replace(/"/g, '""')}"`,
      c.type,
      `"${c.targetAudience.replace(/"/g, '""')}"`,
      c.startDate,
      c.endDate,
      c.budget,
      c.actualExpenses || 0,
      c.viewsOrReach,
      c.roiLeadsGenerated || 0,
      `"${c.leadPartner.replace(/"/g, '""')}"`,
      c.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MTODMS_Marketing_Campaigns_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Export for Collaterals
  const handleExportCollateralsCsv = () => {
    const headers = [
      'Collateral ID',
      'Title',
      'Category',
      'Target Audience',
      'Format',
      'Dimensions / Duration',
      'Quantity / Copies',
      'Storage Location / URL',
      'Date Produced',
      'Status',
    ];
    const rows = marketingCollaterals.map((col) => [
      col.id,
      `"${col.title.replace(/"/g, '""')}"`,
      col.category,
      `"${col.targetAudience.replace(/"/g, '""')}"`,
      col.fileFormat,
      col.dimensionsOrDuration,
      col.quantityOrCopies,
      `"${col.storageLocationOrUrl.replace(/"/g, '""')}"`,
      col.dateProduced,
      col.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MTODMS_Marketing_Collaterals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">
            <Megaphone className="w-4 h-4" />
            <span>MODULE K • Brand Visibility & Market Outreach</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Promotion and Marketing Unit (PMU)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tourism branding campaigns, travel expos, video documentaries, influencer familiarization tours, and marketing collateral inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCampaignsCsv}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Campaigns</span>
          </button>
          {!isReadOnly && (
            <button
              onClick={handleOpenAddCampaign}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Campaign</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Campaigns</span>
            <Megaphone className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics.totalCampaigns}</div>
          <div className="text-[11px] text-orange-700 font-medium mt-0.5">
            {metrics.activeCampaigns} currently active
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Cumulative Reach</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {(metrics.totalReach / 1000).toFixed(0)}K+
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-0.5">Views & impressions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Marketing Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ₱{(metrics.totalBudget / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Appropriated pool</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Visitor Leads</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics.totalLeads.toLocaleString()}</div>
          <div className="text-[11px] text-purple-700 font-medium mt-0.5">Direct trade/inquiries</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Collateral Items</span>
            <ImageIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics.totalCollaterals}</div>
          <div className="text-[11px] text-indigo-700 font-medium mt-0.5">Videos, maps & prints</div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'campaigns'
              ? 'bg-white border-t border-l border-r border-slate-200 text-orange-700 -mb-px'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>1. Promotional Campaigns</span>
          <span className="ml-1 px-1.5 py-0.2 bg-orange-100 text-orange-800 rounded-full text-[10px]">
            {campaigns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('collaterals')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'collaterals'
              ? 'bg-white border-t border-l border-r border-slate-200 text-orange-700 -mb-px'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>2. Collateral Database</span>
          <span className="ml-1 px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full text-[10px]">
            {marketingCollaterals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'calendar'
              ? 'bg-white border-t border-l border-r border-slate-200 text-orange-700 -mb-px'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>3. Marketing Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('partnerships')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'partnerships'
              ? 'bg-white border-t border-l border-r border-slate-200 text-orange-700 -mb-px'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>4. Expos, Media & Influencers</span>
          <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px]">
            {marketingPartners.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PROMOTIONAL CAMPAIGNS */}
      {/* ========================================================= */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaign, audience, partner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">All Campaign Types</option>
                <option value="Promotional Campaign">Promotional Campaign</option>
                <option value="Tourism Video">Tourism Video</option>
                <option value="Travel Fair / Expo">Travel Fair / Expo</option>
                <option value="Influencer Fam Tour">Influencer Fam Tour</option>
                <option value="Digital Poster">Digital Poster</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="In Production">In Production</option>
              </select>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-orange-300 transition-all"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200">
                      {camp.type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        camp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : camp.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  <div>
                    <h4
                      onClick={() => { setSelectedCampaign(camp); setIsDossierOpen(true); }}
                      className="font-bold text-slate-900 text-base hover:text-orange-700 cursor-pointer transition-colors"
                    >
                      {camp.campaignTitle}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{camp.deliverablesSummary}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {camp.channels.map((chan, chIdx) => (
                      <span key={chIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {chan}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Reach / Views:</span>
                      <span className="font-mono font-bold text-slate-900">{camp.viewsOrReach.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Budget Pool:</span>
                      <span className="font-mono font-bold text-emerald-700">₱{camp.budget.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Inquiries:</span>
                      <span className="font-bold text-purple-700">{camp.roiLeadsGenerated || 0} leads</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Lead: <strong className="text-slate-800">{camp.leadPartner}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setSelectedCampaign(camp); setIsDossierOpen(true); }}
                      className="p-1 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                      title="View Campaign Dossier"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setFormCampaign(camp); setIsPrintBriefOpen(true); }}
                      className="p-1 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                      title="Print Campaign Brief (LGU Form 01)"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setFormCampaign(camp); setIsPrintLiquidationOpen(true); }}
                      className="p-1 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                      title="Print Evaluation Report (LGU Form 02)"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    {!isReadOnly && (
                      <>
                        <button
                          onClick={() => handleOpenEditCampaign(camp)}
                          className="p-1 hover:bg-orange-100 text-orange-700 rounded transition-colors"
                          title="Edit Campaign"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setCampaignToDelete(camp); setIsDeleteModalOpen(true); }}
                          className="p-1 hover:bg-rose-100 text-rose-700 rounded transition-colors"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MARKETING COLLATERAL DATABASE */}
      {/* ========================================================= */}
      {activeTab === 'collaterals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Official Promotional Collateral Inventory</h3>
              <p className="text-xs text-slate-500">
                Videos, folded brochures, tourist maps, event tarpaulins, billboards, and digital posters
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCollateralsCsv}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Collateral</span>
              </button>
              {!isReadOnly && (
                <button
                  onClick={() => { setCollateralFormData(initialCollateralForm); setIsCollateralModalOpen(true); }}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Collateral</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {['all', 'Tourism Video', 'Brochure', 'Flyer', 'Tarpaulin / Billboard', 'Digital Poster'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCollateralCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  collateralCategory === cat
                    ? 'bg-orange-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'All Formats' : cat}
              </button>
            ))}
          </div>

          {/* Collateral Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCollaterals.map((col) => (
              <div
                key={col.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3 hover:border-orange-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {col.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {col.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{col.title}</h4>
                  <div className="text-[11px] text-slate-500">
                    Target: <strong>{col.targetAudience}</strong>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Specs:</span>
                      <span className="font-medium text-slate-700">{col.dimensionsOrDuration}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">File / Stock:</span>
                      <span className="font-mono font-medium text-slate-700">{col.quantityOrCopies.toLocaleString()} units</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Date:</span>
                      <span className="text-slate-600">{col.dateProduced}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 truncate" title={col.storageLocationOrUrl}>
                    Location: <span className="text-slate-700">{col.storageLocationOrUrl}</span>
                  </div>
                </div>

                {!isReadOnly && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => deleteCollateral(col.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete Collateral"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MARKETING CALENDAR & ROADMAP */}
      {/* ========================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">2026 Integrated Tourism Marketing Schedule</h3>
            <p className="text-xs text-slate-500 mb-5">
              Phased multi-channel deployment plan aligned with municipal festivals, regional travel marts, and seasonal travel surges
            </p>

            <div className="space-y-4">
              {/* Q1 */}
              <div className="border-l-2 border-orange-500 pl-4 py-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                    Q1 (Jan - Mar 2026)
                  </span>
                  <span className="font-bold text-slate-900 text-xs">Highland Sunrise Campaign & Travel Collateral Ingest</span>
                </div>
                <p className="text-xs text-slate-600">
                  Broadcast release of "Subida Malungon 4K Docuseries" across provincial bus lines and YouTube. Distribution of 10,000 official tourism circuit brochures to airport and highway hubs.
                </p>
              </div>

              {/* Q2 */}
              <div className="border-l-2 border-emerald-500 pl-4 py-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Q2 (Apr - Jun 2026)
                  </span>
                  <span className="font-bold text-slate-900 text-xs">Summer Adventure & Sarangani Provincial Tourism Expo</span>
                </div>
                <p className="text-xs text-slate-600">
                  Execution of Travel Creator Familiarization Tour (8 content creators). Launch of Upper Mainit River Tubing safety guidelines tarpaulins and highway welcome billboards.
                </p>
              </div>

              {/* Q3 */}
              <div className="border-l-2 border-purple-500 pl-4 py-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    Q3 (Jul - Sep 2026)
                  </span>
                  <span className="font-bold text-slate-900 text-xs">57th Slang Festival Blitz & Philippine Travel Mart (PhilTOA)</span>
                </div>
                <p className="text-xs text-slate-600">
                  High-profile thematic tribal pavilion at SMX Pasay generating B2B buyer contracts. Aggressive digital poster advertising on Meta platforms targeting domestic Balikbayans.
                </p>
              </div>

              {/* Q4 */}
              <div className="border-l-2 border-blue-500 pl-4 py-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    Q4 (Oct - Dec 2026)
                  </span>
                  <span className="font-bold text-slate-900 text-xs">Year-End Highland Glamping & Christmas Getaway Push</span>
                </div>
                <p className="text-xs text-slate-600">
                  Promotional packages for Kalon Barak glamping dome stays and holiday retreats. Release of 2027 Annual Tourism Calendar and Coffee Harvest festival teaser reels.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PARTNERSHIPS, EXPOS & INFLUENCERS */}
      {/* ========================================================= */}
      {activeTab === 'partnerships' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Travel Fairs, Media Partners & Content Creators</h3>
              <p className="text-xs text-slate-500">
                Institutional partnerships, travel trade expos (PhilTOA, PHITEX), media outlets, and travel influencers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={partnerTypeFilter}
                onChange={(e) => setPartnerTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">All Partner Types</option>
                <option value="Travel Fair / Expo">Travel Fairs & Expos</option>
                <option value="Media Partner">Media Partners (TV/Radio/Press)</option>
                <option value="Tourism Influencer">Tourism Influencers</option>
                <option value="Industry Association">Industry Associations</option>
              </select>
              {!isReadOnly && (
                <button
                  onClick={() => { setPartnerFormData(initialPartnerForm); setIsPartnerModalOpen(true); }}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enrol Partner</span>
                </button>
              )}
            </div>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPartners.map((p) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {p.type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{p.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Contact: <strong>{p.contactPerson}</strong> • {p.contactDetails}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Audience / Market Reach:</span>
                      <span className="font-medium text-slate-800">{p.reachAudience}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Scope of Collaboration:</span>
                      <span className="text-slate-600 leading-relaxed">{p.collaborationScope}</span>
                    </div>
                  </div>
                </div>

                {!isReadOnly && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => deletePartner(p.id)}
                      className="p-1 hover:bg-rose-50 text-rose-600 rounded transition-colors"
                      title="Delete Partner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CAMPAIGN DOSSIER */}
      {/* ========================================================= */}
      {isDossierOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                  {selectedCampaign.type}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedCampaign.campaignTitle}</h3>
              </div>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <span className="font-bold text-slate-900">{selectedCampaign.status}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Budget Pool</span>
                  <span className="font-mono font-bold text-emerald-700">₱{selectedCampaign.budget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Actual Expenses</span>
                  <span className="font-mono font-bold text-slate-900">₱{(selectedCampaign.actualExpenses || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Reach / Impressions</span>
                  <span className="font-mono font-bold text-purple-700">{selectedCampaign.viewsOrReach.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Target Market Audience:</span>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600">
                  {selectedCampaign.targetAudience}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Deliverables & Deliverable Assets:</span>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600">
                  {selectedCampaign.deliverablesSummary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Lead Institutional Partner:</span>
                  <span className="font-semibold text-slate-800">{selectedCampaign.leadPartner}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Campaign Manager / Officer:</span>
                  <span className="font-semibold text-slate-800">{selectedCampaign.campaignManager || 'CRISTINA D. CONSTANTINO-LA PAZ'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Active Duration:</span>
                  <span className="text-slate-700">{selectedCampaign.startDate} to {selectedCampaign.endDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Leads & Inquiries Generated:</span>
                  <span className="font-bold text-emerald-700">{selectedCampaign.roiLeadsGenerated || 0} direct inquiries</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setFormCampaign(selectedCampaign); setIsPrintBriefOpen(true); }}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Brief (Form 01)</span>
                </button>
                <button
                  onClick={() => { setFormCampaign(selectedCampaign); setIsPrintLiquidationOpen(true); }}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Print Evaluation (Form 02)</span>
                </button>
              </div>

              <button
                onClick={() => setIsDossierOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CAMPAIGN */}
      {/* ========================================================= */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <form onSubmit={handleSaveCampaign}>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-base font-bold text-slate-900">
                  {isEditingCampaign ? 'Edit Marketing Campaign' : 'Launch New Marketing Campaign'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    value={campaignFormData.campaignTitle}
                    onChange={(e) => setCampaignFormData({ ...campaignFormData, campaignTitle: e.target.value })}
                    placeholder="e.g. Subida Malungon: Highland Sunrise Campaign"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Campaign Type *</label>
                    <select
                      value={campaignFormData.type}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Promotional Campaign">Promotional Campaign</option>
                      <option value="Tourism Video">Tourism Video</option>
                      <option value="Brochures / Collateral">Brochures / Collateral</option>
                      <option value="Travel Fair / Expo">Travel Fair / Expo</option>
                      <option value="Digital Poster">Digital Poster</option>
                      <option value="Influencer Fam Tour">Influencer Fam Tour</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Status *</label>
                    <select
                      value={campaignFormData.status}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="In Production">In Production</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Market Audience *</label>
                  <input
                    type="text"
                    required
                    value={campaignFormData.targetAudience}
                    onChange={(e) => setCampaignFormData({ ...campaignFormData, targetAudience: e.target.value })}
                    placeholder="e.g. Eco-tourists, campers, regional day trippers"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={campaignFormData.startDate}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={campaignFormData.endDate}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Budget Allocated (PHP) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={campaignFormData.budget}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, budget: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Actual Expenses (PHP)</label>
                    <input
                      type="number"
                      min="0"
                      value={campaignFormData.actualExpenses || 0}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, actualExpenses: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Projected Reach / Views</label>
                    <input
                      type="number"
                      min="0"
                      value={campaignFormData.viewsOrReach}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, viewsOrReach: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Lead Partner / Agency *</label>
                    <input
                      type="text"
                      required
                      value={campaignFormData.leadPartner}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, leadPartner: e.target.value })}
                      placeholder="e.g. DOT Region XII, Sarangani Tourism Board"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Campaign Manager / Officer</label>
                    <input
                      type="text"
                      value={campaignFormData.campaignManager || ''}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, campaignManager: e.target.value })}
                      placeholder="e.g. CRISTINA D. CONSTANTINO-LA PAZ"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Channels Used (comma-separated)</label>
                  <input
                    type="text"
                    value={channelsInput}
                    onChange={(e) => setChannelsInput(e.target.value)}
                    placeholder="e.g. Facebook Reels, TikTok, Highway Billboards, YouTube"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Deliverables & Milestones Summary</label>
                  <textarea
                    rows={2}
                    value={campaignFormData.deliverablesSummary}
                    onChange={(e) => setCampaignFormData({ ...campaignFormData, deliverablesSummary: e.target.value })}
                    placeholder="Summary of video assets, maps printed, media broadcasts..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  {isEditingCampaign ? 'Update Campaign' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REGISTER COLLATERAL */}
      {/* ========================================================= */}
      {isCollateralModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200">
            <form onSubmit={handleSaveCollateral}>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Register Promotional Collateral</h3>
                <button
                  type="button"
                  onClick={() => setIsCollateralModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Collateral Title *</label>
                  <input
                    type="text"
                    required
                    value={collateralFormData.title}
                    onChange={(e) => setCollateralFormData({ ...collateralFormData, title: e.target.value })}
                    placeholder="e.g. Kalon Barak Sunset Panoramic Poster"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={collateralFormData.category}
                      onChange={(e) => setCollateralFormData({ ...collateralFormData, category: e.target.value as CollateralCategory })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Tourism Video">Tourism Video</option>
                      <option value="Brochure">Brochure</option>
                      <option value="Flyer">Flyer</option>
                      <option value="Tarpaulin / Billboard">Tarpaulin / Billboard</option>
                      <option value="Digital Poster">Digital Poster</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Status *</label>
                    <select
                      value={collateralFormData.status}
                      onChange={(e) => setCollateralFormData({ ...collateralFormData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="In Distribution">In Distribution</option>
                      <option value="In Production">In Production</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">File Format / Paper Specs</label>
                    <input
                      type="text"
                      value={collateralFormData.fileFormat}
                      onChange={(e) => setCollateralFormData({ ...collateralFormData, fileFormat: e.target.value })}
                      placeholder="e.g. MP4 4K, Glossy 150gsm, UV Tarpaulin"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Dimensions / Duration</label>
                    <input
                      type="text"
                      value={collateralFormData.dimensionsOrDuration}
                      onChange={(e) => setCollateralFormData({ ...collateralFormData, dimensionsOrDuration: e.target.value })}
                      placeholder="e.g. 8.5x11 inches, 3 min 45 sec"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Quantity / Printed Copies</label>
                    <input
                      type="number"
                      min="1"
                      value={collateralFormData.quantityOrCopies}
                      onChange={(e) => setCollateralFormData({ ...collateralFormData, quantityOrCopies: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Date Produced</label>
                    <input
                      type="date"
                      value={collateralFormData.dateProduced}
                      onChange={(e) => setCollateralFormData({ ...collateralFormData, dateProduced: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Physical Location / Cloud URL</label>
                  <input
                    type="text"
                    value={collateralFormData.storageLocationOrUrl}
                    onChange={(e) => setCollateralFormData({ ...collateralFormData, storageLocationOrUrl: e.target.value })}
                    placeholder="e.g. Municipal Tourism Office Storage Room / Cloud URL"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCollateralModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  Save Collateral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ENROL PARTNER */}
      {/* ========================================================= */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200">
            <form onSubmit={handleSavePartner}>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Enrol Marketing Partner / Media / Influencer</h3>
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Organization / Creator Name *</label>
                  <input
                    type="text"
                    required
                    value={partnerFormData.name}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                    placeholder="e.g. GMA Regional TV One Mindanao"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Partner Type *</label>
                    <select
                      value={partnerFormData.type}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Media Partner">Media Partner (TV/Radio/Press)</option>
                      <option value="Travel Fair / Expo">Travel Fair / Expo</option>
                      <option value="Tourism Influencer">Tourism Influencer</option>
                      <option value="Industry Association">Industry Association</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Status *</label>
                    <select
                      value={partnerFormData.status}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Active Partner">Active Partner</option>
                      <option value="Past Collaboration">Past Collaboration</option>
                      <option value="Prospective">Prospective</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={partnerFormData.contactPerson}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, contactPerson: e.target.value })}
                      placeholder="e.g. Program Director, Station Head"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Contact Details</label>
                    <input
                      type="text"
                      value={partnerFormData.contactDetails}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, contactDetails: e.target.value })}
                      placeholder="Phone, email, social handle"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Audience / Reach Metrics</label>
                  <input
                    type="text"
                    value={partnerFormData.reachAudience}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, reachAudience: e.target.value })}
                    placeholder="e.g. 1.2M broadcast viewers, 500k followers"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Scope of Collaboration</label>
                  <textarea
                    rows={2}
                    value={partnerFormData.collaborationScope}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, collaborationScope: e.target.value })}
                    placeholder="Description of agreed promotional arrangements..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {isDeleteModalOpen && campaignToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Delete Campaign</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong>"{campaignToDelete.campaignTitle}"</strong>? All performance metrics will be removed from this register.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-xs"
              >
                Yes, Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PRINT MODAL: LGU PMU FORM 01 - CAMPAIGN BRIEF */}
      {/* ========================================================= */}
      {isPrintBriefOpen && formCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-8 space-y-6">
            {/* Letterhead */}
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <div className="text-[11px] uppercase tracking-widest text-slate-500">Republic of the Philippines</div>
              <div className="text-xs font-bold text-slate-700">PROVINCE OF SARANGANI</div>
              <div className="text-sm font-black text-slate-900">{municipalityInfo.name.toUpperCase()}</div>
              <div className="text-xs font-bold text-orange-900">PROMOTION AND MARKETING UNIT (PMU)</div>
              <div className="text-[10px] text-slate-500">{municipalityInfo.officeLocation}</div>
              <div className="pt-2 text-xs font-black uppercase tracking-wider text-slate-900">
                LGU PMU FORM 01: OFFICIAL PROMOTIONAL CAMPAIGN BRIEF & MARKETING PLAN
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border border-slate-200 p-4 rounded-lg bg-slate-50">
                <div>
                  <div><strong>Campaign Title:</strong> {formCampaign.campaignTitle}</div>
                  <div><strong>Type:</strong> {formCampaign.type}</div>
                  <div><strong>Target Market:</strong> {formCampaign.targetAudience}</div>
                </div>
                <div>
                  <div><strong>Duration:</strong> {formCampaign.startDate} to {formCampaign.endDate}</div>
                  <div><strong>Lead Partner:</strong> {formCampaign.leadPartner}</div>
                  <div><strong>Officer-in-Charge:</strong> {formCampaign.campaignManager || 'CRISTINA D. CONSTANTINO-LA PAZ'}</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Budget Item & Distribution Channel</th>
                      <th className="p-3 text-right">Allocation (PHP)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3">Multi-Channel Digital Media Distribution ({formCampaign.channels.join(', ')})</td>
                      <td className="p-3 text-right font-mono font-bold">₱{Math.round(formCampaign.budget * 0.45).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Collateral Printing & Physical Installations (Billboards, Folded Guides)</td>
                      <td className="p-3 text-right font-mono font-bold">₱{Math.round(formCampaign.budget * 0.35).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Institutional Media Hosting, Fam Tour Logistics & Direct Matching</td>
                      <td className="p-3 text-right font-mono font-bold">₱{Math.round(formCampaign.budget * 0.20).toLocaleString()}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t border-slate-200">
                    <tr>
                      <td className="p-3">TOTAL APPROVED APPROPRIATION</td>
                      <td className="p-3 text-right font-mono text-sm text-emerald-900">₱{formCampaign.budget.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 space-y-1">
                <div className="font-bold text-orange-950">Expected Deliverables & KPI Targets:</div>
                <p className="text-orange-900 leading-relaxed">{formCampaign.deliverablesSummary}</p>
                <div className="pt-1 text-[11px] text-orange-800">
                  Target Reach: <strong>{formCampaign.viewsOrReach.toLocaleString()} individuals</strong> • Target Leads: <strong>{formCampaign.roiLeadsGenerated || 1200} direct inquiries</strong>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="text-center space-y-1">
                  <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
                    {formCampaign.campaignManager || 'ENGR. JAYSON V. MORALES'}
                  </div>
                  <div className="text-[11px] text-slate-500">Tourism Operations Officer / Campaign Planner</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
                    {municipalityInfo.officerInCharge}
                  </div>
                  <div className="text-[11px] text-slate-500">{municipalityInfo.officerPosition}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setIsPrintBriefOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Brief</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PRINT MODAL: LGU PMU FORM 02 - EVALUATION & LIQUIDATION */}
      {/* ========================================================= */}
      {isPrintLiquidationOpen && formCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-8 space-y-6">
            {/* Letterhead */}
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <div className="text-[11px] uppercase tracking-widest text-slate-500">Republic of the Philippines</div>
              <div className="text-xs font-bold text-slate-700">PROVINCE OF SARANGANI</div>
              <div className="text-sm font-black text-slate-900">{municipalityInfo.name.toUpperCase()}</div>
              <div className="text-xs font-bold text-orange-900">PROMOTION AND MARKETING UNIT (PMU)</div>
              <div className="text-[10px] text-slate-500">{municipalityInfo.officeLocation}</div>
              <div className="pt-2 text-xs font-black uppercase tracking-wider text-slate-900">
                LGU PMU FORM 02: POST-CAMPAIGN EVALUATION & LIQUIDATION REPORT
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border border-slate-200 p-4 rounded-lg bg-slate-50">
                <div>
                  <div><strong>Campaign:</strong> {formCampaign.campaignTitle}</div>
                  <div><strong>Format:</strong> {formCampaign.type}</div>
                  <div><strong>Lead Partner:</strong> {formCampaign.leadPartner}</div>
                </div>
                <div>
                  <div><strong>Evaluation Date:</strong> {new Date().toISOString().split('T')[0]}</div>
                  <div><strong>Execution Period:</strong> {formCampaign.startDate} to {formCampaign.endDate}</div>
                  <div><strong>Status:</strong> {formCampaign.status}</div>
                </div>
              </div>

              {/* Performance vs Budget Matrix */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Financial Metric</th>
                      <th className="p-3 text-right">Amount (PHP)</th>
                      <th className="p-3 text-right">Variance / Savings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Approved Budget Appropriation</td>
                      <td className="p-3 text-right font-mono font-bold">₱{formCampaign.budget.toLocaleString()}</td>
                      <td className="p-3 text-right text-slate-500">-</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Actual Liquidated Expenditures</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        ₱{(formCampaign.actualExpenses || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        +₱{Math.max(0, formCampaign.budget - (formCampaign.actualExpenses || 0)).toLocaleString()} (Net Savings)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Outreach Metrics */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-bold">Total Verified Impressions</span>
                  <div className="text-xl font-black font-mono text-emerald-950">{formCampaign.viewsOrReach.toLocaleString()} Views</div>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-bold">Direct Consumer & Buyer Leads</span>
                  <div className="text-xl font-black font-mono text-emerald-950">{(formCampaign.roiLeadsGenerated || 0).toLocaleString()} Inquiries</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                <strong>Certification:</strong> The undersigned hereby certifies that the promotional deliverables stated above were duly performed in accordance with government procurement guidelines (R.A. 9184) and Commission on Audit (COA) circulars.
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="text-center space-y-1">
                  <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
                    {formCampaign.campaignManager || 'ENGR. JAYSON V. MORALES'}
                  </div>
                  <div className="text-[11px] text-slate-500">Campaign Lead / Project Officer</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
                    {municipalityInfo.officerInCharge}
                  </div>
                  <div className="text-[11px] text-slate-500">{municipalityInfo.officerPosition}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setIsPrintLiquidationOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Liquidation Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

