import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  Building,
  UserCheck,
  Edit2,
  Trash2,
  Eye,
  Printer,
  X,
  Filter,
  Download,
  AlertCircle,
  Gavel,
  FileWarning,
  Check,
  ChevronRight,
  Send,
  Building2,
  HelpCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { TourismPolicy, NoticeOfViolation, TouristComplaint } from '../../types';

type PolicyTab = 'ordinances' | 'inspections' | 'notices' | 'complaints';

export const PolicyRegulationView: React.FC = () => {
  const {
    policies,
    addPolicy,
    updatePolicy,
    deletePolicy,
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    resolveNotice,
    complaints,
    addComplaint,
    updateComplaintStatus,
    deleteComplaint,
    establishments,
    isReadOnly,
    municipalityInfo
  } = useTourism();

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<PolicyTab>('ordinances');

  // Search and Filters
  const [policySearch, setPolicySearch] = useState('');
  const [filterPolicyType, setFilterPolicyType] = useState('ALL');
  const [filterPolicyStatus, setFilterPolicyStatus] = useState('ALL');

  const [noticeSearch, setNoticeSearch] = useState('');
  const [filterNoticeStatus, setFilterNoticeStatus] = useState('ALL');

  const [complaintSearch, setComplaintSearch] = useState('');
  const [filterComplaintCategory, setFilterComplaintCategory] = useState('ALL');
  const [filterComplaintStatus, setFilterComplaintStatus] = useState('ALL');

  // Modals
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
  const [dossierPolicy, setDossierPolicy] = useState<TourismPolicy | null>(null);

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [printableNotice, setPrintableNotice] = useState<NoticeOfViolation | null>(null);

  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [settlementComplaint, setSettlementComplaint] = useState<TouristComplaint | null>(null);
  const [settlementNotes, setSettlementNotes] = useState('');
  const [printableSettlement, setPrintableSettlement] = useState<TouristComplaint | null>(null);

  // Policy Form State
  const initialPolicyForm: Omit<TourismPolicy, 'id'> = {
    referenceNumber: `SB Ord. No. ${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
    title: '',
    type: 'Municipal Ordinance',
    dateApproved: new Date().toISOString().substring(0, 10),
    status: 'Enforced',
    summary: '',
    penalties: '₱2,500 fine and revocation of business permit on 3rd offense',
    complianceRate: '88% Monitored Compliance',
  };
  const [policyFormData, setPolicyFormData] = useState(initialPolicyForm);

  // Notice of Violation Form State
  const initialNoticeForm: Omit<NoticeOfViolation, 'id'> = {
    establishmentName: '',
    violationDate: new Date().toISOString().substring(0, 10),
    violationDetails: '',
    ordinanceViolated: 'Section 14, Municipal Tourism Code (Sanitation & Safety Standards)',
    correctiveActionRequired: 'Install certified fire suppression equipment and rectify wastewater treatment facility',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    status: 'Pending Corrective Action',
  };
  const [noticeFormData, setNoticeFormData] = useState(initialNoticeForm);

  // Complaint Form State
  const initialComplaintForm: Omit<TouristComplaint, 'id'> = {
    trackingNumber: `COMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    complainant: '',
    dateFiled: new Date().toISOString().substring(0, 10),
    targetEntity: '',
    category: 'Overpricing / Unofficial Fee',
    description: '',
    status: 'Received',
    resolutionNotes: '',
  };
  const [complaintFormData, setComplaintFormData] = useState(initialComplaintForm);

  // Filtered lists
  const filteredPolicies = policies.filter((p) => {
    const term = policySearch.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(term) ||
      p.referenceNumber.toLowerCase().includes(term) ||
      p.summary.toLowerCase().includes(term);

    const matchesType = filterPolicyType === 'ALL' || p.type === filterPolicyType;
    const matchesStatus = filterPolicyStatus === 'ALL' || p.status === filterPolicyStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredNotices = notices.filter((n) => {
    const term = noticeSearch.toLowerCase();
    const matchesSearch =
      n.establishmentName.toLowerCase().includes(term) ||
      n.violationDetails.toLowerCase().includes(term) ||
      n.ordinanceViolated.toLowerCase().includes(term);

    const matchesStatus = filterNoticeStatus === 'ALL' || n.status === filterNoticeStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredComplaints = complaints.filter((c) => {
    const term = complaintSearch.toLowerCase();
    const matchesSearch =
      c.complainant.toLowerCase().includes(term) ||
      c.targetEntity.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term) ||
      c.trackingNumber.toLowerCase().includes(term);

    const matchesCat = filterComplaintCategory === 'ALL' || c.category === filterComplaintCategory;
    const matchesStatus = filterComplaintStatus === 'ALL' || c.status === filterComplaintStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Handlers for Policy Form
  const handleOpenPolicyForm = (pol?: TourismPolicy) => {
    if (pol) {
      setEditingPolicyId(pol.id);
      setPolicyFormData({
        referenceNumber: pol.referenceNumber,
        title: pol.title,
        type: pol.type,
        dateApproved: pol.dateApproved,
        status: pol.status,
        summary: pol.summary,
        penalties: pol.penalties,
        complianceRate: pol.complianceRate,
      });
    } else {
      setEditingPolicyId(null);
      setPolicyFormData({
        ...initialPolicyForm,
        referenceNumber: `SB Ord. No. ${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      });
    }
    setIsPolicyModalOpen(true);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyFormData.title.trim()) return;

    if (editingPolicyId && updatePolicy) {
      updatePolicy(editingPolicyId, policyFormData);
    } else {
      addPolicy(policyFormData);
    }
    setIsPolicyModalOpen(false);
  };

  // Handlers for Notice Form
  const handleOpenNoticeForm = (targetEstablishmentName?: string) => {
    setEditingNoticeId(null);
    setNoticeFormData({
      ...initialNoticeForm,
      establishmentName: targetEstablishmentName || '',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    });
    setIsNoticeModalOpen(true);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeFormData.establishmentName.trim()) return;

    if (editingNoticeId && updateNotice) {
      updateNotice(editingNoticeId, noticeFormData);
    } else {
      addNotice(noticeFormData);
    }
    setIsNoticeModalOpen(false);
  };

  // Handlers for Complaint Form
  const handleSaveComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintFormData.complainant.trim()) return;

    addComplaint(complaintFormData);
    setIsComplaintModalOpen(false);
    setComplaintFormData({
      ...initialComplaintForm,
      trackingNumber: `COMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    });
  };

  // Save Amicable Settlement Notes
  const handleSaveSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlementComplaint) return;

    updateComplaintStatus(
      settlementComplaint.id,
      'Resolved / Closed',
      settlementNotes || 'Parties reached mutual amicable settlement mediated by the Municipal Tourism Office.'
    );
    setSettlementComplaint(null);
  };

  // CSV Exports
  const handleExportPoliciesCSV = () => {
    const headers = ['Reference Number', 'Title', 'Policy Type', 'Date Approved', 'Status', 'Summary', 'Penalties', 'Compliance Rate'];
    const rows = filteredPolicies.map((p) => [
      `"${p.referenceNumber}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.type}"`,
      `"${p.dateApproved}"`,
      `"${p.status}"`,
      `"${p.summary.replace(/"/g, '""')}"`,
      `"${p.penalties.replace(/"/g, '""')}"`,
      `"${p.complianceRate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Malungon_Tourism_Ordinances_Registry_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportNoticesCSV = () => {
    const headers = ['Respondent Establishment', 'Violation Date', 'Violation Details', 'Ordinance Violated', 'Corrective Action Required', 'Compliance Deadline', 'Status'];
    const rows = filteredNotices.map((n) => [
      `"${n.establishmentName.replace(/"/g, '""')}"`,
      `"${n.violationDate}"`,
      `"${n.violationDetails.replace(/"/g, '""')}"`,
      `"${n.ordinanceViolated.replace(/"/g, '""')}"`,
      `"${n.correctiveActionRequired.replace(/"/g, '""')}"`,
      `"${n.deadline}"`,
      `"${n.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Malungon_Notices_of_Violation_Docket_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportComplaintsCSV = () => {
    const headers = ['Tracking Number', 'Date Filed', 'Complainant', 'Target Entity', 'Category', 'Description', 'Status', 'Resolution Notes'];
    const rows = filteredComplaints.map((c) => [
      `"${c.trackingNumber}"`,
      `"${c.dateFiled}"`,
      `"${c.complainant.replace(/"/g, '""')}"`,
      `"${c.targetEntity.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.description.replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${(c.resolutionNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Malungon_Tourist_Complaints_Register_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>MODULE I • Regulatory Compliance & Consumer Protection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Policy Support and Regulation Unit (PSRU)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tourism Code enforcement, regulatory standards inspections, Notices of Violation (NOV), and visitor dispute mediation.
          </p>
        </div>

        {/* Division Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ordinances')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'ordinances'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ordinances & Code ({policies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inspections')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'inspections'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Joint Standards Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'notices'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Notices of Violation ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'complaints'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Complaints Desk ({complaints.length})</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Enforced Ordinances</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{policies.length} Policies</div>
          <div className="text-xs text-blue-700 font-medium mt-1">Tourism Code Enacted</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Active NOV Dockets</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">
            {notices.filter((n) => n.status !== 'Resolved & Cleared').length} Pending
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {notices.filter((n) => n.status === 'Resolved & Cleared').length} Cleared & Compliant
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Dispute Mediation Rate</span>
            <Gavel className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {Math.round(
              (complaints.filter((c) => c.status === 'Resolved / Closed').length / (complaints.length || 1)) * 100
            )}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Amicable settlement efficiency</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Accreditation Rate</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">89%</div>
          <div className="text-xs text-teal-700 font-medium mt-1">DOT & LGU Accredited Enterprises</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: MUNICIPAL ORDINANCES & TOURISM CODE                            */}
      {/* ========================================================================= */}
      {activeTab === 'ordinances' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ordinance title, reference number, or penalties..."
                value={policySearch}
                onChange={(e) => setPolicySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterPolicyType}
                onChange={(e) => setFilterPolicyType(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Policy Types</option>
                <option value="Municipal Ordinance">Municipal Ordinance</option>
                <option value="Executive Order">Executive Order</option>
                <option value="Tourism Code Section">Tourism Code Section</option>
                <option value="Administrative Memo">Administrative Memo</option>
              </select>

              <select
                value={filterPolicyStatus}
                onChange={(e) => setFilterPolicyStatus(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="Enforced">Enforced</option>
                <option value="Under Amendment">Under Amendment</option>
                <option value="Proposed">Proposed</option>
              </select>

              <button
                onClick={handleExportPoliciesCSV}
                className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Policies CSV</span>
              </button>

              {!isReadOnly && (
                <button
                  onClick={() => handleOpenPolicyForm()}
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enact Policy</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPolicies.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {p.referenceNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'Enforced'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-2">{p.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">{p.summary}</p>

                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <div>
                      <span className="text-slate-400">Approved Date: </span>
                      <strong className="text-slate-800">{p.dateApproved}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Sanctions / Penalties: </span>
                      <span className="text-rose-700 font-medium">{p.penalties}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold">{p.complianceRate}</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setDossierPolicy(p)}
                      className="text-slate-500 hover:text-blue-700 font-semibold p-1"
                      title="View Policy Summary"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {!isReadOnly && (
                      <>
                        <button
                          onClick={() => handleOpenPolicyForm(p)}
                          className="text-slate-500 hover:text-blue-700 p-1"
                          title="Edit Policy"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete policy ${p.referenceNumber}?`)) {
                              if (deletePolicy) deletePolicy(p.id);
                            }
                          }}
                          className="text-slate-500 hover:text-rose-700 p-1"
                          title="Delete Policy"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ========================================================================= */}
      {/* SUB-TAB 2: REGULATORY INSPECTIONS & STANDARDS AUDIT                       */}
      {/* ========================================================================= */}
      {activeTab === 'inspections' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Joint Regulatory Standards & Inspection Audit Center</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Tourism Enterprise Regulatory Audits</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                On-site inspections verifying environmental compliance (ECC/CNC), fire safety, and DOT accreditation.
              </p>
            </div>
            <button
              onClick={() => handleOpenNoticeForm()}
              className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Issue Notice of Violation</span>
            </button>
          </div>

          {/* Establishments Audit Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">Active Establishments Compliance Roster</h4>
              <span className="text-xs text-slate-500">MTO Malungon Regulatory Oversight</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Establishment</th>
                    <th className="px-4 py-3.5">DOT Accreditation</th>
                    <th className="px-4 py-3.5">Environmental Permit</th>
                    <th className="px-4 py-3.5">Fire & Safety</th>
                    <th className="px-4 py-3.5">Insurance</th>
                    <th className="px-4 py-3.5 text-right">Regulatory Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {establishments.map((est) => (
                    <tr key={est.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{est.name}</div>
                        <div className="text-xs text-slate-400">Brgy. {est.barangay} • {est.category}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          est.dotAccreditationStatus === 'Accredited'
                            ? 'bg-emerald-100 text-emerald-800'
                            : est.dotAccreditationStatus === 'Expired / For Renewal' || est.dotAccreditationStatus === 'Not Accredited'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {est.dotAccreditationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700">{est.environmentalCompliance}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          est.safetyCompliance === 'Fire & Safety Certified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {est.safetyCompliance}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700">{est.insuranceCoverage}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleOpenNoticeForm(est.name)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded text-xs font-semibold border border-rose-200 transition-colors inline-flex items-center gap-1"
                        >
                          <FileWarning className="w-3.5 h-3.5" />
                          <span>Issue NOV</span>
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
      {/* SUB-TAB 3: NOTICES OF VIOLATION (NOV)                                     */}
      {/* ========================================================================= */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search respondent establishment, violation details, or ordinance..."
                value={noticeSearch}
                onChange={(e) => setNoticeSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterNoticeStatus}
                onChange={(e) => setFilterNoticeStatus(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Notice Statuses</option>
                <option value="Pending Corrective Action">Pending Corrective Action</option>
                <option value="Resolved & Cleared">Resolved & Cleared</option>
                <option value="Escalated to Legal">Escalated to Legal</option>
              </select>

              <button
                onClick={handleExportNoticesCSV}
                className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export NOV CSV</span>
              </button>

              {!isReadOnly && (
                <button
                  onClick={() => handleOpenNoticeForm()}
                  className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Issue Notice</span>
                </button>
              )}
            </div>
          </div>

          {/* Notices Docket Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Notices of Violation (NOV) Docket</h3>
                <p className="text-xs text-slate-500">Official statutory citations issued by the Municipal Joint Tourism Inspection Team</p>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                {notices.filter((n) => n.status !== 'Resolved & Cleared').length} Active Proceedings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Violation Date</th>
                    <th className="px-4 py-3">Respondent Establishment</th>
                    <th className="px-4 py-3">Violation Details</th>
                    <th className="px-4 py-3">Ordinance Violated</th>
                    <th className="px-3 py-3">Compliance Deadline</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNotices.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {n.violationDate}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{n.establishmentName}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs leading-relaxed">
                        <div>{n.violationDetails}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Remedy: {n.correctiveActionRequired}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-rose-900">{n.ordinanceViolated}</td>
                      <td className="px-3 py-3 font-mono text-[11px] text-slate-600">{n.deadline}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            n.status === 'Resolved & Cleared'
                              ? 'bg-emerald-100 text-emerald-800'
                              : n.status === 'Escalated to Legal'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {n.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setPrintableNotice(n)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                            title="Print Official NOV Letter"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {!isReadOnly && n.status !== 'Resolved & Cleared' && (
                            <button
                              onClick={() => resolveNotice(n.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-semibold border border-emerald-200 transition-colors whitespace-nowrap"
                            >
                              Resolve
                            </button>
                          )}
                          {!isReadOnly && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete notice for ${n.establishmentName}?`)) {
                                  if (deleteNotice) deleteNotice(n.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-700 rounded hover:bg-slate-100"
                              title="Delete NOV"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      {/* SUB-TAB 4: TOURIST COMPLAINTS DESK & DISPUTE MEDIATION                    */}
      {/* ========================================================================= */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search complainant, respondent establishment, or details..."
                value={complaintSearch}
                onChange={(e) => setComplaintSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterComplaintCategory}
                onChange={(e) => setFilterComplaintCategory(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Complaint Categories</option>
                <option value="Overpricing / Unofficial Fee">Overpricing / Unofficial Fee</option>
                <option value="Safety / Sanitation">Safety / Sanitation</option>
                <option value="Service Quality">Service Quality</option>
                <option value="False Advertising">False Advertising</option>
                <option value="Environmental Concern">Environmental Concern</option>
              </select>

              <select
                value={filterComplaintStatus}
                onChange={(e) => setFilterComplaintStatus(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700"
              >
                <option value="ALL">All Complaint Statuses</option>
                <option value="Received">Received</option>
                <option value="Investigation On-going">Investigation On-going</option>
                <option value="Mediation Scheduled">Mediation Scheduled</option>
                <option value="Resolved / Closed">Resolved / Closed</option>
              </select>

              <button
                onClick={handleExportComplaintsCSV}
                className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Complaints CSV</span>
              </button>

              <button
                onClick={() => setIsComplaintModalOpen(true)}
                className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>File Complaint</span>
              </button>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Consumer Complaints & Dispute Mediation Docket</h3>
                <p className="text-xs text-slate-500">Visitor protection and redress mechanism under R.A. 7394 and Malungon Tourism Code</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Tracking No. & Date</th>
                    <th className="px-4 py-3">Complainant</th>
                    <th className="px-4 py-3">Subject Entity</th>
                    <th className="px-4 py-3">Category & Details</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Mediation Settlement Notes</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800 text-[11px] whitespace-nowrap">
                        <div>{c.trackingNumber}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{c.dateFiled}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{c.complainant}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{c.targetEntity}</td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs">
                        <span className="font-semibold text-slate-900">{c.category}: </span>
                        {c.description}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'Resolved / Closed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'Mediation Scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-600 max-w-xs text-[11px]">
                        {c.resolutionNotes || 'Under active investigation'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {c.status === 'Resolved / Closed' && (
                            <button
                              onClick={() => setPrintableSettlement(c)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                              title="Print Amicable Settlement Certificate"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}
                          {!isReadOnly && c.status !== 'Resolved / Closed' && (
                            <button
                              onClick={() => {
                                setSettlementComplaint(c);
                                setSettlementNotes(c.resolutionNotes || '');
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-semibold border border-emerald-200 transition-colors whitespace-nowrap"
                            >
                              Settle Ticket
                            </button>
                          )}
                          {!isReadOnly && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete complaint ${c.trackingNumber}?`)) {
                                  if (deleteComplaint) deleteComplaint(c.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-700 rounded hover:bg-slate-100"
                              title="Delete Complaint"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      {/* MODAL: ADD / EDIT POLICY                                                  */}
      {/* ========================================================================= */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between border-b border-rose-950">
              <h3 className="font-bold text-base">
                {editingPolicyId ? 'Edit Tourism Ordinance / Policy' : 'Enact Tourism Policy / Ordinance'}
              </h3>
              <button onClick={() => setIsPolicyModalOpen(false)} className="text-rose-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reference Number *</label>
                  <input
                    type="text"
                    required
                    value={policyFormData.referenceNumber}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, referenceNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Policy Classification *</label>
                  <select
                    value={policyFormData.type}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Municipal Ordinance">Municipal Ordinance</option>
                    <option value="Executive Order">Executive Order</option>
                    <option value="Tourism Code Section">Tourism Code Section</option>
                    <option value="Administrative Memo">Administrative Memo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Policy Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Revised Tourism Standards and Eco-Carrying Capacity Ordinance"
                  value={policyFormData.title}
                  onChange={(e) => setPolicyFormData({ ...policyFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Approval Date</label>
                  <input
                    type="date"
                    value={policyFormData.dateApproved}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, dateApproved: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enforcement Status</label>
                  <select
                    value={policyFormData.status}
                    onChange={(e) => setPolicyFormData({ ...policyFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Enforced">Enforced</option>
                    <option value="Under Amendment">Under Amendment</option>
                    <option value="Proposed">Proposed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Summary of Provisions & Regulations *</label>
                <textarea
                  rows={3}
                  required
                  value={policyFormData.summary}
                  onChange={(e) => setPolicyFormData({ ...policyFormData, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Penalties and Sanctions</label>
                <input
                  type="text"
                  value={policyFormData.penalties}
                  onChange={(e) => setPolicyFormData({ ...policyFormData, penalties: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPolicyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  {editingPolicyId ? 'Save Policy' : 'Enact Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ISSUE NOTICE OF VIOLATION (NOV)                                    */}
      {/* ========================================================================= */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between border-b border-rose-950">
              <h3 className="font-bold text-base">Issue Official Notice of Violation (NOV)</h3>
              <button onClick={() => setIsNoticeModalOpen(false)} className="text-rose-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Respondent Enterprise / Site Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kalon Barak Coffee Lounge"
                  value={noticeFormData.establishmentName}
                  onChange={(e) => setNoticeFormData({ ...noticeFormData, establishmentName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inspection / Violation Date</label>
                  <input
                    type="date"
                    value={noticeFormData.violationDate}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, violationDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cure Period Deadline *</label>
                  <input
                    type="date"
                    required
                    value={noticeFormData.deadline}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ordinance / Code Section Violated *</label>
                <input
                  type="text"
                  required
                  value={noticeFormData.ordinanceViolated}
                  onChange={(e) => setNoticeFormData({ ...noticeFormData, ordinanceViolated: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Violation Details & Audit Findings *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe non-compliant conditions, expired fire safety certifications, unpermitted waste discharge, etc."
                  value={noticeFormData.violationDetails}
                  onChange={(e) => setNoticeFormData({ ...noticeFormData, violationDetails: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mandated Corrective Action *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Specify mandated rectifications before re-inspection..."
                  value={noticeFormData.correctiveActionRequired}
                  onChange={(e) => setNoticeFormData({ ...noticeFormData, correctiveActionRequired: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Issue Formal Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FILE TOURIST COMPLAINT                                             */}
      {/* ========================================================================= */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-base">File Consumer / Tourist Complaint</h3>
              <button onClick={() => setIsComplaintModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveComplaint} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Complainant Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={complaintFormData.complainant}
                    onChange={(e) => setComplaintFormData({ ...complaintFormData, complainant: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Entity / Establishment *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Skyline Mountain Resort"
                    value={complaintFormData.targetEntity}
                    onChange={(e) => setComplaintFormData({ ...complaintFormData, targetEntity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Complaint Category *</label>
                <select
                  value={complaintFormData.category}
                  onChange={(e) => setComplaintFormData({ ...complaintFormData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                >
                  <option value="Overpricing / Unofficial Fee">Overpricing / Unofficial Fee</option>
                  <option value="Safety / Sanitation">Safety / Sanitation</option>
                  <option value="Service Quality">Service Quality</option>
                  <option value="False Advertising">False Advertising</option>
                  <option value="Environmental Concern">Environmental Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grievance Narrative / Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the incident, date, transaction receipts, or witnesses..."
                  value={complaintFormData.description}
                  onChange={(e) => setComplaintFormData({ ...complaintFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsComplaintModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  File Complaint Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SETTLE COMPLAINT                                                   */}
      {/* ========================================================================= */}
      {settlementComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-base">Record Amicable Settlement Agreement</h3>
              <button onClick={() => setSettlementComplaint(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettlement} className="p-6 space-y-4">
              <div className="text-xs text-slate-700 space-y-1">
                <div>Tracking No: <strong className="font-mono">{settlementComplaint.trackingNumber}</strong></div>
                <div>Complainant: <strong>{settlementComplaint.complainant}</strong> vs. <strong>{settlementComplaint.targetEntity}</strong></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Settlement & Mediation Agreement Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record agreed refund amount, corrective action by management, or mutual clearance..."
                  value={settlementNotes}
                  onChange={(e) => setSettlementNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSettlementComplaint(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Close & Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE NOTICE OF VIOLATION LETTER                               */}
      {/* ========================================================================= */}
      {printableNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2 text-xs">
                <Printer className="w-4 h-4 text-rose-400" />
                <span className="font-semibold">Official Notice of Violation (NOV) Document</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Print NOV Letter
                </button>
                <button
                  onClick={() => setPrintableNotice(null)}
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
                  OFFICE OF THE MUNICIPAL MAYOR & TOURISM REGULATORY BOARD
                </div>
                <div className="text-[10px] text-slate-500 font-serif italic mt-0.5">
                  Joint Regulatory Inspection Team • Official Notice of Violation
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-slate-200 pb-2 text-xs">
                <div>
                  <div className="text-slate-500">TO:</div>
                  <h2 className="text-base font-black uppercase text-slate-900">{printableNotice.establishmentName}</h2>
                  <div className="text-slate-600">Municipality of Malungon, Sarangani Province</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">CONTROL NO:</div>
                  <div className="font-mono font-bold text-slate-800">NOV-{printableNotice.id.toUpperCase()}</div>
                  <div className="text-slate-500 mt-0.5">Date: {printableNotice.violationDate}</div>
                </div>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed space-y-4">
                <p>
                  <strong>SIR / MADAM:</strong>
                </p>
                <p>
                  Please be informed that during an on-site joint regulatory compliance inspection conducted on{' '}
                  <strong>{printableNotice.violationDate}</strong>, the following statutory violations of local tourism ordinances were officially documented:
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                  <div><strong>ORDINANCE VIOLATED:</strong> {printableNotice.ordinanceViolated}</div>
                  <div><strong>FINDINGS / PARTICULARS:</strong> {printableNotice.violationDetails}</div>
                </div>
                <p>
                  Pursuant to the Municipal Tourism Code, you are hereby given a cure period until{' '}
                  <strong className="text-rose-700">{printableNotice.deadline}</strong> to implement the following mandatory corrective actions:
                </p>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-950 font-medium">
                  {printableNotice.correctiveActionRequired}
                </div>
                <p className="text-[11px] text-slate-500">
                  Failure to comply within the prescribed deadline shall result in immediate revocation of your Mayor’s Business Permit and endorsement to the Municipal Legal Office for appropriate judicial sanctions.
                </p>
              </div>

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
      {/* MODAL: PRINTABLE AMICABLE SETTLEMENT CERTIFICATE                          */}
      {/* ========================================================================= */}
      {printableSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
              <div className="flex items-center space-x-2 text-xs">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Certificate of Amicable Settlement</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Print Certificate
                </button>
                <button
                  onClick={() => setPrintableSettlement(null)}
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
                  Tourism Complaints Desk • Certificate of Amicable Dispute Settlement
                </div>
              </div>

              <div className="text-center py-2">
                <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">CERTIFICATE OF AMICABLE SETTLEMENT</h2>
                <div className="text-xs font-mono text-slate-500">DOCKET NO: {printableSettlement.trackingNumber}</div>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed space-y-4">
                <p>
                  THIS IS TO CERTIFY that in the complaint docketed as <strong>{printableSettlement.trackingNumber}</strong> filed by{' '}
                  <strong>{printableSettlement.complainant}</strong> against <strong>{printableSettlement.targetEntity}</strong> regarding{' '}
                  <em>{printableSettlement.category}</em>, both parties voluntarily appeared before the Municipal Tourism Office Mediation Committee on{' '}
                  <strong>{new Date().toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
                </p>
                <p>The parties have mutually agreed upon the following terms of settlement:</p>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 font-medium">
                  {printableSettlement.resolutionNotes || 'Mutual amicable settlement reached with full customer redress.'}
                </div>
                <p>
                  WHEREFORE, having complied with all agreed stipulations, this complaint is hereby officially{' '}
                  <strong className="text-emerald-800">RESOLVED AND CLOSED</strong>.
                </p>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="border-b border-slate-800 w-36 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">{printableSettlement.complainant.toUpperCase()}</div>
                  <div className="text-[10px] text-slate-500">Complainant</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-36 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">{printableSettlement.targetEntity.toUpperCase()}</div>
                  <div className="text-[10px] text-slate-500">Respondent Entity</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-36 mx-auto mb-1"></div>
                  <div className="font-bold text-slate-900">CRISTINA D. CONSTANTINO-LA PAZ</div>
                  <div className="text-[10px] text-slate-500">Municipal Tourism Action Officer-Designate (Mediator)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
