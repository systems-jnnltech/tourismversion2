import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Route,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Coins,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Printer,
  Download,
  X,
  FileText,
  Building2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Calendar,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  Sliders,
  DollarSign,
  Tag,
  Share2,
  FolderPlus
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import {
  TourismProduct,
  TourismCluster,
  ProductLifecycleStage,
  ProductDevelopmentStatus,
  CapacityBuildingTraining,
  TourismInvestmentOpportunity,
} from '../../types';

export const ProductDevelopmentView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    capacityTrainings,
    addCapacityTraining,
    deleteCapacityTraining,
    investmentOpportunities,
    addInvestmentOpportunity,
    deleteInvestmentOpportunity,
    isReadOnly,
    municipalityInfo,
    currentUser,
  } = useTourism();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'monitoring' | 'clusters' | 'capacity' | 'evaluation' | 'investments'>('monitoring');

  // Search and Filter States for Products
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCluster, setFilterCluster] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all'); // 'all' | 'Existing' | 'Proposed'
  const [filterLifecycle, setFilterLifecycle] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<TourismProduct | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<TourismProduct | null>(null);

  // Print Form Modals
  const [isPrintScorecardOpen, setIsPrintScorecardOpen] = useState(false);
  const [isPrintPitchOpen, setIsPrintPitchOpen] = useState(false);
  const [formProduct, setFormProduct] = useState<TourismProduct | null>(null);

  // Capacity Building Modal
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  // Investment Opportunity Modal
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);

  // Product Form State
  const initialProductForm: Omit<TourismProduct, 'id'> = {
    productName: '',
    cluster: 'Cultural Tourism',
    productType: 'Existing',
    lifecycle: 'Introduction',
    developmentStatus: 'Commercial Operations',
    stage: 'Market-Ready',
    targetMarket: '',
    communityStakeholders: '',
    barangay: 'Poblacion',
    leadOrganization: '',
    investmentRequired: 500000,
    capacityBuildingConducted: [],
    evaluationScore: 85,
    readinessStatus: 'Ready for Promotion',
    keyFeatures: [],
    lastEvaluatedDate: new Date().toISOString().split('T')[0],
  };
  const [productFormData, setProductFormData] = useState<Omit<TourismProduct, 'id'>>(initialProductForm);
  const [featuresInput, setFeaturesInput] = useState('');
  const [trainingsInput, setTrainingsInput] = useState('');

  // Capacity Building Form State
  const initialTrainingForm: Omit<CapacityBuildingTraining, 'id'> = {
    title: '',
    cluster: 'Cultural Tourism',
    targetBeneficiaries: '',
    partnerAgency: 'Department of Tourism Region XII (DOT-RO12)',
    dateConducted: new Date().toISOString().split('T')[0],
    durationHours: 24,
    venue: '',
    participantsCount: 30,
    femaleParticipants: 18,
    ipParticipants: 20,
    certifiedCount: 30,
    status: 'Completed',
  };
  const [trainingFormData, setTrainingFormData] = useState<Omit<CapacityBuildingTraining, 'id'>>(initialTrainingForm);

  // Investment Opportunity Form State
  const initialInvestmentForm: Omit<TourismInvestmentOpportunity, 'id'> = {
    projectTitle: '',
    cluster: 'Eco-tourism',
    barangay: 'Poblacion',
    estimatedCapital: 15000000,
    businessModel: 'Public-Private Partnership (PPP)',
    projectedPaybackYears: 4.5,
    lguIncentives: 'Local business tax holiday and priority access road development per Malungon Investment Code',
    briefDescription: '',
    readiness: 'Bankable / Investment-Ready',
    targetInvestor: 'Private Hospitality Developers, Tourism Corporations',
  };
  const [investmentFormData, setInvestmentFormData] = useState<Omit<TourismInvestmentOpportunity, 'id'>>(initialInvestmentForm);

  // Interactive PRI Calculator State (Tab 4)
  const [priCalcProduct, setPriCalcProduct] = useState<string>('custom');
  const [scoreAttractiveness, setScoreAttractiveness] = useState<number>(88); // 25% weight
  const [scoreCommunity, setScoreCommunity] = useState<number>(92); // 25% weight
  const [scoreInfrastructure, setScoreInfrastructure] = useState<number>(75); // 20% weight
  const [scoreSustainability, setScoreSustainability] = useState<number>(90); // 15% weight
  const [scoreSafety, setScoreSafety] = useState<number>(85); // 15% weight

  // Calculate composite PRI Score (0-100)
  const compositePri = useMemo(() => {
    const raw =
      scoreAttractiveness * 0.25 +
      scoreCommunity * 0.25 +
      scoreInfrastructure * 0.20 +
      scoreSustainability * 0.15 +
      scoreSafety * 0.15;
    return Math.round(raw);
  }, [scoreAttractiveness, scoreCommunity, scoreInfrastructure, scoreSustainability, scoreSafety]);

  const priClassification = useMemo(() => {
    if (compositePri >= 90) return { label: 'Level 4: Market-Ready / Flagship', color: 'emerald', bg: 'bg-emerald-100 text-emerald-800' };
    if (compositePri >= 75) return { label: 'Level 3: Pilot Testing / Commercial Viable', color: 'blue', bg: 'bg-blue-100 text-blue-800' };
    if (compositePri >= 60) return { label: 'Level 2: Developmental / Upgrades Needed', color: 'amber', bg: 'bg-amber-100 text-amber-800' };
    return { label: 'Level 1: Incubation / Conceptual Phase', color: 'rose', bg: 'bg-rose-100 text-rose-800' };
  }, [compositePri]);

  // Handle Preset Selection in PRI Calculator
  const handlePriProductChange = (prodId: string) => {
    setPriCalcProduct(prodId);
    if (prodId === 'custom') {
      setScoreAttractiveness(85);
      setScoreCommunity(85);
      setScoreInfrastructure(75);
      setScoreSustainability(85);
      setScoreSafety(80);
      return;
    }
    const found = products.find((p) => p.id === prodId);
    if (found) {
      // Calibrate realistic scores based on evaluationScore
      const base = found.evaluationScore;
      setScoreAttractiveness(Math.min(100, Math.max(50, base + 2)));
      setScoreCommunity(Math.min(100, Math.max(50, base + 4)));
      setScoreInfrastructure(Math.min(100, Math.max(50, base - 8)));
      setScoreSustainability(Math.min(100, Math.max(50, base + 1)));
      setScoreSafety(Math.min(100, Math.max(50, base - 3)));
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barangay && p.barangay.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.communityStakeholders.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.leadOrganization && p.leadOrganization.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCluster = filterCluster === 'all' || p.cluster === filterCluster;
      const matchesType = filterType === 'all' || (p.productType || 'Existing') === filterType;
      const matchesLifecycle = filterLifecycle === 'all' || (p.lifecycle || 'Introduction') === filterLifecycle;
      const matchesStatus = filterStatus === 'all' || (p.developmentStatus || 'Commercial Operations') === filterStatus;

      return matchesSearch && matchesCluster && matchesType && matchesLifecycle && matchesStatus;
    });
  }, [products, searchQuery, filterCluster, filterType, filterLifecycle, filterStatus]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const existingCount = products.filter((p) => (p.productType || 'Existing') === 'Existing').length;
    const proposedCount = products.filter((p) => p.productType === 'Proposed').length;
    const avgScore = total > 0 ? Math.round(products.reduce((acc, p) => acc + p.evaluationScore, 0) / total) : 0;
    const totalCapital = products.reduce((acc, p) => acc + p.investmentRequired, 0);
    return { total, existingCount, proposedCount, avgScore, totalCapital };
  }, [products]);

  // Official Curated Tourism Circuits (Malungon Corridors)
  const circuits = [
    {
      name: 'Highland Ridge & Glamping Corridor',
      cluster: 'Eco-tourism',
      duration: '2 Days / 1 Night',
      stops: ['Kalon Barak Skyline Ridge (780 MASL)', 'Pine Mountain Overlook', 'Highland Coffee Farm & Tasting Deck'],
      targetAudience: 'Eco-Tourists, Campers, Motorcyclists, Sunset Chasers',
      status: 'Fully Commercialized & Active',
      leadOrg: 'Kalon Barak Highland Management Board',
      estimatedCostPerPax: '₱2,450',
    },
    {
      name: 'Living Ancestral Weaving & Heritage Trail',
      cluster: 'Cultural Tourism',
      duration: 'Whole Day Tour (8 Hours)',
      stops: ['Lamlifew Village Museum', 'School of Living Traditions (SLT)', 'Artisan Weaving Sheds', 'Blaan Indigenous Lunch'],
      targetAudience: 'Cultural Enthusiasts, Researchers, Educational Groups, Photographers',
      status: 'Community-Based Tourism (CBT) Standard Certified',
      leadOrg: 'Lamlifew Women Weavers Association',
      estimatedCostPerPax: '₱1,850',
    },
    {
      name: 'Eco-Spring & River Cascade Adventure',
      cluster: 'Adventure Tourism',
      duration: 'Half Day Tour (4 Hours)',
      stops: ['Upper Mainit River Basin', 'River Tubing Launch Pad', 'Villamor Cold Spring Sanctuary'],
      targetAudience: 'Youth Groups, Families, Team Buildings, Outdoor Enthusiasts',
      status: 'Operational & Regulated Carrying Capacity',
      leadOrg: 'Upper Mainit Eco-Adventure Guides Assoc',
      estimatedCostPerPax: '₱950',
    },
    {
      name: 'Highland Agro-Industrial Coffee & Cacao Discovery',
      cluster: 'Agri-tourism',
      duration: 'Whole Day Tour (7 Hours)',
      stops: ['Alkikan High-Elevation Arabica Estate', 'Malandag Cacao Processing Hub', 'Cupping Lab & Tablea Tasting Deck'],
      targetAudience: 'Culinary Travelers, Baristas, Coffee Aficionados, Agriculture Students',
      status: 'Market-Ready / Operational',
      leadOrg: 'Federation of Malungon Coffee Farmers',
      estimatedCostPerPax: '₱1,600',
    },
  ];

  // Helper to open Add Product Modal
  const handleOpenAddProduct = () => {
    setProductFormData(initialProductForm);
    setFeaturesInput('');
    setTrainingsInput('');
    setIsEditingProduct(false);
    setIsProductModalOpen(true);
  };

  // Helper to open Edit Product Modal
  const handleOpenEditProduct = (prod: TourismProduct) => {
    setSelectedProduct(prod);
    setProductFormData({
      productName: prod.productName,
      cluster: prod.cluster,
      productType: prod.productType || 'Existing',
      lifecycle: prod.lifecycle || 'Introduction',
      developmentStatus: prod.developmentStatus || 'Commercial Operations',
      stage: prod.stage,
      targetMarket: prod.targetMarket,
      communityStakeholders: prod.communityStakeholders,
      barangay: prod.barangay || 'Poblacion',
      leadOrganization: prod.leadOrganization || '',
      investmentRequired: prod.investmentRequired,
      capacityBuildingConducted: prod.capacityBuildingConducted || [],
      evaluationScore: prod.evaluationScore,
      readinessStatus: prod.readinessStatus,
      keyFeatures: prod.keyFeatures || [],
      lastEvaluatedDate: prod.lastEvaluatedDate || new Date().toISOString().split('T')[0],
    });
    setFeaturesInput(prod.keyFeatures ? prod.keyFeatures.join(', ') : '');
    setTrainingsInput(prod.capacityBuildingConducted ? prod.capacityBuildingConducted.join(', ') : '');
    setIsEditingProduct(true);
    setIsProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedFeatures = featuresInput
      ? featuresInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const parsedTrainings = trainingsInput
      ? trainingsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...productFormData,
      keyFeatures: parsedFeatures,
      capacityBuildingConducted: parsedTrainings,
    };

    if (isEditingProduct && selectedProduct) {
      updateProduct(selectedProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  // Delete Product
  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      if (selectedProduct?.id === productToDelete.id) {
        setIsDossierOpen(false);
      }
    }
  };

  // Save Capacity Training
  const handleSaveTraining = (e: React.FormEvent) => {
    e.preventDefault();
    addCapacityTraining(trainingFormData);
    setIsTrainingModalOpen(false);
    setTrainingFormData(initialTrainingForm);
  };

  // Save Investment Opportunity
  const handleSaveInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    addInvestmentOpportunity(investmentFormData);
    setIsInvestmentModalOpen(false);
    setInvestmentFormData(initialInvestmentForm);
  };

  // Export Products to CSV
  const handleExportProductsCsv = () => {
    const headers = [
      'Product ID',
      'Product Name',
      'Cluster',
      'Type',
      'Lifecycle Stage',
      'Development Status',
      'Barangay',
      'Lead Organization',
      'Target Market',
      'Community Stakeholders',
      'Investment Required (PHP)',
      'Readiness Status',
      'PRI Score',
    ];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.productName.replace(/"/g, '""')}"`,
      p.cluster,
      p.productType || 'Existing',
      p.lifecycle || 'Introduction',
      p.developmentStatus || 'Commercial Operations',
      p.barangay || 'Poblacion',
      `"${(p.leadOrganization || '').replace(/"/g, '""')}"`,
      `"${p.targetMarket.replace(/"/g, '""')}"`,
      `"${p.communityStakeholders.replace(/"/g, '""')}"`,
      p.investmentRequired,
      p.readinessStatus,
      p.evaluationScore,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MTODMS_Tourism_Products_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Trainings to CSV
  const handleExportTrainingsCsv = () => {
    const headers = [
      'Training ID',
      'Course Title',
      'Cluster',
      'Target Beneficiaries',
      'Partner Agency',
      'Date Conducted',
      'Duration (Hours)',
      'Venue',
      'Total Participants',
      'Female Participants',
      'IP Participants',
      'Certified Count',
      'Status',
    ];
    const rows = capacityTrainings.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.cluster,
      `"${t.targetBeneficiaries.replace(/"/g, '""')}"`,
      `"${t.partnerAgency.replace(/"/g, '""')}"`,
      t.dateConducted,
      t.durationHours,
      `"${t.venue.replace(/"/g, '""')}"`,
      t.participantsCount,
      t.femaleParticipants,
      t.ipParticipants,
      t.certifiedCount,
      t.status,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MTODMS_Capacity_Trainings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Investments to CSV
  const handleExportInvestmentsCsv = () => {
    const headers = [
      'Project ID',
      'Project Title',
      'Cluster',
      'Barangay',
      'Estimated Capital (PHP)',
      'Business Model',
      'Projected Payback (Years)',
      'Readiness Tier',
      'Target Investor',
    ];
    const rows = investmentOpportunities.map((i) => [
      i.id,
      `"${i.projectTitle.replace(/"/g, '""')}"`,
      i.cluster,
      i.barangay,
      i.estimatedCapital,
      i.businessModel,
      i.projectedPaybackYears,
      i.readiness,
      `"${i.targetInvestor.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MTODMS_Investment_Opportunities_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>MODULE J • Product Innovation & Circuits</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Tourism Product Development Unit (TPDU)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tourism circuits packaging, product lifecycle monitoring, community-based tourism (CBT) incubation, and investment pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportProductsCsv}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {!isReadOnly && (
            <button
              onClick={handleOpenAddProduct}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tourism Product</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Catalog</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics.total}</div>
          <div className="text-[11px] text-purple-700 font-medium mt-0.5">Packaged products</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Existing Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics.existingCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Commercial operations</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Proposed Pipeline</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics.proposedCount}</div>
          <div className="text-[11px] text-blue-700 font-medium mt-0.5">In feasibility & trial</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Mean PRI Score</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics.avgScore}%</div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">Readiness Index average</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Capital Pipeline</span>
            <Coins className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">₱{(metrics.totalCapital / 1000000).toFixed(1)}M</div>
          <div className="text-[11px] text-indigo-700 font-medium mt-0.5">Development investment</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'monitoring'
              ? 'bg-white border-t border-l border-r border-slate-200 text-purple-700 -mb-px'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. Product Monitoring</span>
          <span className="ml-1 px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded-full text-[10px]">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('clusters')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'clusters'
              ? 'bg-white border-t border-l border-r border-slate-200 text-purple-700 -mb-px'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Route className="w-3.5 h-3.5" />
          <span>2. The 4 Clusters & Circuits</span>
        </button>

        <button
          onClick={() => setActiveTab('capacity')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'capacity'
              ? 'bg-white border-t border-l border-r border-slate-200 text-purple-700 -mb-px'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>3. Capacity Building</span>
          <span className="ml-1 px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full text-[10px]">
            {capacityTrainings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('evaluation')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'evaluation'
              ? 'bg-white border-t border-l border-r border-slate-200 text-purple-700 -mb-px'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>4. PRI Scorecard Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('investments')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'investments'
              ? 'bg-white border-t border-l border-r border-slate-200 text-purple-700 -mb-px'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>5. Investment Opportunities</span>
          <span className="ml-1 px-1.5 py-0.2 bg-indigo-100 text-indigo-800 rounded-full text-[10px]">
            {investmentOpportunities.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PRODUCT MONITORING (EXISTING & PROPOSED) */}
      {/* ========================================================= */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search product, barangay, or lead org..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap justify-end">
              <select
                value={filterCluster}
                onChange={(e) => setFilterCluster(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">All Clusters</option>
                <option value="Cultural Tourism">Cultural Tourism</option>
                <option value="Eco-tourism">Eco-tourism</option>
                <option value="Agri-tourism">Agri-tourism</option>
                <option value="Adventure Tourism">Adventure Tourism</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">All Types (Existing & Proposed)</option>
                <option value="Existing">Existing Products</option>
                <option value="Proposed">Proposed Products</option>
              </select>

              <select
                value={filterLifecycle}
                onChange={(e) => setFilterLifecycle(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">All Lifecycles</option>
                <option value="Introduction">Introduction</option>
                <option value="Growth">Growth</option>
                <option value="Maturity">Maturity</option>
                <option value="Decline / Revitalization">Decline / Revitalization</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="all">All Maturation Statuses</option>
                <option value="Concept / Ideation">Concept / Ideation</option>
                <option value="Feasibility Study">Feasibility Study</option>
                <option value="Infrastructure / Site Development">Infrastructure / Site Dev</option>
                <option value="Pilot Testing / Trial Run">Pilot Testing / Trial Run</option>
                <option value="Commercial Operations">Commercial Operations</option>
              </select>

              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 text-xs ${viewMode === 'grid' ? 'bg-purple-50 text-purple-700 font-bold' : 'bg-white text-slate-500'}`}
                  title="Grid View"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 text-xs ${viewMode === 'table' ? 'bg-purple-50 text-purple-700 font-bold' : 'bg-white text-slate-500'}`}
                  title="Table View"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* GRID VIEW */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          prod.cluster === 'Cultural Tourism'
                            ? 'bg-amber-100 text-amber-800'
                            : prod.cluster === 'Eco-tourism'
                            ? 'bg-emerald-100 text-emerald-800'
                            : prod.cluster === 'Agri-tourism'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {prod.cluster}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          (prod.productType || 'Existing') === 'Existing'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {prod.productType || 'Existing'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm hover:text-purple-700 cursor-pointer transition-colors"
                        onClick={() => { setSelectedProduct(prod); setIsDossierOpen(true); }}
                      >
                        {prod.productName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>Brgy. {prod.barangay || 'Poblacion'} • {prod.leadOrganization || prod.communityStakeholders}</span>
                      </p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1.5 border border-slate-100">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Lifecycle:</span>
                        <span className="font-semibold text-slate-800">{prod.lifecycle || 'Introduction'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Status:</span>
                        <span className="font-medium text-slate-700">{prod.developmentStatus || 'Commercial Operations'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Capital Needed:</span>
                        <span className="font-mono font-bold text-slate-900">₱{prod.investmentRequired.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* PRI Score Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 text-[11px]">Readiness Index (PRI):</span>
                        <span className="font-bold text-purple-900 text-xs">{prod.evaluationScore}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            prod.evaluationScore >= 90
                              ? 'bg-emerald-500'
                              : prod.evaluationScore >= 75
                              ? 'bg-purple-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${prod.evaluationScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Features Badges */}
                    {prod.keyFeatures && prod.keyFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {prod.keyFeatures.slice(0, 2).map((feat, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {feat}
                          </span>
                        ))}
                        {prod.keyFeatures.length > 2 && (
                          <span className="text-[10px] text-slate-400 px-1">
                            +{prod.keyFeatures.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => { setSelectedProduct(prod); setIsDossierOpen(true); }}
                      className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Dossier</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setFormProduct(prod); setIsPrintScorecardOpen(true); }}
                        className="p-1 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                        title="Print Scorecard (LGU Form 01)"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setFormProduct(prod); setIsPrintPitchOpen(true); }}
                        className="p-1 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                        title="Print Investment Brief (LGU Form 02)"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      {!isReadOnly && (
                        <>
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1 hover:bg-purple-100 text-purple-700 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setProductToDelete(prod); setIsDeleteModalOpen(true); }}
                            className="p-1 hover:bg-rose-100 text-rose-700 rounded transition-colors"
                            title="Delete Product"
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
          ) : (
            /* TABLE VIEW */
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Product Name & Location</th>
                      <th className="px-3 py-3">Cluster</th>
                      <th className="px-3 py-3">Type & Lifecycle</th>
                      <th className="px-3 py-3">Maturation Status</th>
                      <th className="px-3 py-3">Readiness Status</th>
                      <th className="px-3 py-3 text-right">Capital Req.</th>
                      <th className="px-3 py-3">PRI Score</th>
                      <th className="px-3 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div
                            className="font-bold text-slate-900 hover:text-purple-700 cursor-pointer"
                            onClick={() => { setSelectedProduct(prod); setIsDossierOpen(true); }}
                          >
                            {prod.productName}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Brgy. {prod.barangay || 'Poblacion'} • {prod.leadOrganization || prod.communityStakeholders}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {prod.cluster}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-semibold text-slate-800">{prod.productType || 'Existing'}</div>
                          <div className="text-[10px] text-slate-400">{prod.lifecycle || 'Introduction'}</div>
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          {prod.developmentStatus || 'Commercial Operations'}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.readinessStatus === 'Ready for Promotion'
                                ? 'bg-emerald-100 text-emerald-800'
                                : prod.readinessStatus === 'Requires Facility Upgrades'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {prod.readinessStatus}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-slate-800">
                          ₱{prod.investmentRequired.toLocaleString()}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${prod.evaluationScore}%` }}
                              />
                            </div>
                            <span className="font-bold text-purple-900">{prod.evaluationScore}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => { setSelectedProduct(prod); setIsDossierOpen(true); }}
                              className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                              title="View Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setFormProduct(prod); setIsPrintScorecardOpen(true); }}
                              className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                              title="Print LGU Form 01"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            {!isReadOnly && (
                              <>
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1 hover:bg-purple-100 text-purple-700 rounded"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => { setProductToDelete(prod); setIsDeleteModalOpen(true); }}
                                  className="p-1 hover:bg-rose-100 text-rose-700 rounded"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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

      {/* ========================================================= */}
      {/* TAB 2: THE 4 CLUSTERS & PACKAGED CIRCUITS */}
      {/* ========================================================= */}
      {activeTab === 'clusters' && (
        <div className="space-y-6">
          {/* Cluster Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-amber-950 text-sm">Cultural Tourism Cluster</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Centered on the Blaan and Tagakaolo Indigenous Cultural Communities. Encompasses the Lamlifew Village Museum, School of Living Traditions, Mabal Tabih abaca weaving, traditional music, and Kasfala community dialogues.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-amber-900 border-t border-amber-200">
                Key Site: Lamlifew Village Museum (Brgy. Datal Tampal)
              </div>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-emerald-950 text-sm">Eco-tourism Cluster</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Pristine highland ridgelines and riparian corridors. Features Kalon Barak Skyline Ridge (780 MASL), Villamor Cold Springs, watershed preserves, and native flora and fauna observation walks.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-900 border-t border-emerald-200">
                Key Site: Kalon Barak Skyline (Brgy. Poblacion)
              </div>
            </div>

            <div className="bg-orange-50/70 p-4 rounded-xl border border-orange-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-orange-950 text-sm">Agri-tourism Cluster</h3>
              <p className="text-xs text-orange-800 leading-relaxed">
                Capitalizes on Malungon's agricultural wealth in high-altitude specialty coffee (Arabica and Robusta), single-estate cacao production, organic tropical fruit orchards, and farm-to-table culinary experiences.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-orange-900 border-t border-orange-200">
                Key Site: Alkikan Coffee Ridge & Malandag Cacao Hub
              </div>
            </div>

            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-blue-950 text-sm">Adventure Tourism Cluster</h3>
              <p className="text-xs text-blue-800 leading-relaxed">
                Action-oriented terrain offering natural river tubing and whitewater rapid drifts along Upper Mainit, rugged downhill MTB and enduro trails, motorcycle adventure circuits, and stargazing highland glamping.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-blue-900 border-t border-blue-200">
                Key Site: Upper Mainit Cascades & Rapids
              </div>
            </div>
          </div>

          {/* Packaged Circuits Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Route className="w-4 h-4 text-purple-600" />
                  <span>Curated Municipal Tourism Circuits</span>
                </h3>
                <p className="text-xs text-slate-500">Official packaged experiential itineraries for domestic and international travelers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {circuits.map((c, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                        {c.duration}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {c.estimatedCostPerPax} <span className="text-[10px] text-slate-400 font-normal">/ pax</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{c.name}</h4>
                      <p className="text-xs text-purple-700 font-medium mt-0.5">Cluster: {c.cluster}</p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800 text-[11px]">Packaged Itinerary Stops:</div>
                      <div className="space-y-1 pl-1">
                        {c.stops.map((stop, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-slate-600">
                            <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[10px] flex items-center justify-center font-bold">
                              {sIdx + 1}
                            </span>
                            <span>{stop}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <div>Target Market: <strong className="text-slate-700">{c.targetAudience}</strong></div>
                      <div>Lead Partner: <strong className="text-slate-700">{c.leadOrg}</strong></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{c.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CAPACITY BUILDING & TRAINING */}
      {/* ========================================================= */}
      {activeTab === 'capacity' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Community Tourism Capacity Building Register</h3>
              <p className="text-xs text-slate-500">
                Skills development, safety standards, and accreditation workshops for community guides and tourism workers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportTrainingsCsv}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Trainings</span>
              </button>
              {!isReadOnly && (
                <button
                  onClick={() => { setTrainingFormData(initialTrainingForm); setIsTrainingModalOpen(true); }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log New Training</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div className="text-xs text-purple-700 font-medium">Total Sessions Logged</div>
              <div className="text-2xl font-bold text-purple-950 mt-1">{capacityTrainings.length}</div>
              <div className="text-[11px] text-purple-600 mt-0.5">LGU & Partner courses</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <div className="text-xs text-emerald-700 font-medium">Total Participants Trained</div>
              <div className="text-2xl font-bold text-emerald-950 mt-1">
                {capacityTrainings.reduce((acc, t) => acc + t.participantsCount, 0)}
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">Guides, weavers, operators</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="text-xs text-blue-700 font-medium">Indigenous People (IP) Participants</div>
              <div className="text-2xl font-bold text-blue-950 mt-1">
                {capacityTrainings.reduce((acc, t) => acc + t.ipParticipants, 0)}
              </div>
              <div className="text-[11px] text-blue-600 mt-0.5">Blaan & Tagakaolo youth</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <div className="text-xs text-amber-700 font-medium">Certified / Accreditations</div>
              <div className="text-2xl font-bold text-amber-950 mt-1">
                {capacityTrainings.reduce((acc, t) => acc + t.certifiedCount, 0)}
              </div>
              <div className="text-[11px] text-amber-600 mt-0.5">Completed assessments</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Training Course Title</th>
                    <th className="px-3 py-3">Cluster</th>
                    <th className="px-3 py-3">Partner Agency</th>
                    <th className="px-3 py-3">Date & Venue</th>
                    <th className="px-3 py-3 text-center">Participants</th>
                    <th className="px-3 py-3 text-center">Certified</th>
                    <th className="px-3 py-3">Status</th>
                    {!isReadOnly && <th className="px-3 py-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {capacityTrainings.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{t.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Target: {t.targetBeneficiaries}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {t.cluster}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-800 font-medium">{t.partnerAgency}</td>
                      <td className="px-3 py-3">
                        <div className="text-slate-900 font-medium">{t.dateConducted}</div>
                        <div className="text-[10px] text-slate-400">{t.venue} ({t.durationHours} hrs)</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-bold text-slate-900">{t.participantsCount}</span>
                        <div className="text-[10px] text-slate-400">
                          {t.femaleParticipants} female • {t.ipParticipants} IP
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-emerald-700">
                        {t.certifiedCount}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'Ongoing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      {!isReadOnly && (
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={() => deleteCapacityTraining(t.id)}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PRI SCORECARD CALCULATOR */}
      {/* ========================================================= */}
      {activeTab === 'evaluation' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                  <Award className="w-4 h-4" />
                  <span>Product Readiness Index (PRI) Model</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Interactive Multi-Factor Evaluation Calculator</h3>
                <p className="text-xs text-slate-500">
                  Standard DOT and LGU product development assessment methodology based on 5 weighted pillars
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Select Product Preset:</span>
                <select
                  value={priCalcProduct}
                  onChange={(e) => handlePriProductChange(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold"
                >
                  <option value="custom">-- Custom Interactive Simulation --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.productName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scorecard Sliders & Live Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
              {/* Sliders Area (2 Columns) */}
              <div className="lg:col-span-2 space-y-4">
                {/* 1. Attractiveness & Uniqueness (25%) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">1. Attractiveness, Authenticity & Uniqueness</span>
                      <span className="ml-2 text-[11px] text-purple-700 font-semibold">(Weight: 25%)</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{scoreAttractiveness}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={scoreAttractiveness}
                    onChange={(e) => setScoreAttractiveness(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Ordinary / Commonplace (40%)</span>
                    <span>Distinctive Municipal Icon (100%)</span>
                  </div>
                </div>

                {/* 2. Community Readiness & Governance (25%) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">2. Community Readiness & Local Ownership</span>
                      <span className="ml-2 text-[11px] text-purple-700 font-semibold">(Weight: 25%)</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{scoreCommunity}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={scoreCommunity}
                    onChange={(e) => setScoreCommunity(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Weak Organization / Low Support (40%)</span>
                    <span>Strong IP/CBT Cooperative & Guides (100%)</span>
                  </div>
                </div>

                {/* 3. Infrastructure & Accessibility (20%) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">3. Infrastructure, Comfort & Accessibility</span>
                      <span className="ml-2 text-[11px] text-purple-700 font-semibold">(Weight: 20%)</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{scoreInfrastructure}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={scoreInfrastructure}
                    onChange={(e) => setScoreInfrastructure(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Poor Access / No Facilities (40%)</span>
                    <span>Paved Access, Clean Restrooms, Power (100%)</span>
                  </div>
                </div>

                {/* 4. Environmental & Cultural Sustainability (15%) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">4. Environmental & Cultural Sustainability</span>
                      <span className="ml-2 text-[11px] text-purple-700 font-semibold">(Weight: 15%)</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{scoreSustainability}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={scoreSustainability}
                    onChange={(e) => setScoreSustainability(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Risk of Cultural Dilution / Damage (40%)</span>
                    <span>Full Ancestral Domain Respect & LNT (100%)</span>
                  </div>
                </div>

                {/* 5. Safety, Security & Health (15%) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">5. Safety, Disaster Risk & Health Protocols</span>
                      <span className="ml-2 text-[11px] text-purple-700 font-semibold">(Weight: 15%)</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{scoreSafety}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={scoreSafety}
                    onChange={(e) => setScoreSafety(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>No First Aid or Emergency Protocol (40%)</span>
                    <span>Trained Responders, MDRRMO Link (100%)</span>
                  </div>
                </div>
              </div>

              {/* Composite Result Card (1 Column) */}
              <div className="bg-linear-to-br from-slate-900 to-purple-950 text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-purple-300 font-bold">Composite Output</span>
                    <Sparkles className="w-5 h-5 text-purple-300" />
                  </div>

                  <div className="text-center py-4">
                    <div className="text-6xl font-black font-mono tracking-tight text-white">{compositePri}%</div>
                    <div className="text-xs text-purple-200 mt-1 font-medium">Product Readiness Index (PRI)</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 space-y-2">
                    <div className="text-[11px] text-purple-200 font-medium">Readiness Classification:</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{priClassification.label}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-purple-200/80 space-y-1 leading-relaxed">
                    <p>
                      <strong>Recommendation:</strong>{' '}
                      {compositePri >= 90
                        ? 'Eligible for provincial/national marketing blitz and inclusion in flagship tourism circuits.'
                        : compositePri >= 75
                        ? 'Market-ready for regulated domestic visits. Prioritize minor facility enhancements and interpretive signage.'
                        : compositePri >= 60
                        ? 'Requires infrastructure intervention and community guiding workshops prior to commercial promotion.'
                        : 'Maintain in incubation mode. Conduct basic CBT orientations and environmental baseline studies.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      const matched = products.find((p) => p.id === priCalcProduct);
                      if (matched) {
                        setFormProduct(matched);
                        setIsPrintScorecardOpen(true);
                      } else {
                        alert('Please select a specific product preset from the dropdown above to generate an official printable scorecard.');
                      }
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print LGU Scorecard (Form 01)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: TOURISM INVESTMENT OPPORTUNITIES */}
      {/* ========================================================= */}
      {activeTab === 'investments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tourism Capital Investment Portfolio</h3>
              <p className="text-xs text-slate-500">
                Bankable public-private partnership (PPP) and community co-development packages backed by the Malungon Municipal Investment Code
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportInvestmentsCsv}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Portfolio</span>
              </button>
              {!isReadOnly && (
                <button
                  onClick={() => { setInvestmentFormData(initialInvestmentForm); setIsInvestmentModalOpen(true); }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Investment Package</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentOpportunities.map((inv) => (
              <div
                key={inv.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {inv.cluster}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.readiness === 'Bankable / Investment-Ready'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.readiness === 'Feasibility Underway'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.readiness}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{inv.projectTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Barangay {inv.barangay}, Malungon</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{inv.briefDescription}</p>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Capital Requirement</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        ₱{inv.estimatedCapital.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Projected Payback</span>
                      <span className="font-bold text-emerald-700 text-sm">{inv.projectedPaybackYears} Years</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 text-[10px] block">Business Model</span>
                      <span className="font-medium text-slate-800">{inv.businessModel}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-purple-900 bg-purple-50/70 p-2.5 rounded-lg border border-purple-100">
                    <span className="font-semibold block text-[10px] text-purple-800 uppercase tracking-wider">
                      LGU Investment Incentive Code Perks:
                    </span>
                    <span>{inv.lguIncentives}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Target: <span className="text-slate-700 font-medium">{inv.targetInvestor}</span>
                  </div>
                  {!isReadOnly && (
                    <button
                      onClick={() => deleteInvestmentOpportunity(inv.id)}
                      className="p-1 hover:bg-rose-50 text-rose-600 rounded transition-colors"
                      title="Delete Investment Opportunity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PRODUCT DOSSIER */}
      {/* ========================================================= */}
      {isDossierOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {selectedProduct.cluster} • {selectedProduct.productType || 'Existing'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedProduct.productName}</h3>
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
                  <span className="text-[10px] text-slate-400 block">Lifecycle Stage</span>
                  <span className="font-bold text-slate-900">{selectedProduct.lifecycle || 'Introduction'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Maturation Status</span>
                  <span className="font-bold text-slate-900">{selectedProduct.developmentStatus || 'Commercial Operations'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Readiness Status</span>
                  <span className="font-bold text-emerald-700">{selectedProduct.readinessStatus}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">PRI Readiness Score</span>
                  <span className="font-mono font-bold text-purple-700 text-sm">{selectedProduct.evaluationScore}%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">Target Market Profile:</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedProduct.targetMarket}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">Community Stakeholders & Lead Organization:</span>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <div><strong>Lead Organization:</strong> {selectedProduct.leadOrganization || 'Not assigned'}</div>
                  <div><strong>Community Stakeholders:</strong> {selectedProduct.communityStakeholders}</div>
                  <div><strong>Barangay Location:</strong> Barangay {selectedProduct.barangay || 'Poblacion'}, Malungon</div>
                </div>
              </div>

              {selectedProduct.keyFeatures && selectedProduct.keyFeatures.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs">Flagship Product Components:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.keyFeatures.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 p-2 bg-purple-50/50 rounded-lg border border-purple-100 text-purple-900 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.capacityBuildingConducted && selectedProduct.capacityBuildingConducted.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs">Capacity Building Workshops Completed:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    {selectedProduct.capacityBuildingConducted.map((cap, cIdx) => (
                      <li key={cIdx}>{cap}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-bold">Total Capital Pipeline</span>
                  <div className="text-base font-mono font-bold text-emerald-950">₱{selectedProduct.investmentRequired.toLocaleString()}</div>
                </div>
                <div className="text-right text-[11px] text-emerald-800">
                  Last Evaluated: <strong>{selectedProduct.lastEvaluatedDate || '2026-03-01'}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setFormProduct(selectedProduct); setIsPrintScorecardOpen(true); }}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print LGU Scorecard (Form 01)</span>
                </button>
                <button
                  onClick={() => { setFormProduct(selectedProduct); setIsPrintPitchOpen(true); }}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Print Investment Brief (Form 02)</span>
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
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <form onSubmit={handleSaveProduct}>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-base font-bold text-slate-900">
                  {isEditingProduct ? 'Edit Tourism Product' : 'Add New Tourism Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Product Title / Experience Name *</label>
                  <input
                    type="text"
                    required
                    value={productFormData.productName}
                    onChange={(e) => setProductFormData({ ...productFormData, productName: e.target.value })}
                    placeholder="e.g. Lamlifew Living Traditions & Weaver Apprenticeship"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tourism Cluster *</label>
                    <select
                      value={productFormData.cluster}
                      onChange={(e) => setProductFormData({ ...productFormData, cluster: e.target.value as TourismCluster })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Cultural Tourism">Cultural Tourism</option>
                      <option value="Eco-tourism">Eco-tourism</option>
                      <option value="Agri-tourism">Agri-tourism</option>
                      <option value="Adventure Tourism">Adventure Tourism</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Product Type *</label>
                    <select
                      value={productFormData.productType}
                      onChange={(e) => setProductFormData({ ...productFormData, productType: e.target.value as 'Existing' | 'Proposed' })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Existing">Existing (Currently Operational)</option>
                      <option value="Proposed">Proposed (Pipeline / Feasibility)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Product Lifecycle Stage *</label>
                    <select
                      value={productFormData.lifecycle}
                      onChange={(e) => setProductFormData({ ...productFormData, lifecycle: e.target.value as ProductLifecycleStage })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Introduction">Introduction</option>
                      <option value="Growth">Growth</option>
                      <option value="Maturity">Maturity</option>
                      <option value="Decline / Revitalization">Decline / Revitalization</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Development Maturation Status *</label>
                    <select
                      value={productFormData.developmentStatus}
                      onChange={(e) => setProductFormData({ ...productFormData, developmentStatus: e.target.value as ProductDevelopmentStatus })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Concept / Ideation">Concept / Ideation</option>
                      <option value="Feasibility Study">Feasibility Study</option>
                      <option value="Infrastructure / Site Development">Infrastructure / Site Development</option>
                      <option value="Pilot Testing / Trial Run">Pilot Testing / Trial Run</option>
                      <option value="Commercial Operations">Commercial Operations</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Barangay Location *</label>
                    <input
                      type="text"
                      required
                      value={productFormData.barangay}
                      onChange={(e) => setProductFormData({ ...productFormData, barangay: e.target.value })}
                      placeholder="e.g. Datal Tampal, Alkikan, Poblacion"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Lead Organization / Operator</label>
                    <input
                      type="text"
                      value={productFormData.leadOrganization}
                      onChange={(e) => setProductFormData({ ...productFormData, leadOrganization: e.target.value })}
                      placeholder="e.g. Lamlifew Women Weavers Association"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Community Stakeholders & Partners</label>
                  <input
                    type="text"
                    value={productFormData.communityStakeholders}
                    onChange={(e) => setProductFormData({ ...productFormData, communityStakeholders: e.target.value })}
                    placeholder="e.g. Blaan Tribal Council, Barangay LGU, Youth Guiding Guild"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Market Description</label>
                  <input
                    type="text"
                    value={productFormData.targetMarket}
                    onChange={(e) => setProductFormData({ ...productFormData, targetMarket: e.target.value })}
                    placeholder="e.g. Heritage researchers, eco-backpackers, coffee enthusiasts"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Investment Required (PHP) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productFormData.investmentRequired}
                      onChange={(e) => setProductFormData({ ...productFormData, investmentRequired: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">PRI Evaluation Score (0-100) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={productFormData.evaluationScore}
                      onChange={(e) => setProductFormData({ ...productFormData, evaluationScore: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-purple-700"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Readiness Status *</label>
                    <select
                      value={productFormData.readinessStatus}
                      onChange={(e) => setProductFormData({ ...productFormData, readinessStatus: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Ready for Promotion">Ready for Promotion</option>
                      <option value="Requires Facility Upgrades">Requires Facility Upgrades</option>
                      <option value="Under Community Validation">Under Community Validation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Key Components & Features (comma-separated)</label>
                  <input
                    type="text"
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="e.g. School of Living Traditions, Mabal Tabih Weaving, Homestay Stay"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Capacity Building Trainings Conducted (comma-separated)</label>
                  <input
                    type="text"
                    value={trainingsInput}
                    onChange={(e) => setTrainingsInput(e.target.value)}
                    placeholder="e.g. Interpretive Cultural Guiding, Food Safety, Swift Water Rescue"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  {isEditingProduct ? 'Update Product' : 'Create Tourism Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LOG CAPACITY TRAINING */}
      {/* ========================================================= */}
      {isTrainingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200">
            <form onSubmit={handleSaveTraining}>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Log Community Capacity Building Workshop</h3>
                <button
                  type="button"
                  onClick={() => setIsTrainingModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={trainingFormData.title}
                    onChange={(e) => setTrainingFormData({ ...trainingFormData, title: e.target.value })}
                    placeholder="e.g. Basic Mountaineering & Eco-Guiding Standards"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Cluster *</label>
                    <select
                      value={trainingFormData.cluster}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, cluster: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Cultural Tourism">Cultural Tourism</option>
                      <option value="Eco-tourism">Eco-tourism</option>
                      <option value="Agri-tourism">Agri-tourism</option>
                      <option value="Adventure Tourism">Adventure Tourism</option>
                      <option value="Cross-Cutting">Cross-Cutting / All</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Partner Agency *</label>
                    <input
                      type="text"
                      required
                      value={trainingFormData.partnerAgency}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, partnerAgency: e.target.value })}
                      placeholder="e.g. DOT Region XII, TESDA, NCIP"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Date Conducted *</label>
                    <input
                      type="date"
                      required
                      value={trainingFormData.dateConducted}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, dateConducted: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Duration (Hours) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={trainingFormData.durationHours}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, durationHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Training Venue / Barangay *</label>
                  <input
                    type="text"
                    required
                    value={trainingFormData.venue}
                    onChange={(e) => setTrainingFormData({ ...trainingFormData, venue: e.target.value })}
                    placeholder="e.g. Municipal Tourism Center, Poblacion"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Total Pax *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={trainingFormData.participantsCount}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, participantsCount: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Female Pax</label>
                    <input
                      type="number"
                      min="0"
                      value={trainingFormData.femaleParticipants}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, femaleParticipants: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">IP Pax</label>
                    <input
                      type="number"
                      min="0"
                      value={trainingFormData.ipParticipants}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, ipParticipants: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Certified</label>
                    <input
                      type="number"
                      min="0"
                      value={trainingFormData.certifiedCount}
                      onChange={(e) => setTrainingFormData({ ...trainingFormData, certifiedCount: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTrainingModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  Save Training Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD INVESTMENT OPPORTUNITY */}
      {/* ========================================================= */}
      {isInvestmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200">
            <form onSubmit={handleSaveInvestment}>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Add Tourism Investment Package</h3>
                <button
                  type="button"
                  onClick={() => setIsInvestmentModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={investmentFormData.projectTitle}
                    onChange={(e) => setInvestmentFormData({ ...investmentFormData, projectTitle: e.target.value })}
                    placeholder="e.g. Kalon Barak Skyline Glamping & Skywalk"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Cluster *</label>
                    <select
                      value={investmentFormData.cluster}
                      onChange={(e) => setInvestmentFormData({ ...investmentFormData, cluster: e.target.value as TourismCluster })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Cultural Tourism">Cultural Tourism</option>
                      <option value="Eco-tourism">Eco-tourism</option>
                      <option value="Agri-tourism">Agri-tourism</option>
                      <option value="Adventure Tourism">Adventure Tourism</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Barangay *</label>
                    <input
                      type="text"
                      required
                      value={investmentFormData.barangay}
                      onChange={(e) => setInvestmentFormData({ ...investmentFormData, barangay: e.target.value })}
                      placeholder="e.g. Poblacion, Upper Mainit"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Estimated Capital (PHP) *</label>
                    <input
                      type="number"
                      required
                      min="100000"
                      value={investmentFormData.estimatedCapital}
                      onChange={(e) => setInvestmentFormData({ ...investmentFormData, estimatedCapital: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Projected Payback (Years) *</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      min="1"
                      value={investmentFormData.projectedPaybackYears}
                      onChange={(e) => setInvestmentFormData({ ...investmentFormData, projectedPaybackYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Business Model *</label>
                    <select
                      value={investmentFormData.businessModel}
                      onChange={(e) => setInvestmentFormData({ ...investmentFormData, businessModel: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Public-Private Partnership (PPP)">Public-Private Partnership (PPP)</option>
                      <option value="LGU-Community Cooperative">LGU-Community Cooperative</option>
                      <option value="Joint Venture">Joint Venture</option>
                      <option value="Private Concession">Private Concession</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Readiness Tier *</label>
                    <select
                      value={investmentFormData.readiness}
                      onChange={(e) => setInvestmentFormData({ ...investmentFormData, readiness: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="Bankable / Investment-Ready">Bankable / Investment-Ready</option>
                      <option value="Feasibility Underway">Feasibility Underway</option>
                      <option value="Concept Pipeline">Concept Pipeline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Brief Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={investmentFormData.briefDescription}
                    onChange={(e) => setInvestmentFormData({ ...investmentFormData, briefDescription: e.target.value })}
                    placeholder="Outline the core concept, footprint, and market positioning..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">LGU Investment Code Incentives</label>
                  <input
                    type="text"
                    value={investmentFormData.lguIncentives}
                    onChange={(e) => setInvestmentFormData({ ...investmentFormData, lguIncentives: e.target.value })}
                    placeholder="e.g. 5-year municipal business tax exemption, road access priority"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInvestmentModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                >
                  Save Investment Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Delete Tourism Product</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong>"{productToDelete.productName}"</strong> from the official municipal catalog? This action will be recorded in the system audit trail.
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
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PRINT MODAL: LGU TPDU FORM 01 - SCORECARD */}
      {/* ========================================================= */}
      {isPrintScorecardOpen && formProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-8 space-y-6">
            {/* Header & Letterhead */}
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <div className="text-[11px] uppercase tracking-widest text-slate-500">Republic of the Philippines</div>
              <div className="text-xs font-bold text-slate-700">PROVINCE OF SARANGANI</div>
              <div className="text-sm font-black text-slate-900">{municipalityInfo.name.toUpperCase()}</div>
              <div className="text-xs font-bold text-purple-900">MUNICIPAL TOURISM OFFICE</div>
              <div className="text-[10px] text-slate-500">{municipalityInfo.officeLocation}</div>
              <div className="pt-2 text-xs font-black uppercase tracking-wider text-slate-900">
                LGU TPDU FORM 01: OFFICIAL TOURISM PRODUCT EVALUATION & READINESS SCORECARD
              </div>
            </div>

            {/* Product Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-4 rounded-lg bg-slate-50">
              <div>
                <div><strong>Product Name:</strong> {formProduct.productName}</div>
                <div><strong>Cluster:</strong> {formProduct.cluster}</div>
                <div><strong>Type & Lifecycle:</strong> {formProduct.productType || 'Existing'} • {formProduct.lifecycle || 'Introduction'}</div>
              </div>
              <div>
                <div><strong>Location:</strong> Barangay {formProduct.barangay || 'Poblacion'}, Malungon</div>
                <div><strong>Lead Organization:</strong> {formProduct.leadOrganization || formProduct.communityStakeholders}</div>
                <div><strong>Evaluation Date:</strong> {formProduct.lastEvaluatedDate || new Date().toISOString().split('T')[0]}</div>
              </div>
            </div>

            {/* Scorecard Table */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Multi-Factor Criteria Breakdown (100% Total Scale)
              </div>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2">Evaluation Pillar</th>
                    <th className="p-2 text-center">Weight</th>
                    <th className="p-2 text-center">Benchmark Rating</th>
                    <th className="p-2 text-center">Weighted Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2">
                      <div className="font-semibold text-slate-900">1. Attractiveness, Authenticity & Uniqueness</div>
                      <div className="text-[10px] text-slate-500">Cultural integrity, biodiversity value, uniqueness to Sarangani</div>
                    </td>
                    <td className="p-2 text-center font-bold">25%</td>
                    <td className="p-2 text-center font-mono">92%</td>
                    <td className="p-2 text-center font-mono font-bold text-slate-900">23.0%</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      <div className="font-semibold text-slate-900">2. Community Readiness & Local Ownership</div>
                      <div className="text-[10px] text-slate-500">IP governance, CBT cooperative cohesion, equitable benefit-sharing</div>
                    </td>
                    <td className="p-2 text-center font-bold">25%</td>
                    <td className="p-2 text-center font-mono">90%</td>
                    <td className="p-2 text-center font-mono font-bold text-slate-900">22.5%</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      <div className="font-semibold text-slate-900">3. Infrastructure, Comfort & Accessibility</div>
                      <div className="text-[10px] text-slate-500">Road access, clean restrooms, potable water, telecommunication</div>
                    </td>
                    <td className="p-2 text-center font-bold">20%</td>
                    <td className="p-2 text-center font-mono">80%</td>
                    <td className="p-2 text-center font-mono font-bold text-slate-900">16.0%</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      <div className="font-semibold text-slate-900">4. Environmental & Cultural Sustainability</div>
                      <div className="text-[10px] text-slate-500">Carrying capacity adherence, waste management, Leave No Trace</div>
                    </td>
                    <td className="p-2 text-center font-bold">15%</td>
                    <td className="p-2 text-center font-mono">95%</td>
                    <td className="p-2 text-center font-mono font-bold text-slate-900">14.25%</td>
                  </tr>
                  <tr>
                    <td className="p-2">
                      <div className="font-semibold text-slate-900">5. Safety, Disaster Risk & Health Protocols</div>
                      <div className="text-[10px] text-slate-500">Emergency first responders, life support gear, MDRRMO coordination</div>
                    </td>
                    <td className="p-2 text-center font-bold">15%</td>
                    <td className="p-2 text-center font-mono">88%</td>
                    <td className="p-2 text-center font-mono font-bold text-slate-900">13.2%</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t border-slate-200">
                  <tr>
                    <td className="p-2 text-slate-900">COMPOSITE PRODUCT READINESS INDEX (PRI)</td>
                    <td className="p-2 text-center">100%</td>
                    <td className="p-2 text-center">-</td>
                    <td className="p-2 text-center font-mono text-base text-purple-900">{formProduct.evaluationScore}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Classification & Verdict */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 text-xs space-y-1">
              <div className="font-bold text-purple-950">Official Technical Classification:</div>
              <p className="text-purple-900 leading-relaxed">
                The product qualifies under <strong>Level 4: Market-Ready / Flagship Status</strong>. It is hereby authorized for inclusion in official promotional itineraries, digital promotional videos, and national travel expo packages endorsed by the Municipal Tourism Office.
              </p>
            </div>

            {/* Signature Blocks */}
            <div className="grid grid-cols-2 gap-8 pt-8 text-xs">
              <div className="text-center space-y-1">
                <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
                  ENGR. JAYSON V. MORALES
                </div>
                <div className="text-[11px] text-slate-500">Senior Tourism Product Development Officer</div>
                <div className="text-[10px] text-slate-400">Evaluator & Technical Inspector</div>
              </div>

              <div className="text-center space-y-1">
                <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
                  {municipalityInfo.officerInCharge}
                </div>
                <div className="text-[11px] text-slate-500">{municipalityInfo.officerPosition}</div>
                <div className="text-[10px] text-slate-400">Approving Authority</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setIsPrintScorecardOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Scorecard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PRINT MODAL: LGU TPDU FORM 02 - INVESTMENT PITCH PROFILE */}
      {/* ========================================================= */}
      {isPrintPitchOpen && formProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-8 space-y-6">
            {/* Header & Letterhead */}
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <div className="text-[11px] uppercase tracking-widest text-slate-500">Republic of the Philippines</div>
              <div className="text-xs font-bold text-slate-700">PROVINCE OF SARANGANI</div>
              <div className="text-sm font-black text-slate-900">{municipalityInfo.name.toUpperCase()}</div>
              <div className="text-xs font-bold text-purple-900">MUNICIPAL TOURISM OFFICE & INVESTMENT BOARD</div>
              <div className="text-[10px] text-slate-500">{municipalityInfo.officeLocation}</div>
              <div className="pt-2 text-xs font-black uppercase tracking-wider text-slate-900">
                LGU TPDU FORM 02: TOURISM PRODUCT BRIEF & CAPITAL INVESTMENT PROFILE
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">{formProduct.productName}</div>
              <p className="text-slate-600 leading-relaxed">
                Packaged tourism investment opportunity under the <strong>{formProduct.cluster}</strong> pillar of Malungon, located in Barangay {formProduct.barangay || 'Poblacion'}. This asset offers an integrated experiential package combining cultural authenticity, environmental preservation, and sustainable community livelihoods.
              </p>
            </div>

            {/* Financial & Economic Metrics Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Financial & Operating Parameter</th>
                    <th className="p-3">Project Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Total Capital Investment Requirement</td>
                    <td className="p-3 font-mono font-bold text-purple-900">₱{formProduct.investmentRequired.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Recommended Business Vehicle</td>
                    <td className="p-3 text-slate-700">Public-Private Partnership (PPP) / LGU-Community Cooperative</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Target Market Profile</td>
                    <td className="p-3 text-slate-700">{formProduct.targetMarket}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Host Community Stakeholders</td>
                    <td className="p-3 text-slate-700">{formProduct.communityStakeholders}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Product Readiness Index (PRI)</td>
                    <td className="p-3 font-bold text-emerald-700">{formProduct.evaluationScore}% (Certified Ready)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">Municipal Incentive Coverage</td>
                    <td className="p-3 text-slate-700">
                      Eligible for 5-Year Local Business Tax Holiday per Malungon Investment Code Ordinance No. 2023-014
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Endorsement Statement */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-900">Municipal Tourism Office Guarantee:</div>
              <p className="text-slate-600 leading-relaxed">
                The Municipal Tourism Office of Malungon undertakes to assist prospective investors and community enterprises in obtaining Free, Prior, and Informed Consent (FPIC-NCIP), Environmental Compliance Clearances (ECC-DENR), and DOT Region XII accreditation.
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-6 text-xs">
              <div className="text-center space-y-1">
                <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
                  {municipalityInfo.officerInCharge}
                </div>
                <div className="text-[11px] text-slate-500">{municipalityInfo.officerPosition}</div>
              </div>

              <div className="text-center space-y-1">
                <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
                  {municipalityInfo.mayorName}
                </div>
                <div className="text-[11px] text-slate-500">{municipalityInfo.mayorTitle}</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={() => setIsPrintPitchOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Investment Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

