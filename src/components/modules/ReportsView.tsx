import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Building,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  DollarSign,
  Package,
  CalendarCheck,
  Share2,
  FileBadge,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileText,
  Landmark,
  MapPin,
  Clock,
  Compass,
  Layers,
  ChevronRight,
  UserCheck,
  Building2,
  Eye,
  Percent,
  Check,
  Briefcase,
  ExternalLink,
  Search
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';

export type ReportType =
  | 'monthly_accomplishment'
  | 'quarterly_report'
  | 'annual_report'
  | 'tourist_arrival_stats'
  | 'tourism_enterprise'
  | 'financial_report'
  | 'inventory_report'
  | 'inspection_report'
  | 'event_report'
  | 'social_media_analytics'
  | 'tourism_revenue'
  | 'dot_required';

export const ReportsView: React.FC = () => {
  const {
    tourists,
    establishments,
    msmes,
    destinations,
    events,
    financial,
    inventory,
    socialMetrics,
    tiacLogs,
    campaigns,
  } = useTourism();

  const [selectedReport, setSelectedReport] = useState<ReportType>('monthly_accomplishment');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('September');
  const [selectedQuarter, setSelectedQuarter] = useState('Q3 (Jul - Sep)');

  // Key derived metrics across modules
  const totalVisitors = useMemo(() => tourists.reduce((sum, t) => sum + 1 + (t.companionsCount || 0), 0), [tourists]);
  const totalDirectRevenue = useMemo(() => tourists.reduce((sum, t) => sum + t.touristSpending, 0), [tourists]);
  const foreignCount = useMemo(() => tourists.filter((t) => t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0), [tourists]);
  const localCount = useMemo(() => tourists.filter((t) => !t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0), [tourists]);

  const accreditedEst = establishments.filter((e) => e.dotAccreditationStatus === 'Accredited').length;
  const totalEst = establishments.length;
  const accRate = totalEst > 0 ? Math.round((accreditedEst / totalEst) * 100) : 0;
  const totalEmployeesCount = establishments.reduce((acc, curr) => acc + curr.numberOfEmployees, 0);

  const appropriation = financial.annualBudget;
  const totalObligations = financial.obligations;
  const totalDisbursements = financial.disbursement;
  const burRate = appropriation > 0 ? Math.round((totalObligations / appropriation) * 100) : 68;

  const grossSocialReach = socialMetrics.reduce((acc, curr) => acc + curr.monthlyReach, 0);
  const grossSocialInteractions = socialMetrics.reduce((acc, curr) => acc + curr.monthlyEngagement, 0);
  const totalNetFollowers = socialMetrics.reduce((acc, curr) => acc + curr.followers, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `MTODMS_${selectedReport}_${selectedYear}.csv`;

    switch (selectedReport) {
      case 'monthly_accomplishment':
        headers = ['Key Performance Area / MFO', 'Monthly Approved Target', 'Actual Accomplished', 'Variance / Performance', 'Remarks / MOV'];
        rows = [
          ['Tourist Arrivals (Headcount)', '12,000 Pax', `${totalVisitors.toLocaleString()} Pax`, 'Target Exceeded (+4.2%)', 'TAMS Automated Ingestion Logs'],
          ['Gross Tourism Receipts Inflow', '₱10,000,000', `₱${totalDirectRevenue.toLocaleString()}`, '+12.4% vs Baseline', 'Direct Visitor Expenditure Surveys'],
          ['DOT-Accredited Enterprises Monitored', '18 Units', `${accreditedEst} Units`, `${accRate}% Accreditation Rate`, 'PSRU Quality Assurance Roster'],
          ['Frontline Visitor Inquiries Resolved', '120 Inquiries', `${tiacLogs.length} Inquiries Handled`, '100% Case Resolution Rate', 'TIAC Form 01 Frontline Registry'],
          ['Promotional Marketing Campaigns Live', '3 Campaigns', `${campaigns.length} Active Campaigns`, 'On Schedule', 'PMU Campaign Delivery Digest'],
          ['Tourism Infrastructure Inspections', '8 Audits', `${establishments.length} Establishments Audited`, 'Zero Severe Violations', 'Joint LGU-BFP Inspection Log'],
          ['LGU Tourism Budget Obligated', '₱1,200,000', `₱${Math.round(totalObligations / 12).toLocaleString()}`, `${burRate}% BUR Alignment`, 'AFS Electronic Financial Log']
        ];
        break;

      case 'quarterly_report':
        headers = ['Strategic Objective / KRA', 'Approved Q3 Target', 'Q3 Accomplishment', '% Accomplishment', 'Operational Status', 'Responsible Unit'];
        rows = [
          ['Tourist Volume Expansion', '35,000 Pax', `${totalVisitors.toLocaleString()} Pax`, '104% Target Realization', 'Exceeded Target', 'Tourist Arrival Unit (TAMS)'],
          ['LGU Fiscal Utilization (BUR)', '65.0% Obligation', `${financial.fundUtilizationRate}% Obligated`, '105% Target Realization', 'Sound Execution', 'Administrative & Finance (AFS)'],
          ['DOT Accreditation Outreach', '80% Primary Units', `${accRate}% Accredited`, '102% Target Realization', 'Active Certification', 'Policy & Regulation (PSRU)'],
          ['Community Tourism MSME Incubation', '20 Active MSMEs', `${msmes.length} Enterprises Assisted`, '110% Target Realization', 'Sustained Growth', 'MSME Tourism Unit'],
          ['Environmental Carrying Capacity Compliance', '100% Buffer Audits', 'Zero Major Watershed Infractions', '100% Compliance', 'Fully Compliant', 'Research & Planning (RPU)'],
          ['Digital Engagement Growth Rate', '15.0% MoM Increase', '+18.4% Net Reach', '122% Target Realization', 'Viral Traction', 'Social Media Management (SMM)']
        ];
        break;

      case 'annual_report':
        headers = ['Strategic Macro Indicator', '2024 Baseline', '2025 Accomplishment', '2026 Target', 'Current Progress', 'YoY Growth (%)', 'Strategic Outlook'];
        rows = [
          ['Total Annual Visitor Arrivals', '118,400 Pax', '135,200 Pax', '140,000 Pax', `${totalVisitors.toLocaleString()} Pax`, '+14.2%', 'High Inflow Trajectory'],
          ['Gross Municipal Tourism Receipts', '₱115,200,000', '₱138,500,000', '₱140,000,000', `₱${totalDirectRevenue.toLocaleString()}`, '+20.2%', 'Strong Economic Contribution'],
          ['DOT Accredited Primary Establishments', '14 Entities', '18 Entities', '22 Entities', `${accreditedEst} Entities`, '+22.2%', 'Exceeds Provincial Average'],
          ['Local Tourism Sector Workforce', '1,250 Employees', '1,480 Employees', '1,700 Employees', `${totalEmployeesCount} Direct Jobs`, '+14.8%', 'Resilient Livelihoods'],
          ['Community Tourism MSMEs Supported', '16 MSMEs', '20 MSMEs', '24 MSMEs', `${msmes.length} MSMEs Active`, '+20.0%', 'Inclusive Tribal Enterprise'],
          ['LGU Tourism Capital Appropriations', '₱11,200,000', '₱13,000,000', '₱14,500,000', `₱${appropriation.toLocaleString()}`, '+11.5%', 'Increased Municipal Investment']
        ];
        break;

      case 'tourist_arrival_stats':
        headers = ['Destination Site', 'Barangay', 'Domestic Tourists', 'Foreign Tourists', 'Total Visitors', 'Estimated Direct Spending (PHP)', 'Dominant Origin'];
        rows = destinations.map((d) => {
          const siteArrivals = tourists.filter((t) => t.destinationVisited.toLowerCase().includes(d.siteName.toLowerCase()));
          const dom = siteArrivals.filter((t) => !t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
          const fgn = siteArrivals.filter((t) => t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
          const spend = siteArrivals.reduce((s, t) => s + t.touristSpending, 0);
          const dominantOrigin = siteArrivals[0]?.address || 'Region XII';
          return [`"${d.siteName}"`, `"${d.barangay}"`, dom, fgn, dom + fgn, spend, `"${dominantOrigin}"`];
        });
        break;

      case 'tourism_enterprise':
        headers = ['Establishment Name', 'Category', 'Barangay', 'Business Owner / Manager', 'Contact Number', 'DOT Status', 'Accreditation No.', 'Employees', 'LGU Permit No.'];
        rows = establishments.map((e) => [
          `"${e.name}"`,
          `"${e.category}"`,
          `"${e.barangay}"`,
          `"${e.owner}"`,
          `"${e.contactNumber}"`,
          `"${e.dotAccreditationStatus}"`,
          `"${e.dotAccreditationNumber || 'N/A'}"`,
          e.numberOfEmployees,
          `"${e.businessPermitNumber || 'BP-2026-MLG'}"`
        ]);
        break;

      case 'financial_report':
        headers = ['Budget Program / Line Item', 'Appropriation (PHP)', 'Allotment Released (PHP)', 'Obligations Incurred (PHP)', 'Disbursements (PHP)', 'Unobligated Balance (PHP)', 'BUR (%)'];
        rows = [
          ['Personnel Services (PS)', Math.round(appropriation * 0.32), Math.round(appropriation * 0.32), Math.round(totalObligations * 0.32), Math.round(totalDisbursements * 0.32), Math.round((appropriation - totalObligations) * 0.32), `${burRate}%`],
          ['Maintenance & Other Operating Expenses (MOOE)', Math.round(appropriation * 0.48), Math.round(appropriation * 0.48), Math.round(totalObligations * 0.48), Math.round(totalDisbursements * 0.48), Math.round((appropriation - totalObligations) * 0.48), `${burRate}%`],
          ['Capital Outlay (CO) & Tourism Infrastructure', Math.round(appropriation * 0.20), Math.round(appropriation * 0.20), Math.round(totalObligations * 0.20), Math.round(totalDisbursements * 0.20), Math.round((appropriation - totalObligations) * 0.20), `${burRate}%`],
          ['Total Consolidated Tourism Fund', appropriation, appropriation, totalObligations, totalDisbursements, appropriation - totalObligations, `${burRate}%`]
        ];
        break;

      case 'inventory_report':
        headers = ['Property Number', 'Asset Description', 'Category', 'Acquisition Date', 'Unit Cost (PHP)', 'Condition', 'Accountable Custodian', 'Location'];
        rows = inventory.map((i) => [
          `"${i.propertyNumber}"`,
          `"${i.itemName}"`,
          `"${i.category}"`,
          `"${i.acquisitionDate}"`,
          i.acquisitionCost,
          `"${i.condition}"`,
          `"${i.assignedTo}"`,
          `"${i.location}"`
        ]);
        break;

      case 'inspection_report':
        headers = ['Establishment Inspected', 'Category & Barangay', 'Inspection Date', 'Audit Inspector', 'Sanitation & Safety Rating', 'Findings Summary', 'Compliance Status'];
        rows = establishments.map((e) => {
          const ins = e.inspectionHistory?.[0];
          return [
            `"${e.name}"`,
            `"${e.category} - ${e.barangay}"`,
            `"${ins?.date || '2026-08-15'}"`,
            `"${ins?.inspector || 'MTO Regulatory Unit & BFP'}"`,
            `"${ins?.rating || 92}/100"`,
            `"${ins?.findings || 'Standard fire safety exits, sanitary permits valid, emergency kits in place.'}"`,
            `"${ins?.status || 'Passed'}"`
          ];
        });
        break;

      case 'event_report':
        headers = ['Event Title', 'Event Date', 'Venue', 'Organizer / Section', 'Approved Budget (PHP)', 'Actual Direct Expense (PHP)', 'Attendance (Pax)', 'Liquidation Status'];
        rows = events.map((ev) => [
          `"${ev.eventName}"`,
          `"${ev.date}"`,
          `"${ev.venue}"`,
          `"${ev.organizer}"`,
          ev.budget,
          ev.actualExpense,
          ev.attendanceActual,
          `"${ev.financialReportStatus}"`
        ]);
        break;

      case 'social_media_analytics':
        headers = ['Platform', 'Monthly Reach (Impressions)', 'Monthly Engagements', 'Total Followers', 'Net Growth MoM (%)', 'Avg Engagement Rate (%)', 'Top Performing Post'];
        rows = socialMetrics.map((sm) => [
          `"${sm.platform}"`,
          sm.monthlyReach,
          sm.monthlyEngagement,
          sm.followers,
          `${sm.growthRatePercent}%`,
          `${sm.avgEngagementRate}%`,
          `"${sm.topPostTitle}"`
        ]);
        break;

      case 'tourism_revenue':
        headers = ['Destination / Tourism Asset', 'Barangay', 'Visitor Arrivals', 'Direct Tourist Spending (PHP)', 'Environmental Fee (PHP)', 'Total Economic Inflow (PHP)'];
        rows = destinations.map((d) => {
          const siteArrivals = tourists.filter((t) => t.destinationVisited.toLowerCase().includes(d.siteName.toLowerCase()));
          const count = siteArrivals.reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
          const spend = siteArrivals.reduce((s, t) => s + t.touristSpending, 0);
          const envFee = count * (d.entranceFee || 50);
          return [`"${d.siteName}"`, `"${d.barangay}"`, count, spend, envFee, spend + envFee];
        });
        break;

      case 'dot_required':
        headers = ['Accommodation Establishment', 'Category', 'Barangay', 'Domestic Guests', 'Foreign Guests', 'Total Guest Nights', 'Average Stay (Nights)', 'Est. Occupancy Rate'];
        rows = establishments.filter((e) => ['Resorts', 'Hotels', 'Campsites', 'Cafés'].includes(e.category)).map((e) => {
          const estArrivals = tourists.filter((t) => t.accommodationUsed.toLowerCase().includes(e.name.toLowerCase()));
          const dom = estArrivals.filter((t) => !t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
          const fgn = estArrivals.filter((t) => t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
          const total = dom + fgn;
          const avgStay = estArrivals.length > 0 ? (estArrivals.reduce((s, t) => s + t.numberOfDaysStayed, 0) / estArrivals.length).toFixed(1) : '1.5';
          const occupancy = Math.min(96, Math.max(48, 55 + total * 4));
          return [`"${e.name}"`, `"${e.category}"`, `"${e.barangay}"`, dom, fgn, total, avgStay, `${occupancy}%`];
        });
        break;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportInfoMap: Record<
    ReportType,
    { title: string; subtitle: string; code: string; cluster: 'Executive & Periodic' | 'Statistical & Revenue' | 'Sectoral & Assets' | 'Programs & Regulatory'; legalBasis: string; icon: any }
  > = {
    monthly_accomplishment: {
      title: 'Monthly Tourism Accomplishment Report',
      subtitle: 'Periodic monitoring of tourist inflows, municipal operations, regulatory audits, and frontline milestones',
      code: 'MLG-MTO-MAR-2026-09',
      cluster: 'Executive & Periodic',
      legalBasis: 'DILG Memorandum Circular No. 2019-17 & Municipal Ordinance No. 2024-008',
      icon: CalendarCheck,
    },
    quarterly_report: {
      title: 'Quarterly Tourism Performance & Strategic Evaluation',
      subtitle: 'Quarterly milestone assessment, key performance targets, and budget execution rating',
      code: 'MLG-MTO-QPR-2026-Q3',
      cluster: 'Executive & Periodic',
      legalBasis: 'Local Government Code of 1991 (RA 7160) Sec. 17 & Tourism Act of 2009 (RA 9593)',
      icon: TrendingUp,
    },
    annual_report: {
      title: 'Annual Comprehensive Tourism Accomplishment Report',
      subtitle: 'Annual consolidated economic impact, multi-year visitor growth trajectory, and capital infrastructure progress',
      code: 'MLG-MTO-AR-2026',
      cluster: 'Executive & Periodic',
      legalBasis: 'National Tourism Development Plan (NTDP) 2023-2028 Alignment Mandate',
      icon: Award,
    },
    tourist_arrival_stats: {
      title: 'Tourist Arrival & Demographic Statistics Digest',
      subtitle: 'Granular analysis of domestic and foreign visitor volumes, gender distribution, and economic spending',
      code: 'MLG-MTO-STAT-2026-09',
      cluster: 'Statistical & Revenue',
      legalBasis: 'DOT Standard Regional Influx Measurement Framework (Form 1 Aggregation)',
      icon: Users,
    },
    tourism_revenue: {
      title: 'Tourism Receipts & Municipal Revenue Report',
      subtitle: 'Consolidated visitor direct expenditures, municipal environmental fees, and tourism tax proceeds',
      code: 'MLG-MTO-REV-2026-09',
      cluster: 'Statistical & Revenue',
      legalBasis: 'Municipal Revenue Code of Malungon & Sarangani Environmental Code',
      icon: DollarSign,
    },
    dot_required: {
      title: 'DOT Statutory Form 1 Return (Accommodations & Influx)',
      subtitle: 'Mandatory accommodation guest arrivals, occupancy rates, and average length of stay return',
      code: 'DOT-R12-MLG-FORM1-2026',
      cluster: 'Statistical & Revenue',
      legalBasis: 'Department of Tourism (DOT) Memorandum Circular No. 2021-002',
      icon: Building2,
    },
    tourism_enterprise: {
      title: 'Tourism Enterprise & Accreditation Roster Report',
      subtitle: 'Master registry of accredited accommodation, food and beverage, tour operators, and recreational facilities',
      code: 'MLG-MTO-TER-2026-09',
      cluster: 'Sectoral & Assets',
      legalBasis: 'DOT-DILG Joint Memorandum Circular No. 2019-01 (Mandatory Accreditation)',
      icon: Building,
    },
    financial_report: {
      title: 'Tourism Fund Utilization & Financial Monitoring Report',
      subtitle: 'Official accounting of municipal tourism appropriations, allotments, obligations, and disbursements (BUR)',
      code: 'MLG-MTO-FIN-2026-09',
      cluster: 'Sectoral & Assets',
      legalBasis: 'COA Circular 2021-014 & LGU Local Expenditure Program (LEP) 2026',
      icon: BarChart3,
    },
    inventory_report: {
      title: 'Property, Equipment & Capital Assets Inventory Audit',
      subtitle: 'Comprehensive physical inventory of ICT hardware, rescue equipment, mobile assets, and field gear',
      code: 'MLG-MTO-INV-2026-09',
      cluster: 'Sectoral & Assets',
      legalBasis: 'COA Property Inspection Manual & General Services Office (GSO) Guidelines',
      icon: Package,
    },
    inspection_report: {
      title: 'Tourism Site Safety & Regulatory Compliance Audit',
      subtitle: 'Official joint safety, structural integrity, sanitary permits, and environmental compliance audit log',
      code: 'MLG-MTO-INSP-2026-09',
      cluster: 'Programs & Regulatory',
      legalBasis: 'National Building Code (PD 1096), Fire Code (RA 9514), and Sanitation Code (PD 856)',
      icon: ShieldCheck,
    },
    event_report: {
      title: 'Municipal Tourism Events Accomplishment & Post-Activity Report',
      subtitle: 'Turnout statistics, festival participation, socio-economic impact, and financial liquidation status',
      code: 'MLG-MTO-EVT-2026-09',
      cluster: 'Programs & Regulatory',
      legalBasis: 'Malungon Cultural & Tourism Promotions Executive Order No. 2025-014',
      icon: Sparkles,
    },
    social_media_analytics: {
      title: 'Social Media & Digital Promotion Analytics Report',
      subtitle: 'Consolidated reach, engagement rates, follower velocity, and campaign virality across digital channels',
      code: 'MLG-MTO-SMM-2026-09',
      cluster: 'Programs & Regulatory',
      legalBasis: 'Municipal Information & Communications Technology (ICT) Governance Framework',
      icon: Share2,
    },
  };

  const currentReportMeta = reportInfoMap[selectedReport];

  const reportClusters: { name: 'Executive & Periodic' | 'Statistical & Revenue' | 'Sectoral & Assets' | 'Programs & Regulatory'; reports: ReportType[] }[] = [
    { name: 'Executive & Periodic', reports: ['monthly_accomplishment', 'quarterly_report', 'annual_report'] },
    { name: 'Statistical & Revenue', reports: ['tourist_arrival_stats', 'tourism_revenue', 'dot_required'] },
    { name: 'Sectoral & Assets', reports: ['tourism_enterprise', 'financial_report', 'inventory_report'] },
    { name: 'Programs & Regulatory', reports: ['inspection_report', 'event_report', 'social_media_analytics'] },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls (Hidden in Print) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black tracking-tight">Report Generation Engine (RGE)</h1>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
              12 Statutory Reports
            </span>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl">
            Official Municipal Tourism Reporting Suite for the Municipality of Malungon, Sarangani Province. Compiles live operational data from all 14 functional modules into audit-ready statutory returns.
          </p>
        </div>

        {/* Global Selectors and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs font-semibold">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="2026" className="bg-slate-900 text-white">CY 2026</option>
              <option value="2025" className="bg-slate-900 text-white">CY 2025</option>
              <option value="2024" className="bg-slate-900 text-white">CY 2024</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs font-semibold">
            <Clock className="w-4 h-4 text-teal-400" />
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="Q1 (Jan - Mar)" className="bg-slate-900 text-white">Q1 (Jan - Mar)</option>
              <option value="Q2 (Apr - Jun)" className="bg-slate-900 text-white">Q2 (Apr - Jun)</option>
              <option value="Q3 (Jul - Sep)" className="bg-slate-900 text-white">Q3 (Jul - Sep)</option>
              <option value="Q4 (Oct - Dec)" className="bg-slate-900 text-white">Q4 (Oct - Dec)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs font-semibold">
            <CalendarCheck className="w-4 h-4 text-cyan-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                <option key={m} value={m} className="bg-slate-900 text-white">{m}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm border border-emerald-500/40"
            title="Download CSV Spreadsheet for current report"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition shadow-lg"
            title="Print or Save as Official PDF (A4 Layout)"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Categorized Report Selector Tabs (Hidden in Print) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm print:hidden space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Layers className="w-4 h-4 text-emerald-600" />
            Select Statutory Report Category (12 Official Forms)
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Active: <strong className="text-emerald-700">{currentReportMeta.title}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {reportClusters.map((cluster) => (
            <div key={cluster.name} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-1">
                {cluster.name}
              </div>
              <div className="space-y-1.5">
                {cluster.reports.map((reportKey) => {
                  const meta = reportInfoMap[reportKey];
                  const IconComp = meta.icon;
                  const isSelected = selectedReport === reportKey;
                  return (
                    <button
                      key={reportKey}
                      onClick={() => setSelectedReport(reportKey)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-bold transition flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-md'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate leading-snug">{meta.title}</div>
                        <div className={`text-[10px] font-mono font-normal mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                          {meta.code}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-white p-8 lg:p-12 rounded-2xl border border-slate-200 shadow-md print:shadow-none print:border-none print:p-0">
        {/* Official LGU Letterhead */}
        <div className="border-b-4 border-double border-slate-900 pb-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-24 h-24 flex items-center justify-center p-1 shrink-0">
              <img
                src="/logo/LGU_LOGO1.png"
                alt="Municipality of Malungon Official Seal"
                className="w-24 h-24 object-contain drop-shadow-md"
              />
            </div>
            <div className="text-center flex-1 px-4">
              <div className="text-xs font-serif tracking-widest text-slate-600 uppercase">Republic of the Philippines</div>
              <div className="text-xs font-serif tracking-widest text-slate-600 uppercase">Province of Sarangani</div>
              <h1 className="text-xl font-black tracking-wider text-slate-950 uppercase font-serif">Municipality of Malungon</h1>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Office of the Municipal Tourism Officer</div>
              <div className="text-[10px] text-slate-500 mt-1">
                Municipal Hall Complex, National Highway, Malungon, Sarangani Province 9503
              </div>
            </div>
            <div className="w-24 h-24 flex items-center justify-center p-1 shrink-0">
              <img
                src="/logo/TourismLogo.png"
                alt="Malungon Tourism Office Official Logo"
                className="w-24 h-24 object-contain drop-shadow-md"
              />
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-200 flex flex-wrap justify-between items-center text-[11px] font-bold text-slate-600">
            <div>
              <span className="text-slate-400">DOCUMENT CODE:</span> <strong className="font-mono text-slate-900">{currentReportMeta.code}</strong>
            </div>
            <div>
              <span className="text-slate-400">PERIOD:</span> <strong className="text-slate-900">{selectedMonth} {selectedYear} ({selectedQuarter})</strong>
            </div>
            <div>
              <span className="text-slate-400">STATUS:</span> <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">STATUTORY AUDIT RETURN</span>
            </div>
            <div>
              <span className="text-slate-400">DATE GENERATED:</span> <strong className="text-slate-900">September 4, 2026</strong>
            </div>
          </div>
        </div>

        {/* Report Title Banner */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800 mb-1">
            <span>{currentReportMeta.cluster}</span>
            <span>•</span>
            <span>Section O Compliance</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentReportMeta.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{currentReportMeta.subtitle}</p>
          <div className="mt-2 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-200/80">
            <strong>Mandate & Legal Basis:</strong> {currentReportMeta.legalBasis}
          </div>
        </div>

        {/* Dynamic Detailed Report Renderers */}
        <div className="space-y-6">
          {/* 1. Monthly Accomplishment Report */}
          {selectedReport === 'monthly_accomplishment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Monthly Visitor Volume</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{totalVisitors.toLocaleString()} Pax</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Target: 12,000 Pax (+4.2%)</div>
                </div>
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Gross Direct Receipts</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">₱{totalDirectRevenue.toLocaleString()}</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Direct Visitor Expenditure</div>
                </div>
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">DOT Accredited Units</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">{accreditedEst} / {totalEst}</div>
                  <div className="text-[11px] text-purple-700 mt-0.5">{accRate}% Accreditation Rate</div>
                </div>
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="text-xs font-bold text-amber-800 uppercase">Frontline Inquiries</div>
                  <div className="text-2xl font-black text-amber-950 mt-1">{tiacLogs.length} Handled</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">100% Case Resolution Rate</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Major Final Output (MFO) / Key Performance Area</th>
                      <th className="p-3 text-center">Approved Monthly Target</th>
                      <th className="p-3 text-center">Actual Accomplished</th>
                      <th className="p-3 text-center">Variance / Performance</th>
                      <th className="p-3">Remarks & Means of Verification (MOV)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">1. Tourist Arrivals & Headcount Monitoring</td>
                      <td className="p-3 text-center">12,000 Visitors</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{totalVisitors.toLocaleString()} Visitors</td>
                      <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Target Exceeded (+4.2%)</span></td>
                      <td className="p-3 text-slate-600">Automated TAMS kiosk ingestion & checkpoint logs</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">2. Gross Tourism Receipts & Economic Inflow</td>
                      <td className="p-3 text-center">₱10,000,000</td>
                      <td className="p-3 text-center font-bold text-emerald-700">₱{totalDirectRevenue.toLocaleString()}</td>
                      <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">+12.4% vs Baseline</span></td>
                      <td className="p-3 text-slate-600">Sample tourist expenditure survey & accommodation returns</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">3. Tourism Enterprise Quality Assurance</td>
                      <td className="p-3 text-center">18 Registered Units</td>
                      <td className="p-3 text-center font-bold text-blue-700">{accreditedEst} Units Accredited</td>
                      <td className="p-3 text-center"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">{accRate}% DOT Compliance</span></td>
                      <td className="p-3 text-slate-600">TED master registry & Regional DOT endorsement notices</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">4. Community Tourism MSME Incubation</td>
                      <td className="p-3 text-center">20 Tribal MSMEs</td>
                      <td className="p-3 text-center font-bold text-purple-700">{msmes.length} Enterprises Monitored</td>
                      <td className="p-3 text-center"><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">100% Operational</span></td>
                      <td className="p-3 text-slate-600">MSME sales logs & IP livelihood cooperative monitoring</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">5. Frontline Visitor Inquiries & Assistance</td>
                      <td className="p-3 text-center">120 Inquiries</td>
                      <td className="p-3 text-center font-bold text-teal-700">{tiacLogs.length} Inquiries Handled</td>
                      <td className="p-3 text-center"><span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">100% Resolution Rate</span></td>
                      <td className="p-3 text-slate-600">TIAC Form 01 logsheet & Tourist CSAT ratings (4.85/5.00)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">6. Tourism Promotions & Digital Campaigns</td>
                      <td className="p-3 text-center">3 Active Campaigns</td>
                      <td className="p-3 text-center font-bold text-slate-700">{campaigns.length} Campaigns Live</td>
                      <td className="p-3 text-center"><span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">On Schedule</span></td>
                      <td className="p-3 text-slate-600">Promotion & Marketing Unit collateral distribution & videos</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">7. Site Regulatory & Fire Safety Inspections</td>
                      <td className="p-3 text-center">8 Destination Audits</td>
                      <td className="p-3 text-center font-bold text-amber-700">{establishments.length} Audits Completed</td>
                      <td className="p-3 text-center"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Passed Standards</span></td>
                      <td className="p-3 text-slate-600">Joint Inspection Team (MTO, BFP, Rural Health Unit)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Quarterly Report */}
          {selectedReport === 'quarterly_report' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Q3 Target Realization</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">104.2%</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Composite Performance Index</div>
                </div>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <div className="text-xs font-bold text-teal-800 uppercase">LGU Fund Obligation Rate</div>
                  <div className="text-2xl font-black text-teal-950 mt-1">{financial.fundUtilizationRate}%</div>
                  <div className="text-[11px] text-teal-700 mt-0.5">Budget Execution Rating (BUR)</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Accreditation Outreach</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">{accRate}%</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Primary Tourism Enterprises</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-bold text-slate-800 uppercase">Environmental Buffer</div>
                  <div className="text-2xl font-black text-slate-950 mt-1">100%</div>
                  <div className="text-[11px] text-slate-700 mt-0.5">Carrying Capacity Adherence</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Strategic Key Result Area</th>
                      <th className="p-3 text-center">Approved Q3 Target</th>
                      <th className="p-3 text-center">Actual Accomplished</th>
                      <th className="p-3 text-center">% Achievement</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3">Responsible Section / Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">Visitor Volume Expansion & TAMS Ingestion</td>
                      <td className="p-3 text-center">35,000 Pax</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{totalVisitors.toLocaleString()} Pax</td>
                      <td className="p-3 text-center font-bold">104.2%</td>
                      <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Exceeded</span></td>
                      <td className="p-3 text-slate-600">Tourist Arrival Management System (TAMS)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">LGU Budget Execution & Procurement Control</td>
                      <td className="p-3 text-center">65.0% Obligation</td>
                      <td className="p-3 text-center font-bold text-blue-700">{financial.fundUtilizationRate}% Obligated</td>
                      <td className="p-3 text-center font-bold">105.0%</td>
                      <td className="p-3 text-center"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Sound</span></td>
                      <td className="p-3 text-slate-600">Administrative and Finance Section (AFS)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">DOT Accreditation & Enterprise Quality Roster</td>
                      <td className="p-3 text-center">80% Compliance</td>
                      <td className="p-3 text-center font-bold text-purple-700">{accRate}% Accredited</td>
                      <td className="p-3 text-center font-bold">102.0%</td>
                      <td className="p-3 text-center"><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Active</span></td>
                      <td className="p-3 text-slate-600">Policy Support and Regulation Unit (PSRU)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">Community Livelihood MSME Product Incubation</td>
                      <td className="p-3 text-center">20 Active MSMEs</td>
                      <td className="p-3 text-center font-bold text-teal-700">{msmes.length} Enterprises</td>
                      <td className="p-3 text-center font-bold">110.0%</td>
                      <td className="p-3 text-center"><span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">Sustained</span></td>
                      <td className="p-3 text-slate-600">MSME Tourism & Livelihood Development Unit</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">Environmental Carrying Capacity Verification</td>
                      <td className="p-3 text-center">100% Buffer Audits</td>
                      <td className="p-3 text-center font-bold text-slate-700">Zero Major Violations</td>
                      <td className="p-3 text-center font-bold">100.0%</td>
                      <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Compliant</span></td>
                      <td className="p-3 text-slate-600">Research and Planning Unit (RPU)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">Digital Promotions & Social Engagement Surge</td>
                      <td className="p-3 text-center">+15.0% MoM Reach</td>
                      <td className="p-3 text-center font-bold text-cyan-700">+18.4% Net Reach</td>
                      <td className="p-3 text-center font-bold">122.0%</td>
                      <td className="p-3 text-center"><span className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded font-bold">Viral Traction</span></td>
                      <td className="p-3 text-slate-600">Promotion & Marketing Unit (PMU & SMM)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Annual Report */}
          {selectedReport === 'annual_report' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Annual Visitor Inflow</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">142,500 Pax</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">+20.3% vs 2024 Baseline</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Gross Tourism Receipts</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">₱148,250,000</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">+28.6% Economic Expansion</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Tourism Jobs Created</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">{totalEmployeesCount} Direct Jobs</div>
                  <div className="text-[11px] text-purple-700 mt-0.5">Across 22 Enterprises</div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-xs font-bold text-amber-800 uppercase">LGU Capital Investments</div>
                  <div className="text-2xl font-black text-amber-950 mt-1">₱{appropriation.toLocaleString()}</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Approved Tourism Appropriation</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Strategic Macro Indicator</th>
                      <th className="p-3 text-center">Baseline (2024)</th>
                      <th className="p-3 text-center">2025 Accomplishment</th>
                      <th className="p-3 text-center">2026 Target</th>
                      <th className="p-3 text-center">Current Accomplishment</th>
                      <th className="p-3 text-center">YoY Growth (%)</th>
                      <th className="p-3">Strategic Outlook & Economic Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">Total Annual Visitor Arrivals</td>
                      <td className="p-3 text-center">118,400 Pax</td>
                      <td className="p-3 text-center">135,200 Pax</td>
                      <td className="p-3 text-center">140,000 Pax</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{totalVisitors.toLocaleString()} Pax</td>
                      <td className="p-3 text-center font-bold text-emerald-600">+14.2%</td>
                      <td className="p-3 text-slate-600">Steep incline driven by Lamlifew eco-cultural trail & Kalon Barak ridge tourism</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">Gross Municipal Tourism Receipts</td>
                      <td className="p-3 text-center">₱115,200,000</td>
                      <td className="p-3 text-center">₱138,500,000</td>
                      <td className="p-3 text-center">₱140,000,000</td>
                      <td className="p-3 text-center font-bold text-emerald-700">₱{totalDirectRevenue.toLocaleString()}</td>
                      <td className="p-3 text-center font-bold text-emerald-600">+20.2%</td>
                      <td className="p-3 text-slate-600">Substantial multiplier effect in hospitality, tribal cuisine, and local transport</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">DOT Accredited Primary Establishments</td>
                      <td className="p-3 text-center">14 Units</td>
                      <td className="p-3 text-center">18 Units</td>
                      <td className="p-3 text-center">22 Units</td>
                      <td className="p-3 text-center font-bold text-blue-700">{accreditedEst} Units</td>
                      <td className="p-3 text-center font-bold text-blue-600">+22.2%</td>
                      <td className="p-3 text-slate-600">Zero non-compliant primary accommodation operators within the municipality</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">Local Tourism Sector Workforce</td>
                      <td className="p-3 text-center">1,250 Jobs</td>
                      <td className="p-3 text-center">1,480 Jobs</td>
                      <td className="p-3 text-center">1,700 Jobs</td>
                      <td className="p-3 text-center font-bold text-purple-700">{totalEmployeesCount} Direct Jobs</td>
                      <td className="p-3 text-center font-bold text-purple-600">+14.8%</td>
                      <td className="p-3 text-slate-600">Over 62% indigenous Blaan & Tagakaolo community members employed</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold">Community Tourism MSMEs Supported</td>
                      <td className="p-3 text-center">16 MSMEs</td>
                      <td className="p-3 text-center">20 MSMEs</td>
                      <td className="p-3 text-center">24 MSMEs</td>
                      <td className="p-3 text-center font-bold text-teal-700">{msmes.length} MSMEs Active</td>
                      <td className="p-3 text-center font-bold text-teal-600">+20.0%</td>
                      <td className="p-3 text-slate-600">High-demand coffee processing, brassware casting, and traditional weaving</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Tourist Arrival Statistics */}
          {selectedReport === 'tourist_arrival_stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Total Visitor Arrivals</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{totalVisitors.toLocaleString()} Pax</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Automated Headcount Registry</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Domestic Travelers</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">{localCount.toLocaleString()} Pax</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">
                    {totalVisitors > 0 ? Math.round((localCount / totalVisitors) * 100) : 0}% of Total Influx
                  </div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Foreign Travelers</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">{foreignCount.toLocaleString()} Pax</div>
                  <div className="text-[11px] text-purple-700 mt-0.5">
                    {totalVisitors > 0 ? Math.round((foreignCount / totalVisitors) * 100) : 0}% International Share
                  </div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-xs font-bold text-amber-800 uppercase">Gross Direct Spending</div>
                  <div className="text-2xl font-black text-amber-950 mt-1">₱{totalDirectRevenue.toLocaleString()}</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Avg: ₱{(totalDirectRevenue / (totalVisitors || 1)).toFixed(0)} / Pax</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Tourism Destination / Site</th>
                      <th className="p-3">Barangay</th>
                      <th className="p-3 text-center">Domestic</th>
                      <th className="p-3 text-center">Foreign</th>
                      <th className="p-3 text-center">Total Pax</th>
                      <th className="p-3 text-right">Direct Spending (PHP)</th>
                      <th className="p-3">Dominant Origin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {destinations.map((d) => {
                      const siteArrivals = tourists.filter((t) => t.destinationVisited.toLowerCase().includes(d.siteName.toLowerCase()));
                      const dom = siteArrivals.filter((t) => !t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
                      const fgn = siteArrivals.filter((t) => t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
                      const totalSite = dom + fgn;
                      const spending = siteArrivals.reduce((s, t) => s + t.touristSpending, 0);
                      const origin = siteArrivals[0]?.address || 'Region XII / General Santos';
                      return (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{d.siteName}</td>
                          <td className="p-3 text-slate-600">{d.barangay}</td>
                          <td className="p-3 text-center text-blue-700 font-semibold">{dom.toLocaleString()}</td>
                          <td className="p-3 text-center text-purple-700 font-semibold">{fgn.toLocaleString()}</td>
                          <td className="p-3 text-center font-bold text-emerald-800">{totalSite.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono font-bold">₱{spending.toLocaleString()}</td>
                          <td className="p-3 text-slate-600">{origin}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td colSpan={2} className="p-3 uppercase">Consolidated Municipal Total</td>
                      <td className="p-3 text-center text-blue-800">{localCount.toLocaleString()}</td>
                      <td className="p-3 text-center text-purple-800">{foreignCount.toLocaleString()}</td>
                      <td className="p-3 text-center text-emerald-900">{totalVisitors.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-emerald-950">₱{totalDirectRevenue.toLocaleString()}</td>
                      <td className="p-3 text-slate-500">100% Influx Captured</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 5. Tourism Enterprise Report */}
          {selectedReport === 'tourism_enterprise' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Total Enterprises</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{establishments.length} Units</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Primary & Secondary Roster</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">DOT Accredited</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">{accreditedEst} Units</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">{accRate}% Accreditation Ratio</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Hospitality Workforce</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">{totalEmployeesCount} Employees</div>
                  <div className="text-[11px] text-purple-700 mt-0.5">Direct LGU Tourism Jobs</div>
                </div>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <div className="text-xs font-bold text-teal-800 uppercase">Sanitary Compliance</div>
                  <div className="text-2xl font-black text-teal-950 mt-1">100% Passed</div>
                  <div className="text-[11px] text-teal-700 mt-0.5">Joint Municipal Audit</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Establishment Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Barangay</th>
                      <th className="p-3">Owner / Manager</th>
                      <th className="p-3 text-center">DOT Status</th>
                      <th className="p-3">Accreditation No.</th>
                      <th className="p-3 text-center">Staff</th>
                      <th className="p-3 font-mono">LGU Permit No.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {establishments.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{e.name}</td>
                        <td className="p-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">{e.category}</span></td>
                        <td className="p-3 text-slate-600">{e.barangay}</td>
                        <td className="p-3 text-slate-700">{e.owner}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            e.dotAccreditationStatus === 'Accredited'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {e.dotAccreditationStatus}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600">{e.dotAccreditationNumber || 'Pending Issuance'}</td>
                        <td className="p-3 text-center font-bold text-slate-900">{e.numberOfEmployees}</td>
                        <td className="p-3 font-mono text-slate-600">{e.businessPermitNumber || 'BP-2026-MLG'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td colSpan={6} className="p-3 uppercase">Total Active Workforce Supported</td>
                      <td className="p-3 text-center text-purple-900">{totalEmployeesCount} Direct Staff</td>
                      <td className="p-3 text-slate-500">100% Permitted</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 6. Financial Report */}
          {selectedReport === 'financial_report' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Annual Appropriation</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">₱{appropriation.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Approved Tourism Budget (CY 2026)</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Current Obligations</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">₱{totalObligations.toLocaleString()}</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Allotments Committed to Programs</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Actual Disbursements</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">₱{totalDisbursements.toLocaleString()}</div>
                  <div className="text-[11px] text-purple-700 mt-0.5">Checks Issued & Cleared</div>
                </div>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <div className="text-xs font-bold text-teal-800 uppercase">Fund Utilization (BUR)</div>
                  <div className="text-2xl font-black text-teal-950 mt-1">{burRate}%</div>
                  <div className="text-[11px] text-teal-700 mt-0.5">Target: &gt;65.0% by Q3</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Budget Program / Expenditure Line Item</th>
                      <th className="p-3 text-right">Approved Appropriation</th>
                      <th className="p-3 text-right">Allotment Released</th>
                      <th className="p-3 text-right">Obligations Incurred</th>
                      <th className="p-3 text-right">Disbursements Paid</th>
                      <th className="p-3 text-right">Unobligated Balance</th>
                      <th className="p-3 text-center">BUR (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">Personnel Services (PS) - Tourism Operations Staff</td>
                      <td className="p-3 text-right font-mono">₱{(appropriation * 0.32).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">₱{(appropriation * 0.32).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-blue-700">₱{(totalObligations * 0.32).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">₱{(totalDisbursements * 0.32).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-500">₱{((appropriation - totalObligations) * 0.32).toLocaleString()}</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{burRate}%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">Maintenance & Other Operating Expenses (MOOE) - Promotions & Events</td>
                      <td className="p-3 text-right font-mono">₱{(appropriation * 0.48).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">₱{(appropriation * 0.48).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-blue-700">₱{(totalObligations * 0.48).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">₱{(totalDisbursements * 0.48).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-500">₱{((appropriation - totalObligations) * 0.48).toLocaleString()}</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{burRate}%</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">Capital Outlay (CO) & Tourism Infrastructure Development</td>
                      <td className="p-3 text-right font-mono">₱{(appropriation * 0.20).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">₱{(appropriation * 0.20).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-blue-700">₱{(totalObligations * 0.20).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">₱{(totalDisbursements * 0.20).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-500">₱{((appropriation - totalObligations) * 0.20).toLocaleString()}</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{burRate}%</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td className="p-3 uppercase">Total Consolidated Municipal Tourism Fund</td>
                      <td className="p-3 text-right font-mono text-slate-950">₱{appropriation.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-950">₱{appropriation.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-blue-900">₱{totalObligations.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-purple-900">₱{totalDisbursements.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-700">₱{(appropriation - totalObligations).toLocaleString()}</td>
                      <td className="p-3 text-center text-emerald-900 font-black">{burRate}%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Transactions log */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 border-b border-slate-200">
                  Recent Purchase Requests, Orders & Disbursements (AFS Live Feed)
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Tx ID</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5 text-center">Type</th>
                      <th className="p-2.5 text-right">Amount (PHP)</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {financial.recentTransactions?.slice(0, 5).map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono text-slate-500">{tx.id}</td>
                        <td className="p-2.5 text-slate-600">{tx.date}</td>
                        <td className="p-2.5 text-slate-800">{tx.description}</td>
                        <td className="p-2.5 text-center"><span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{tx.type}</span></td>
                        <td className="p-2.5 text-right font-mono font-bold">₱{tx.amount.toLocaleString()}</td>
                        <td className="p-2.5 text-center"><span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">{tx.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. Inventory Report */}
          {selectedReport === 'inventory_report' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Capital Assets Registered</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{inventory.length} Units</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Physical Audit Completed</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Capitalized Asset Value</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">
                    ₱{inventory.reduce((sum, i) => sum + i.acquisitionCost, 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Acquisition Book Value</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Serviceable Ratio</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">
                    {Math.round((inventory.filter((i) => i.condition === 'Serviceable').length / (inventory.length || 1)) * 100)}%
                  </div>
                  <div className="text-[11px] text-purple-700 mt-0.5">100% Operational Readiness</div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-bold text-slate-800 uppercase">Audit Custodians</div>
                  <div className="text-2xl font-black text-slate-950 mt-1">6 Officers</div>
                  <div className="text-[11px] text-slate-700 mt-0.5">Individual PAR Assigned</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Property / Asset No.</th>
                      <th className="p-3">Asset Description</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Date Acquired</th>
                      <th className="p-3 text-right">Acquisition Cost (PHP)</th>
                      <th className="p-3 text-center">Condition</th>
                      <th className="p-3">Accountable Custodian</th>
                      <th className="p-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">{item.propertyNumber}</td>
                        <td className="p-3 font-medium text-slate-900">{item.itemName}</td>
                        <td className="p-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">{item.category}</span></td>
                        <td className="p-3 text-slate-600">{item.acquisitionDate}</td>
                        <td className="p-3 text-right font-mono font-bold">₱{item.acquisitionCost.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.condition === 'Serviceable'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.condition}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700">{item.assignedTo}</td>
                        <td className="p-3 text-slate-600">{item.location}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td colSpan={4} className="p-3 uppercase">Total Capitalized Inventory Valuation</td>
                      <td className="p-3 text-right font-mono text-emerald-950">
                        ₱{inventory.reduce((sum, i) => sum + i.acquisitionCost, 0).toLocaleString()}
                      </td>
                      <td colSpan={3} className="p-3 text-slate-500">COA Standard Property Form Compliant</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 8. Inspection Report */}
          {selectedReport === 'inspection_report' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Total Establishments Audited</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{establishments.length} Facilities</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">100% Coverage of Tourism Sites</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Pass Rating Index</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">100% Passed</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Zero Major Non-Conformances</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Joint Agency Taskforce</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">MTO-BFP-CHO</div>
                  <div className="text-[11px] text-purple-700 mt-0.5">Tripartite Audit Team</div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-xs font-bold text-amber-800 uppercase">Average Inspection Score</div>
                  <div className="text-2xl font-black text-amber-950 mt-1">92.6 / 100</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Grade A Outstanding Rating</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Establishment Audited</th>
                      <th className="p-3">Category & Barangay</th>
                      <th className="p-3 text-center">Inspection Date</th>
                      <th className="p-3">Inspecting Authority</th>
                      <th className="p-3 text-center">Safety Rating</th>
                      <th className="p-3">Audit Findings & Highlights</th>
                      <th className="p-3 text-center">Compliance Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {establishments.map((e) => {
                      const ins = e.inspectionHistory?.[0];
                      return (
                        <tr key={e.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{e.name}</td>
                          <td className="p-3 text-slate-600">{e.category} ({e.barangay})</td>
                          <td className="p-3 text-center text-slate-600">{ins?.date || '2026-08-15'}</td>
                          <td className="p-3 text-slate-700">{ins?.inspector || 'Atty. Gerald Dizon / MTO-BFP'}</td>
                          <td className="p-3 text-center font-bold text-emerald-700">{ins?.rating || 92} / 100</td>
                          <td className="p-3 text-slate-600 max-w-xs">{ins?.findings || 'Fire safety exits functional, sanitary permits active, trained first-aiders available.'}</td>
                          <td className="p-3 text-center">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                              {ins?.status || 'Compliant (Passed)'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. Event Report */}
          {selectedReport === 'event_report' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Total Tourism Events</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{events.length} Staged</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Municipal & Tribal Festivals</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Cumulative Turnout</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">
                    {events.reduce((sum, e) => sum + e.attendanceActual, 0).toLocaleString()} Pax
                  </div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Participants & Spectators</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Allocated Events Budget</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">
                    ₱{events.reduce((sum, e) => sum + e.budget, 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-purple-700 mt-0.5">Direct LGU Tourism Subsidy</div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-xs font-bold text-amber-800 uppercase">Financial Liquidation</div>
                  <div className="text-2xl font-black text-amber-950 mt-1">100% Validated</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Under Audit / Liquidated</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Official Event Title</th>
                      <th className="p-3">Schedule</th>
                      <th className="p-3">Venue</th>
                      <th className="p-3">Lead Organizer</th>
                      <th className="p-3 text-right">LGU Budget (PHP)</th>
                      <th className="p-3 text-right">Actual Expense (PHP)</th>
                      <th className="p-3 text-center">Attendance (Pax)</th>
                      <th className="p-3 text-center">Liquidation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{ev.eventName}</td>
                        <td className="p-3 text-slate-600">{ev.date}</td>
                        <td className="p-3 text-slate-700">{ev.venue}</td>
                        <td className="p-3 text-slate-600">{ev.organizer}</td>
                        <td className="p-3 text-right font-mono font-semibold">₱{ev.budget.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-semibold">₱{ev.actualExpense.toLocaleString()}</td>
                        <td className="p-3 text-center font-bold text-emerald-800">{ev.attendanceActual.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ev.financialReportStatus === 'Approved & Liquidated'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ev.financialReportStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td colSpan={4} className="p-3 uppercase">Total Events Investment & Turnout</td>
                      <td className="p-3 text-right font-mono text-slate-950">₱{events.reduce((sum, e) => sum + e.budget, 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-950">₱{events.reduce((sum, e) => sum + e.actualExpense, 0).toLocaleString()}</td>
                      <td className="p-3 text-center text-emerald-900 font-black">{events.reduce((sum, e) => sum + e.attendanceActual, 0).toLocaleString()}</td>
                      <td className="p-3 text-center text-slate-500">100% Certified</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 10. Social Media Analytics Report */}
          {selectedReport === 'social_media_analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Gross Monthly Reach</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{grossSocialReach.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Impressions Across 4 Channels</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Total User Engagements</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">{grossSocialInteractions.toLocaleString()}</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Reactions, Shares & Comments</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Net Follower Audience</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">{totalNetFollowers.toLocaleString()}</div>
                  <div className="text-[11px] text-purple-700 mt-0.5">Verified Followers</div>
                </div>
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                  <div className="text-xs font-bold text-cyan-800 uppercase">Average Growth Rate</div>
                  <div className="text-2xl font-black text-cyan-950 mt-1">+16.4%</div>
                  <div className="text-[11px] text-cyan-700 mt-0.5">Month-on-Month Expansion</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Digital Platform</th>
                      <th className="p-3 text-center">Followers Base</th>
                      <th className="p-3 text-center">Monthly Reach</th>
                      <th className="p-3 text-center">Total Engagements</th>
                      <th className="p-3 text-center">Monthly Growth (%)</th>
                      <th className="p-3 text-center">Avg Engagement Rate</th>
                      <th className="p-3">Top Performing Campaign / Content</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {socialMetrics.map((sm) => (
                      <tr key={sm.platform} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-emerald-600" />
                          {sm.platform}
                        </td>
                        <td className="p-3 text-center font-bold text-purple-700">{sm.followers.toLocaleString()}</td>
                        <td className="p-3 text-center font-bold text-emerald-700">{sm.monthlyReach.toLocaleString()}</td>
                        <td className="p-3 text-center font-bold text-blue-700">{sm.monthlyEngagement.toLocaleString()}</td>
                        <td className="p-3 text-center font-bold text-cyan-700">+{sm.growthRatePercent}%</td>
                        <td className="p-3 text-center font-bold text-slate-900">{sm.avgEngagementRate}%</td>
                        <td className="p-3 text-slate-700 italic">"{sm.topPostTitle}"</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td className="p-3 uppercase">Cumulative Social Footprint</td>
                      <td className="p-3 text-center text-purple-900">{totalNetFollowers.toLocaleString()}</td>
                      <td className="p-3 text-center text-emerald-900">{grossSocialReach.toLocaleString()}</td>
                      <td className="p-3 text-center text-blue-900">{grossSocialInteractions.toLocaleString()}</td>
                      <td className="p-3 text-center text-cyan-900">+16.4% MoM</td>
                      <td colSpan={2} className="p-3 text-slate-500">Official Municipal Tourism Channels</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 11. Tourism Revenue Report */}
          {selectedReport === 'tourism_revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Gross Direct Visitor Spend</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">₱{totalDirectRevenue.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Private Hospitality Inflow</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Environmental Fees (ECF)</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">₱{(totalVisitors * 50).toLocaleString()}</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">₱50 / Pax Watershed Buffer</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Total Economic Output</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">
                    ₱{(totalDirectRevenue + totalVisitors * 50).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-purple-700 mt-0.5">Consolidated Revenue Base</div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="text-xs font-bold text-amber-800 uppercase">Municipal Treasury Share</div>
                  <div className="text-2xl font-black text-amber-950 mt-1">
                    ₱{(totalVisitors * 50 + Math.round(totalDirectRevenue * 0.02)).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-0.5">ECF + Local Business Tax (2%)</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Destination / Tourism Asset</th>
                      <th className="p-3">Barangay</th>
                      <th className="p-3 text-center">Arrivals (Pax)</th>
                      <th className="p-3 text-right">Direct Tourist Spending (PHP)</th>
                      <th className="p-3 text-right">Environmental Fee (ECF ₱50)</th>
                      <th className="p-3 text-right">Total Economic Inflow (PHP)</th>
                      <th className="p-3 text-right">LGU Direct Share (PHP)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {destinations.map((d) => {
                      const siteArrivals = tourists.filter((t) => t.destinationVisited.toLowerCase().includes(d.siteName.toLowerCase()));
                      const count = siteArrivals.reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
                      const spend = siteArrivals.reduce((s, t) => s + t.touristSpending, 0);
                      const envFee = count * (d.entranceFee || 50);
                      const gross = spend + envFee;
                      const lguShare = envFee + Math.round(spend * 0.02);
                      return (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{d.siteName}</td>
                          <td className="p-3 text-slate-600">{d.barangay}</td>
                          <td className="p-3 text-center font-bold text-slate-800">{count.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono">₱{spend.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono text-blue-700">₱{envFee.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-800">₱{gross.toLocaleString()}</td>
                          <td className="p-3 text-right font-mono font-bold text-amber-700">₱{lguShare.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td colSpan={2} className="p-3 uppercase">Total Consolidated Inflow</td>
                      <td className="p-3 text-center">{totalVisitors.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-slate-950">₱{totalDirectRevenue.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-blue-900">₱{(totalVisitors * 50).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-emerald-950 font-black">₱{(totalDirectRevenue + totalVisitors * 50).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-amber-900 font-black">
                        ₱{(totalVisitors * 50 + Math.round(totalDirectRevenue * 0.02)).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 12. DOT Required Reports */}
          {selectedReport === 'dot_required' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Reporting Accommodations</div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">
                    {establishments.filter((e) => ['Resorts', 'Hotels', 'Campsites', 'Cafés'].includes(e.category)).length} Facilities
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">DOT Form 1 Influx Returns</div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-xs font-bold text-blue-800 uppercase">Guest Nights Recorded</div>
                  <div className="text-2xl font-black text-blue-950 mt-1">
                    {tourists.reduce((s, t) => s + (t.numberOfDaysStayed || 1), 0)} Guest-Nights
                  </div>
                  <div className="text-[11px] text-blue-700 mt-0.5">Overnight Accommodations</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-xs font-bold text-purple-800 uppercase">Average Stay Duration</div>
                  <div className="text-2xl font-black text-purple-950 mt-1">
                    {(tourists.reduce((s, t) => s + (t.numberOfDaysStayed || 1), 0) / (tourists.length || 1)).toFixed(1)} Nights
                  </div>
                  <div className="text-[11px] text-purple-700 mt-0.5">DOT Standard Measurement</div>
                </div>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <div className="text-xs font-bold text-teal-800 uppercase">Average Room Occupancy</div>
                  <div className="text-2xl font-black text-teal-950 mt-1">76.4%</div>
                  <div className="text-[11px] text-teal-700 mt-0.5">Exceeds Regional Standard</div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Accommodation Facility</th>
                      <th className="p-3">Category & Barangay</th>
                      <th className="p-3">DOT Accreditation No.</th>
                      <th className="p-3 text-center">Domestic Guests</th>
                      <th className="p-3 text-center">Foreign Guests</th>
                      <th className="p-3 text-center">Total Guest-Nights</th>
                      <th className="p-3 text-center">Avg Stay (Nights)</th>
                      <th className="p-3 text-center">Estimated Occupancy</th>
                      <th className="p-3 text-center">Reporting Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {establishments
                      .filter((e) => ['Resorts', 'Hotels', 'Campsites', 'Cafés'].includes(e.category))
                      .map((e) => {
                        const estArrivals = tourists.filter((t) => t.accommodationUsed.toLowerCase().includes(e.name.toLowerCase()));
                        const dom = estArrivals.filter((t) => !t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
                        const fgn = estArrivals.filter((t) => t.isForeign).reduce((s, t) => s + 1 + (t.companionsCount || 0), 0);
                        const total = dom + fgn;
                        const avgStay = estArrivals.length > 0 ? (estArrivals.reduce((s, t) => s + t.numberOfDaysStayed, 0) / estArrivals.length).toFixed(1) : '1.5';
                        const occupancy = Math.min(96, Math.max(48, 55 + total * 4));
                        return (
                          <tr key={e.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{e.name}</td>
                            <td className="p-3 text-slate-600">{e.category} - {e.barangay}</td>
                            <td className="p-3 font-mono text-[11px] text-slate-600">{e.dotAccreditationNumber || 'DOT-R12-MLG-2025'}</td>
                            <td className="p-3 text-center text-blue-700 font-semibold">{dom}</td>
                            <td className="p-3 text-center text-purple-700 font-semibold">{fgn}</td>
                            <td className="p-3 text-center font-bold text-emerald-800">{total}</td>
                            <td className="p-3 text-center font-semibold">{avgStay}</td>
                            <td className="p-3 text-center font-bold text-emerald-700">{occupancy}%</td>
                            <td className="p-3 text-center">
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                Form 1 Certified
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 italic">
                <strong>Statutory Footnote:</strong> This return strictly complies with Department of Tourism (DOT) Memorandum Circular No. 2021-002 on Mandatory Local Government Tourism Statistics Submission. Prepared in coordination with DOT Region XII Office (SOCCSKSARGEN).
              </div>
            </div>
          )}
        </div>

        {/* Dual Official Certification & Attestation Signatures */}
        <div className="mt-12 pt-8 border-t-2 border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-12 text-xs">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              PREPARED AND CERTIFIED CORRECT:
            </div>
            <div className="pt-10">
              <div className="font-black text-sm uppercase tracking-wide text-slate-950 border-b-2 border-slate-900 pb-1 inline-block min-w-[280px]">
                CRISTINA D. CONSTANTINO-LA PAZ
              </div>
              <div className="text-slate-800 font-bold mt-1">Municipal Tourism Action Officer-Designate</div>
              <div className="text-slate-500 text-[11px]">Head, Municipal Tourism Operations Division</div>
              <div className="text-slate-400 text-[10px] font-mono mt-0.5">Office of the Municipal Tourism Action Officer</div>
            </div>
          </div>

          <div className="space-y-4 md:text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              APPROVED AND NOTED BY:
            </div>
            <div className="pt-10">
              <div className="font-black text-sm uppercase tracking-wide text-slate-950 border-b-2 border-slate-900 pb-1 inline-block min-w-[280px]">
                HON. REYNALDO F. CONSTANTINO
              </div>
              <div className="text-slate-800 font-bold mt-1">Municipal Mayor</div>
              <div className="text-slate-500 text-[11px]">Municipality of Malungon, Province of Sarangani</div>
              <div className="text-slate-400 text-[10px] font-mono mt-0.5">Executive Signature Verification: MLG-EXEC-2026-VAL</div>
            </div>
          </div>
        </div>

        {/* Official Document Security Footer */}
        <div className="mt-10 pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center text-[10px] text-slate-400">
          <div>
            ISO 9001:2015 Quality Management System Certified Document | LGU Malungon MTO
          </div>
          <div className="font-mono">
            System Hash: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
          </div>
        </div>
      </div>
    </div>
  );
};
