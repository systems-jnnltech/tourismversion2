import React, { useState } from 'react';
import {
  WalletCards,
  Users,
  Package,
  TrendingUp,
  Plus,
  Search,
  Download,
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
  Briefcase,
  Laptop,
  Car,
  ShieldCheck,
  Edit2,
  Trash2,
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
  Coins,
  Award,
  Sparkles,
  Building2,
  UserCheck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Tag
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import { EmployeeRecord, OfficeInventoryItem, FinancialMonitoringRecord } from '../../types';

type AdminTab = 'budget' | 'personnel' | 'inventory';

export const AdminFinanceView: React.FC = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    financial,
    updateFinancial,
    isReadOnly
  } = useTourism();

  // Active Division Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('budget');

  // Search and Filters
  const [personnelSearch, setPersonnelSearch] = useState('');
  const [filterAppointment, setFilterAppointment] = useState('ALL');
  const [filterEmpStatus, setFilterEmpStatus] = useState('ALL');

  const [inventorySearch, setInventorySearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterCondition, setFilterCondition] = useState('ALL');

  const [txSearch, setTxSearch] = useState('');
  const [filterTxType, setFilterTxType] = useState('ALL');

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [dossierEmployee, setDossierEmployee] = useState<EmployeeRecord | null>(null);
  const [printableServiceRecord, setPrintableServiceRecord] = useState<EmployeeRecord | null>(null);

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [printablePAR, setPrintablePAR] = useState<OfficeInventoryItem | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  // Employee Form State (10 official docx fields)
  const initialEmployeeForm: Omit<EmployeeRecord, 'id'> = {
    employeeNumber: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    appointment: 'Permanent',
    position: 'Tourism Operations Officer I',
    employmentStatus: 'Active',
    leaveCredits: 15,
    dailyTimeRecordHoursThisMonth: 168,
    performanceEvaluationRating: 'Outstanding (4.8/5)',
    trainings: ['DOT Tour Guiding Accreditation', 'First Aid & Emergency Response'],
    designation: 'Field Operations & Site Coordination',
    serviceRecordYears: 3,
    email: '',
    contact: '+63 917 000 1122',
  };
  const [employeeFormData, setEmployeeFormData] = useState(initialEmployeeForm);
  const [employeeTrainingsText, setEmployeeTrainingsText] = useState('');

  // Inventory Form State (9 official docx fields)
  const initialInventoryForm: Omit<OfficeInventoryItem, 'id'> = {
    propertyNumber: `MAL-MTO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    itemName: '',
    category: 'ICT Equipment',
    condition: 'Serviceable',
    acquisitionDate: new Date().toISOString().substring(0, 10),
    acquisitionCost: 25000,
    assignedTo: 'Tourism Staff',
    location: 'Municipal Tourism Office, 2nd Flr',
    disposalRecord: '',
  };
  const [inventoryFormData, setInventoryFormData] = useState(initialInventoryForm);

  // Budget Adjuster Form State
  const [budgetFormData, setBudgetFormData] = useState({
    annualBudget: financial.annualBudget,
    obligations: financial.obligations,
    disbursement: financial.disbursement,
    annualProcurementPlanStatus: financial.annualProcurementPlanStatus,
  });

  // Transaction Form State
  const [txFormData, setTxFormData] = useState({
    id: `TX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().substring(0, 10),
    description: '',
    type: 'PR' as 'PR' | 'PO' | 'Disbursement' | 'Liquidation',
    amount: 50000,
    status: 'Approved' as 'Approved' | 'Processing' | 'Pending',
  });

  // Financial calculations
  const budgetUtilization = Math.round((financial.obligations / (financial.annualBudget || 1)) * 100);
  const disbursementRate = Math.round((financial.disbursement / (financial.obligations || 1)) * 100);
  const unobligatedBalance = Math.max(0, financial.annualBudget - financial.obligations);

  // Allotment breakdown (LGU Accounting standards)
  const breakdownPS = Math.round(financial.annualBudget * 0.42);
  const breakdownMOOE = Math.round(financial.annualBudget * 0.43);
  const breakdownCO = Math.round(financial.annualBudget * 0.15);

  const allotmentPieData = [
    { name: 'Personnel Services (PS)', value: breakdownPS, color: '#059669' },
    { name: 'Maintenance & Other (MOOE)', value: breakdownMOOE, color: '#4f46e5' },
    { name: 'Capital Outlay (CO)', value: breakdownCO, color: '#d97706' },
  ];

  // Filtered lists
  const filteredEmployees = employees.filter((emp) => {
    const term = personnelSearch.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term) ||
      emp.employeeNumber.toLowerCase().includes(term) ||
      emp.designation.toLowerCase().includes(term);

    const matchesApp = filterAppointment === 'ALL' || emp.appointment === filterAppointment;
    const matchesStatus = filterEmpStatus === 'ALL' || emp.employmentStatus === filterEmpStatus;

    return matchesSearch && matchesApp && matchesStatus;
  });

  const filteredInventory = inventory.filter((item) => {
    const term = inventorySearch.toLowerCase();
    const matchesSearch =
      item.itemName.toLowerCase().includes(term) ||
      item.propertyNumber.toLowerCase().includes(term) ||
      item.assignedTo.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term);

    const matchesCat = filterCategory === 'ALL' || item.category === filterCategory;
    const matchesCond = filterCondition === 'ALL' || item.condition === filterCondition;

    return matchesSearch && matchesCat && matchesCond;
  });

  const filteredTransactions = (financial.recentTransactions || []).filter((tx) => {
    const term = txSearch.toLowerCase();
    const matchesSearch = tx.description.toLowerCase().includes(term) || tx.id.toLowerCase().includes(term);
    const matchesType = filterTxType === 'ALL' || tx.type === filterTxType;
    return matchesSearch && matchesType;
  });

  // Total inventory book value
  const totalInventoryCost = inventory.reduce((sum, item) => sum + (item.acquisitionCost || 0), 0);
  const serviceableInventoryCount = inventory.filter((item) => item.condition === 'Serviceable').length;

  // Handlers for Employees
  const handleOpenEmployeeForm = (emp?: EmployeeRecord) => {
    if (emp) {
      setEditingEmployeeId(emp.id);
      setEmployeeFormData({
        employeeNumber: emp.employeeNumber,
        name: emp.name,
        appointment: emp.appointment,
        position: emp.position,
        employmentStatus: emp.employmentStatus,
        leaveCredits: emp.leaveCredits,
        dailyTimeRecordHoursThisMonth: emp.dailyTimeRecordHoursThisMonth,
        performanceEvaluationRating: emp.performanceEvaluationRating,
        trainings: emp.trainings,
        designation: emp.designation,
        serviceRecordYears: emp.serviceRecordYears,
        email: emp.email,
        contact: emp.contact,
      });
      setEmployeeTrainingsText(emp.trainings.join('\n'));
    } else {
      setEditingEmployeeId(null);
      setEmployeeFormData({
        ...initialEmployeeForm,
        employeeNumber: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      setEmployeeTrainingsText(initialEmployeeForm.trainings.join('\n'));
    }
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeFormData.name.trim()) return;

    const payload: Omit<EmployeeRecord, 'id'> = {
      ...employeeFormData,
      trainings: employeeTrainingsText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
    };

    if (editingEmployeeId) {
      updateEmployee(editingEmployeeId, payload);
    } else {
      addEmployee(payload);
    }
    setIsEmployeeModalOpen(false);
  };

  // Handlers for Inventory
  const handleOpenInventoryForm = (item?: OfficeInventoryItem) => {
    if (item) {
      setEditingInventoryId(item.id);
      setInventoryFormData({
        propertyNumber: item.propertyNumber,
        itemName: item.itemName,
        category: item.category,
        condition: item.condition,
        acquisitionDate: item.acquisitionDate,
        acquisitionCost: item.acquisitionCost,
        assignedTo: item.assignedTo,
        location: item.location,
        disposalRecord: item.disposalRecord || '',
      });
    } else {
      setEditingInventoryId(null);
      setInventoryFormData({
        ...initialInventoryForm,
        propertyNumber: `MAL-MTO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      });
    }
    setIsInventoryModalOpen(true);
  };

  const handleSaveInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryFormData.itemName.trim()) return;

    if (editingInventoryId) {
      updateInventoryItem(editingInventoryId, inventoryFormData);
    } else {
      addInventoryItem(inventoryFormData);
    }
    setIsInventoryModalOpen(false);
  };

  // Handlers for Financial
  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinancial(budgetFormData);
    setIsBudgetModalOpen(false);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txFormData.description.trim()) return;

    const updatedTransactions = [txFormData, ...(financial.recentTransactions || [])];
    updateFinancial({ recentTransactions: updatedTransactions });
    setIsTxModalOpen(false);
    setTxFormData({
      id: `TX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().substring(0, 10),
      description: '',
      type: 'PR',
      amount: 50000,
      status: 'Approved',
    });
  };

  // CSV Exports
  const handleExportPersonnelCSV = () => {
    const headers = [
      'Employee Number',
      'Full Name',
      'Position',
      'Designation',
      'Appointment Status',
      'Employment Status',
      'Leave Credits (Days)',
      'DTR Hours Logged',
      'Performance Evaluation (SPMS/IPCR)',
      'Service Record (Years)',
      'Contact Number',
      'Email Address',
      'Trainings Completed',
    ];

    const rows = filteredEmployees.map((emp) => [
      `"${emp.employeeNumber}"`,
      `"${emp.name.replace(/"/g, '""')}"`,
      `"${emp.position.replace(/"/g, '""')}"`,
      `"${emp.designation.replace(/"/g, '""')}"`,
      `"${emp.appointment}"`,
      `"${emp.employmentStatus}"`,
      emp.leaveCredits,
      emp.dailyTimeRecordHoursThisMonth,
      `"${emp.performanceEvaluationRating}"`,
      emp.serviceRecordYears,
      `"${emp.contact}"`,
      `"${emp.email}"`,
      `"${emp.trainings.join('; ').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `MTO_Personnel_Plantilla_Roster_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportInventoryCSV = () => {
    const headers = [
      'Property Number',
      'Item Description',
      'GSO Category',
      'Acquisition Date',
      'Acquisition Cost (PHP)',
      'Assigned Custodian',
      'Physical Location',
      'Condition',
      'Disposal Record',
    ];

    const rows = filteredInventory.map((item) => [
      `"${item.propertyNumber}"`,
      `"${item.itemName.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.acquisitionDate}"`,
      item.acquisitionCost,
      `"${item.assignedTo.replace(/"/g, '""')}"`,
      `"${item.location.replace(/"/g, '""')}"`,
      `"${item.condition}"`,
      `"${item.disposalRecord || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `MTO_Physical_Inventory_GSO_Registry_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportFinancialCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Description', 'Transaction Type', 'Amount (PHP)', 'Status'];
    const rows = filteredTransactions.map((tx) => [
      `"${tx.id}"`,
      `"${tx.date}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${tx.type}"`,
      tx.amount,
      `"${tx.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `MTO_Financial_Transactions_Register_${new Date().toISOString().substring(0, 10)}.csv`;
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
            <WalletCards className="w-4 h-4" />
            <span>MODULE G • Administrative and Finance Section (AFS)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Administrative & Finance Section (AFS)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official municipal administration of Civil Service personnel records, physical asset inventory, and COA/DBM budget execution.
          </p>
        </div>

        {/* Division Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'budget'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financial Monitoring</span>
          </button>

          <button
            onClick={() => setActiveTab('personnel')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'personnel'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Personnel Records ({employees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Office Inventory ({inventory.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DIVISION 1: FINANCIAL MONITORING & BUDGET EXECUTION                       */}
      {/* ========================================================================= */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          {/* Top KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Approved Annual Budget</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{financial.annualBudget.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">FY {financial.fiscalYear} Appropriation</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Obligated Allotments</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{financial.obligations.toLocaleString()}</div>
              <div className="text-xs text-indigo-600 font-semibold mt-1">
                {budgetUtilization}% Budget Utilization Rate (BUR)
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, budgetUtilization)}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Disbursements Paid</span>
                <Coins className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{financial.disbursement.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">
                {disbursementRate}% Disbursement Efficiency
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(100, disbursementRate)}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Unobligated Balance</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">₱{unobligatedBalance.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Remaining for operating expenses</div>
            </div>
          </div>

          {/* Allotment Classes Breakdown (PS, MOOE, CO) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Personnel Services (PS)</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-medium border border-emerald-200">
                  Account 100
                </span>
              </div>
              <div className="text-xl font-bold text-slate-900">₱{breakdownPS.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">
                Civil service basic salaries, PERA, RATA, Year-end bonus, PhilHealth, GSIS, HDMF
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Maintenance & Other (MOOE)</span>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-medium border border-indigo-200">
                  Account 200
                </span>
              </div>
              <div className="text-xl font-bold text-slate-900">₱{breakdownMOOE.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">
                Travel expenses, supplies, festival subsidies, promotional materials, utilities
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Capital Outlay (CO)</span>
                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-mono font-medium border border-amber-200">
                  Account 300
                </span>
              </div>
              <div className="text-xl font-bold text-slate-900">₱{breakdownCO.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">
                Eco-tourism trail fixtures, IT server infrastructure, survey drones, and office hardware
              </p>
            </div>
          </div>

          {/* Transactions Register */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Purchase Requests, Orders & Disbursements Register</h3>
                <p className="text-xs text-slate-500">
                  PR, PO, Cash Advance, and Liquidation vouchers • APP Status: <strong className="text-indigo-600">{financial.annualProcurementPlanStatus}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportFinancialCSV}
                  className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export Financial CSV</span>
                </button>
                {!isReadOnly && (
                  <>
                    <button
                      onClick={() => setIsTxModalOpen(true)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Transaction</span>
                    </button>
                    <button
                      onClick={() => setIsBudgetModalOpen(true)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Adjust Budget</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Transaction Filter Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transaction description or reference ID..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={filterTxType}
                onChange={(e) => setFilterTxType(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Transaction Types</option>
                <option value="PR">Purchase Request (PR)</option>
                <option value="PO">Purchase Order (PO)</option>
                <option value="Disbursement">Disbursement Voucher (DV)</option>
                <option value="Liquidation">Liquidation Report</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 font-semibold uppercase text-[11px] text-slate-500 border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Reference ID & Date</th>
                    <th className="px-4 py-3">Transaction Particulars</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Amount (PHP)</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-slate-900">{tx.id}</div>
                        <div className="text-[10px] text-slate-400">{tx.date}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{tx.description}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">₱{tx.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            tx.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {tx.status}
                        </span>
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
      {/* DIVISION 2: PERSONNEL RECORDS & PLANTILLA                                  */}
      {/* ========================================================================= */}
      {activeTab === 'personnel' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff name, employee number, or position..."
                value={personnelSearch}
                onChange={(e) => setPersonnelSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterAppointment}
                onChange={(e) => setFilterAppointment(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Appointments</option>
                <option value="Permanent">Permanent</option>
                <option value="Casual">Casual</option>
                <option value="Job Order (JO)">Job Order (JO)</option>
                <option value="Contract of Service">Contract of Service</option>
                <option value="Co-terminus">Co-terminus</option>
              </select>

              <select
                value={filterEmpStatus}
                onChange={(e) => setFilterEmpStatus(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Employment Statuses</option>
                <option value="Active">Active</option>
                <option value="On Official Leave">On Official Leave</option>
                <option value="On Field Duty">On Field Duty</option>
              </select>

              <button
                onClick={handleExportPersonnelCSV}
                className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Roster CSV</span>
              </button>

              {!isReadOnly && (
                <button
                  onClick={() => handleOpenEmployeeForm()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enrol Employee</span>
                </button>
              )}
            </div>
          </div>

          {/* Personnel Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Civil Service Plantilla & Human Resource Roster</h3>
                <p className="text-xs text-slate-500">SPMS performance evaluation ratings, leave credits, and DTR logs</p>
              </div>
              <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                100% SPMS Appraisals Filed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Staff Name & Position</th>
                    <th className="px-4 py-3.5">Appointment Status</th>
                    <th className="px-4 py-3.5">Contact & Email</th>
                    <th className="px-3 py-3.5">Leave Balance</th>
                    <th className="px-3 py-3.5">SPMS / IPCR Rating</th>
                    <th className="px-3 py-3.5">DTR Hours</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-sm">{emp.name}</div>
                        <div className="text-xs text-slate-500">{emp.position}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">ID: {emp.employeeNumber}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            emp.appointment === 'Permanent'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : emp.appointment === 'Casual'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {emp.appointment}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">Tenure: {emp.serviceRecordYears} yrs</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-mono text-slate-800">{emp.contact}</div>
                        <div className="text-xs text-slate-500">{emp.email}</div>
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="font-semibold text-slate-800">{emp.leaveCredits} Days</div>
                        <div className="text-[10px] text-slate-400">VL/SL Balance</div>
                      </td>

                      <td className="px-3 py-3.5">
                        <div className="font-bold text-indigo-600">{emp.performanceEvaluationRating}</div>
                        <div className="text-[10px] text-slate-500">Status: {emp.employmentStatus}</div>
                      </td>

                      <td className="px-3 py-3.5 font-semibold text-slate-800">
                        {emp.dailyTimeRecordHoursThisMonth} hrs / mo
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setDossierEmployee(emp)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100"
                            title="View Staff Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPrintableServiceRecord(emp)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                            title="Print Service Record"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {!isReadOnly && (
                            <>
                              <button
                                onClick={() => handleOpenEmployeeForm(emp)}
                                className="p-1.5 text-slate-400 hover:text-blue-700 rounded hover:bg-slate-100"
                                title="Edit Staff Record"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete record for ${emp.name}?`)) {
                                    deleteEmployee(emp.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-700 rounded hover:bg-slate-100"
                                title="Delete Staff Record"
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
      {/* DIVISION 3: OFFICE INVENTORY & ASSETS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Inventory KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Capitalized Assets</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{inventory.length} Items</div>
              <div className="text-xs text-slate-500 mt-1">LGU GSO Tagged Equipment</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Serviceable Assets</span>
              <div className="text-2xl font-bold text-emerald-800 mt-1">{serviceableInventoryCount} Items</div>
              <div className="text-xs text-emerald-700 font-medium mt-1">
                {Math.round((serviceableInventoryCount / (inventory.length || 1)) * 100)}% Operational Readiness
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Asset Book Value</span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">₱{totalInventoryCost.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Total property acquisition cost</div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search property description, property number, or custodian..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Categories</option>
                <option value="Office Equipment">Office Equipment</option>
                <option value="Furniture & Fixture">Furniture & Fixture</option>
                <option value="ICT Equipment">ICT Equipment</option>
                <option value="Vehicle Inventory">Vehicle Inventory</option>
                <option value="Office Supplies">Office Supplies</option>
              </select>

              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Conditions</option>
                <option value="Serviceable">Serviceable</option>
                <option value="Needs Minor Repair">Needs Minor Repair</option>
                <option value="Unserviceable / For Disposal">Unserviceable / For Disposal</option>
              </select>

              <button
                onClick={handleExportInventoryCSV}
                className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export GSO CSV</span>
              </button>

              {!isReadOnly && (
                <button
                  onClick={() => handleOpenInventoryForm()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Property Item</span>
                </button>
              )}
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">GSO Physical Inventory & Property Accountability</h3>
                <p className="text-xs text-slate-500">General Services Office property cards, locations, and condition auditing</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Property Description</th>
                    <th className="px-4 py-3.5">Property Tag / Location</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-3 py-3.5">Cost (PHP)</th>
                    <th className="px-3 py-3.5">Assigned Custodian</th>
                    <th className="px-3 py-3.5">Condition</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{item.itemName}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-700">
                        <div>{item.propertyNumber}</div>
                        <div className="text-[10px] text-slate-400 font-sans">Loc: {item.location}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 font-semibold text-slate-900">₱{item.acquisitionCost.toLocaleString()}</td>
                      <td className="px-3 py-3.5 text-slate-700">{item.assignedTo}</td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.condition === 'Serviceable'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.condition.includes('Needs')
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.condition}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setPrintablePAR(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                            title="Print Property Receipt (PAR)"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {!isReadOnly && (
                            <>
                              <button
                                onClick={() => handleOpenInventoryForm(item)}
                                className="p-1.5 text-slate-400 hover:text-blue-700 rounded hover:bg-slate-100"
                                title="Edit Item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete property record for ${item.itemName}?`)) {
                                    deleteInventoryItem(item.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-700 rounded hover:bg-slate-100"
                                title="Delete Item"
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
      {/* MODAL: ADD / EDIT EMPLOYEE                                                */}
      {/* ========================================================================= */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">
                  {editingEmployeeId ? 'Edit Personnel Plantilla Record' : 'Enrol New Tourism Staff / Official'}
                </h3>
                <p className="text-xs text-slate-400">Civil Service Commission Form 212 & LGU Plantilla</p>
              </div>
              <button
                onClick={() => setIsEmployeeModalOpen(false)}
                className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Employee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dennis Cabigon"
                    value={employeeFormData.name}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Number *</label>
                  <input
                    type="text"
                    required
                    value={employeeFormData.employeeNumber}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, employeeNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Civil Service Appointment *</label>
                  <select
                    value={employeeFormData.appointment}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, appointment: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Casual">Casual</option>
                    <option value="Job Order (JO)">Job Order (JO)</option>
                    <option value="Contract of Service">Contract of Service</option>
                    <option value="Co-terminus">Co-terminus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Status *</label>
                  <select
                    value={employeeFormData.employmentStatus}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, employmentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="On Official Leave">On Official Leave</option>
                    <option value="On Field Duty">On Field Duty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Record (Years)</label>
                  <input
                    type="number"
                    min={0}
                    value={employeeFormData.serviceRecordYears}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, serviceRecordYears: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plantilla Position *</label>
                  <input
                    type="text"
                    required
                    value={employeeFormData.position}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Functional Unit</label>
                  <input
                    type="text"
                    value={employeeFormData.designation}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Credits (Days)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={employeeFormData.leaveCredits}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, leaveCredits: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DTR Hours Logged</label>
                  <input
                    type="number"
                    min={0}
                    value={employeeFormData.dailyTimeRecordHoursThisMonth}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, dailyTimeRecordHoursThisMonth: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SPMS / IPCR Rating</label>
                  <input
                    type="text"
                    value={employeeFormData.performanceEvaluationRating}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, performanceEvaluationRating: e.target.value })}
                    placeholder="Outstanding (4.8/5)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={employeeFormData.email}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })}
                    placeholder="staff@malungon.gov.ph"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={employeeFormData.contact}
                    onChange={(e) => setEmployeeFormData({ ...employeeFormData, contact: e.target.value })}
                    placeholder="+63 917 123 4567"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trainings Attended (one per line)</label>
                <textarea
                  rows={2}
                  value={employeeTrainingsText}
                  onChange={(e) => setEmployeeTrainingsText(e.target.value)}
                  placeholder="DOT Tour Guiding&#10;First Aid & Basic Life Support"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingEmployeeId ? 'Save Staff Record' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT INVENTORY                                               */}
      {/* ========================================================================= */}
      {isInventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">
                  {editingInventoryId ? 'Edit Property Item Details' : 'Register New Office Property / Asset'}
                </h3>
                <p className="text-xs text-slate-400">LGU General Services Office (GSO) Property Accountability</p>
              </div>
              <button
                onClick={() => setIsInventoryModalOpen(false)}
                className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInventory} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Item Description / Specifications *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DJI Mavic 3 Enterprise Drone with RTK Module"
                    value={inventoryFormData.itemName}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, itemName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GSO Property Number *</label>
                  <input
                    type="text"
                    required
                    value={inventoryFormData.propertyNumber}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, propertyNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Category *</label>
                  <select
                    value={inventoryFormData.category}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="ICT Equipment">ICT Equipment</option>
                    <option value="Office Equipment">Office Equipment</option>
                    <option value="Furniture & Fixture">Furniture & Fixture</option>
                    <option value="Vehicle Inventory">Vehicle Inventory</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Condition *</label>
                  <select
                    value={inventoryFormData.condition}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, condition: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Serviceable">Serviceable</option>
                    <option value="Needs Minor Repair">Needs Minor Repair</option>
                    <option value="Unserviceable / For Disposal">Unserviceable / For Disposal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Acquisition Cost (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={inventoryFormData.acquisitionCost}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, acquisitionCost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Acquisition Date</label>
                  <input
                    type="date"
                    value={inventoryFormData.acquisitionDate}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, acquisitionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Custodian *</label>
                  <input
                    type="text"
                    required
                    value={inventoryFormData.assignedTo}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Room</label>
                  <input
                    type="text"
                    value={inventoryFormData.location}
                    onChange={(e) => setInventoryFormData({ ...inventoryFormData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Disposal Record / Decommissioning Notes (if applicable)</label>
                <input
                  type="text"
                  placeholder="e.g. Sangguniang Bayan Resolution 2026-05 for auction disposal"
                  value={inventoryFormData.disposalRecord}
                  onChange={(e) => setInventoryFormData({ ...inventoryFormData, disposalRecord: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsInventoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingInventoryId ? 'Save Property Item' : 'Register Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BUDGET ADJUSTMENT                                                  */}
      {/* ========================================================================= */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-base">Adjust Municipal Tourism Budget & Allotment</h3>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Approved Annual Budget (PHP)</label>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={budgetFormData.annualBudget}
                  onChange={(e) => setBudgetFormData({ ...budgetFormData, annualBudget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Obligated Allotments (PHP)</label>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={budgetFormData.obligations}
                  onChange={(e) => setBudgetFormData({ ...budgetFormData, obligations: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Disbursements Paid (PHP)</label>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={budgetFormData.disbursement}
                  onChange={(e) => setBudgetFormData({ ...budgetFormData, disbursement: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Procurement Plan (APP) Status</label>
                <select
                  value={budgetFormData.annualProcurementPlanStatus}
                  onChange={(e) => setBudgetFormData({ ...budgetFormData, annualProcurementPlanStatus: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                >
                  <option value="Approved by BAC">Approved by BAC</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Submitted to GPPB">Submitted to GPPB</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Update Appropriations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECORD TRANSACTION                                                 */}
      {/* ========================================================================= */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-base">Record Procurement / Disbursement Entry</h3>
              <button onClick={() => setIsTxModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Procurement of Eco-tourism Safety Equipment"
                  value={txFormData.description}
                  onChange={(e) => setTxFormData({ ...txFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Type</label>
                  <select
                    value={txFormData.type}
                    onChange={(e) => setTxFormData({ ...txFormData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="PR">Purchase Request (PR)</option>
                    <option value="PO">Purchase Order (PO)</option>
                    <option value="Disbursement">Disbursement Voucher</option>
                    <option value="Liquidation">Liquidation Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (PHP)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={txFormData.amount}
                    onChange={(e) => setTxFormData({ ...txFormData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={txFormData.date}
                    onChange={(e) => setTxFormData({ ...txFormData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Approval Status</label>
                  <select
                    value={txFormData.status}
                    onChange={(e) => setTxFormData({ ...txFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EMPLOYEE PROFILE DOSSIER                                           */}
      {/* ========================================================================= */}
      {dossierEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                  {dossierEmployee.appointment} • {dossierEmployee.employmentStatus}
                </span>
                <h3 className="text-xl font-bold mt-1 text-white">{dossierEmployee.name}</h3>
                <p className="text-xs text-slate-400">{dossierEmployee.position} • ID: {dossierEmployee.employeeNumber}</p>
              </div>
              <button onClick={() => setDossierEmployee(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Tenure</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{dossierEmployee.serviceRecordYears} Years</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Leave Balance</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{dossierEmployee.leaveCredits} Days</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">SPMS Rating</span>
                  <div className="text-sm font-bold text-indigo-600 mt-0.5">{dossierEmployee.performanceEvaluationRating}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">DTR Logged</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{dossierEmployee.dailyTimeRecordHoursThisMonth} hrs</div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-900 mb-1">Functional Designation:</div>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">{dossierEmployee.designation}</p>
              </div>

              <div>
                <div className="font-semibold text-slate-900 mb-1">Trainings & Certifications:</div>
                <div className="flex flex-wrap gap-1.5">
                  {dossierEmployee.trainings.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <span>Email: {dossierEmployee.email}</span>
                <span>Contact: {dossierEmployee.contact}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE SERVICE RECORD                                           */}
      {/* ========================================================================= */}
      {printableServiceRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2 text-xs">
                <Printer className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Official LGU Employee Service Record</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Print Document
                </button>
                <button
                  onClick={() => setPrintableServiceRecord(null)}
                  className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 space-y-6">
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <img
                    src="/logo/LGU_LOGO1.png"
                    alt="LGU Malungon Seal"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow shrink-0"
                  />
                  <div className="text-center flex-1">
                    <div className="text-[11px] uppercase tracking-widest text-slate-600 font-serif">Republic of the Philippines</div>
                    <div className="text-xs font-serif text-slate-700">Province of Sarangani • Municipality of Malungon</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-1">
                      OFFICE OF THE MUNICIPAL TOURISM OFFICER
                    </div>
                    <div className="text-[10px] text-slate-500 font-serif italic mt-0.5">
                      Civil Service Commission Form 12 • Official Service Record
                    </div>
                  </div>
                  <img
                    src="/logo/TourismLogo.png"
                    alt="Tourism Office Logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow shrink-0"
                  />
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                <div>
                  <h2 className="text-xl font-black uppercase text-slate-900">{printableServiceRecord.name}</h2>
                  <div className="text-xs text-slate-600">{printableServiceRecord.position}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-[10px] text-slate-400">EMPLOYEE NUMBER:</div>
                  <div className="font-mono font-bold text-slate-800">{printableServiceRecord.employeeNumber}</div>
                </div>
              </div>

              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600 w-1/3">Civil Service Appointment</td>
                    <td className="px-3 py-2 font-bold text-slate-900">{printableServiceRecord.appointment}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Employment Status</td>
                    <td className="px-3 py-2 font-bold text-emerald-800">{printableServiceRecord.employmentStatus}</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Years of Government Service</td>
                    <td className="px-3 py-2 font-bold">{printableServiceRecord.serviceRecordYears} Years</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Performance Evaluation (SPMS/IPCR)</td>
                    <td className="px-3 py-2 font-bold text-indigo-700">{printableServiceRecord.performanceEvaluationRating}</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Earned Leave Balance (VL/SL)</td>
                    <td className="px-3 py-2 font-bold">{printableServiceRecord.leaveCredits} Days</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold text-slate-600">Functional Designation</td>
                    <td className="px-3 py-2">{printableServiceRecord.designation}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-b border-slate-800 w-48 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">ADMINISTRATIVE OFFICER IV</div>
                  <div className="text-[10px] text-slate-500">HRMO / Personnel Officer</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-48 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">CRISTINA D. CONSTANTINO-LA PAZ</div>
                  <div className="text-[10px] text-slate-500">Municipal Tourism Action Officer-Designate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE PROPERTY ACKNOWLEDGEMENT RECEIPT (PAR)                   */}
      {/* ========================================================================= */}
      {printablePAR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2 text-xs">
                <Printer className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Property Acknowledgement Receipt (PAR / ICS)</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Print PAR
                </button>
                <button
                  onClick={() => setPrintablePAR(null)}
                  className="text-slate-400 hover:text-white rounded-lg p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 space-y-6">
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <img
                    src="/logo/LGU_LOGO1.png"
                    alt="LGU Malungon Seal"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow shrink-0"
                  />
                  <div className="text-center flex-1">
                    <div className="text-[11px] uppercase tracking-widest text-slate-600 font-serif">Republic of the Philippines</div>
                    <div className="text-xs font-serif text-slate-700">Province of Sarangani • Municipality of Malungon</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-slate-900 mt-1">
                      OFFICE OF THE MUNICIPAL GENERAL SERVICES OFFICER (GSO)
                    </div>
                    <div className="text-[10px] text-slate-500 font-serif italic mt-0.5">
                      Property Acknowledgement Receipt (PAR) • COA Circular 2020-006 Compliance
                    </div>
                  </div>
                  <img
                    src="/logo/TourismLogo.png"
                    alt="Tourism Office Logo"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow shrink-0"
                  />
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-slate-200 pb-2">
                <div>
                  <h2 className="text-lg font-black uppercase text-slate-900">{printablePAR.itemName}</h2>
                  <div className="text-xs text-slate-600">Category: {printablePAR.category}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-[10px] text-slate-400">GSO PROPERTY NO:</div>
                  <div className="font-mono font-bold text-slate-800">{printablePAR.propertyNumber}</div>
                </div>
              </div>

              <table className="w-full text-xs border border-slate-300">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600 w-1/3">Acquisition Date</td>
                    <td className="px-3 py-2">{printablePAR.acquisitionDate}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Acquisition Cost</td>
                    <td className="px-3 py-2 font-bold text-slate-900">₱{printablePAR.acquisitionCost.toLocaleString()}.00</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Designated Custodian</td>
                    <td className="px-3 py-2 font-bold text-indigo-700">{printablePAR.assignedTo}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-600">Physical Location</td>
                    <td className="px-3 py-2">{printablePAR.location}</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-600">Current Condition</td>
                    <td className="px-3 py-2 font-bold text-emerald-800">{printablePAR.condition}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="border-b border-slate-800 w-48 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">{printablePAR.assignedTo.toUpperCase()}</div>
                  <div className="text-[10px] text-slate-500">Received By (Accountable Officer)</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-48 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">MUNICIPAL GENERAL SERVICES OFFICER</div>
                  <div className="text-[10px] text-slate-500">Issued By (Supply Officer)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
