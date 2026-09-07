import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  Search,
  Plus,
  FileText,
  Download,
  Filter,
  Eye,
  FileSpreadsheet,
  FileCode,
  Shield,
  Clock,
  CheckCircle2,
  Calendar,
  Lock,
  Tag,
  Printer,
  Trash2,
  Edit3,
  Layers,
  Map as MapIcon,
  Video,
  Image as ImageIcon,
  FileCheck,
  AlertCircle,
  ExternalLink,
  File,
  X,
  ChevronRight,
  Info,
  Building2,
  Sparkles,
  Share2,
  FileCheck2,
  Award,
  HardDrive
} from 'lucide-react';
import { useTourism } from '../../context/TourismContext';
import { OfficialDocument, DocumentCategory } from '../../types';

export const DocumentManagementView: React.FC = () => {
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    currentUser,
    isReadOnly
  } = useTourism();

  // Sub-tab navigation
  const [activeTab, setActiveTab] = useState<'all' | 'legislative' | 'admin' | 'media_gis' | 'compliance'>('all');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [fileTypeFilter, setFileTypeFilter] = useState('ALL');
  const [securityFilter, setSecurityFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<OfficialDocument | null>(null);
  const [selectedControlSlipDoc, setSelectedControlSlipDoc] = useState<OfficialDocument | null>(null);
  const [selectedMediaSlipDoc, setSelectedMediaSlipDoc] = useState<OfficialDocument | null>(null);
  const [editingDoc, setEditingDoc] = useState<OfficialDocument | null>(null);

  // New Document Form state
  const [formData, setFormData] = useState<Omit<OfficialDocument, 'id'>>({
    controlNumber: `MTO-DOC-2026-${String(documents.length + 1).padStart(3, '0')}`,
    title: '',
    category: 'Memoranda',
    dateIssued: new Date().toISOString().substring(0, 10),
    signatory: currentUser?.name || 'CRISTINA D. CONSTANTINO-LA PAZ (Municipal Tourism Action Officer-Designate)',
    officeOrigin: 'Municipal Tourism Office',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    tags: ['Tourism Administrative', 'LGU Malungon'],
    isConfidential: false,
    description: '',
    status: 'Active / In Force',
  });

  const [tagInput, setTagInput] = useState('Tourism Administrative, LGU Malungon');

  // KPI Calculations
  const totalDocs = documents.length;
  const legislativeDocs = documents.filter((d) =>
    ['Executive Orders', 'Ordinances', 'Resolutions', 'MOAs', 'MOA / MOU'].includes(d.category)
  ).length;
  const adminDocs = documents.filter((d) =>
    ['Memoranda', 'Office Orders', 'Letters', 'Official Letters', 'Minutes of Meetings', 'Attendance Sheets'].includes(d.category)
  ).length;
  const mediaGisDocs = documents.filter((d) =>
    ['Photos', 'Videos', 'GIS Maps'].includes(d.category)
  ).length;
  const complianceDocs = documents.filter((d) =>
    ['Inspection Reports', 'Reports'].includes(d.category)
  ).length;
  const confidentialDocs = documents.filter((d) => d.isConfidential).length;

  // Filtered Documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        doc.controlNumber.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        doc.signatory.toLowerCase().includes(q) ||
        (doc.officeOrigin && doc.officeOrigin.toLowerCase().includes(q)) ||
        (doc.description && doc.description.toLowerCase().includes(q)) ||
        doc.tags.some((t) => t.toLowerCase().includes(q));

      // Tab filter
      let matchesTab = true;
      if (activeTab === 'legislative') {
        matchesTab = ['Executive Orders', 'Ordinances', 'Resolutions', 'MOAs', 'MOA / MOU'].includes(doc.category);
      } else if (activeTab === 'admin') {
        matchesTab = ['Memoranda', 'Office Orders', 'Letters', 'Official Letters', 'Minutes of Meetings', 'Attendance Sheets'].includes(doc.category);
      } else if (activeTab === 'media_gis') {
        matchesTab = ['Photos', 'Videos', 'GIS Maps'].includes(doc.category);
      } else if (activeTab === 'compliance') {
        matchesTab = ['Inspection Reports', 'Reports'].includes(doc.category);
      }

      // Dropdown filters
      const matchesCat = categoryFilter === 'ALL' || doc.category === categoryFilter;
      const matchesType = fileTypeFilter === 'ALL' || doc.fileType === fileTypeFilter;
      const matchesSec =
        securityFilter === 'ALL' ||
        (securityFilter === 'Confidential' ? doc.isConfidential : !doc.isConfidential);

      return matchesSearch && matchesTab && matchesCat && matchesType && matchesSec;
    });
  }, [documents, searchTerm, activeTab, categoryFilter, fileTypeFilter, securityFilter]);

  // Form Submission Handlers
  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const parsedTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addDocument({
      ...formData,
      tags: parsedTags.length > 0 ? parsedTags : ['General Document'],
    });

    setIsAddModalOpen(false);
    setFormData({
      controlNumber: `MTO-DOC-2026-${String(documents.length + 2).padStart(3, '0')}`,
      title: '',
      category: 'Memoranda',
      dateIssued: new Date().toISOString().substring(0, 10),
      signatory: currentUser?.name || 'CRISTINA D. CONSTANTINO-LA PAZ (Municipal Tourism Action Officer-Designate)',
      officeOrigin: 'Municipal Tourism Office',
      fileSize: '1.5 MB',
      fileType: 'PDF',
      tags: ['Tourism Administrative', 'LGU Malungon'],
      isConfidential: false,
      description: '',
      status: 'Active / In Force',
    });
    setTagInput('Tourism Administrative, LGU Malungon');
  };

  const handleUpdateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    updateDocument(editingDoc.id, editingDoc);
    setIsEditModalOpen(false);
    setEditingDoc(null);
  };

  const handleDeleteDocument = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete official document record "${title}"?`)) {
      deleteDocument(id);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Control Number',
      'Document Title',
      'Category',
      'Date Issued',
      'Signatory',
      'Office of Origin',
      'File Type',
      'File Size',
      'Confidentiality',
      'Status',
      'Tags',
      'Description'
    ];

    const rows = filteredDocs.map((d) => [
      `"${d.controlNumber}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.category}"`,
      `"${d.dateIssued}"`,
      `"${d.signatory.replace(/"/g, '""')}"`,
      `"${(d.officeOrigin || 'Municipal Tourism Office').replace(/"/g, '""')}"`,
      `"${d.fileType}"`,
      `"${d.fileSize}"`,
      d.isConfidential ? 'Restricted / Confidential' : 'Public / Official',
      `"${d.status || 'Active / In Force'}"`,
      `"${d.tags.join('; ')}"`,
      `"${(d.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Malungon_MTO_Document_Archive_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Badge Helpers
  const getCategoryBadgeClass = (category: DocumentCategory) => {
    switch (category) {
      case 'Executive Orders':
      case 'Ordinances':
      case 'Resolutions':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Memoranda':
      case 'Office Orders':
      case 'Letters':
      case 'Official Letters':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MOAs':
      case 'MOA / MOU':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Reports':
      case 'Inspection Reports':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Photos':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Videos':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'GIS Maps':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getFileTypeBadgeClass = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'DOCX':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'XLSX':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'JPG':
      case 'PNG':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'MP4':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SHP':
      case 'ZIP':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="p-2.5 bg-indigo-700/60 backdrop-blur rounded-xl border border-indigo-400/30">
              <FolderArchive className="w-6 h-6 text-indigo-200" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Republic of the Philippines • Sarangani Province • Section N
              </span>
              <h1 className="text-2xl font-black tracking-tight">
                Document Management System (DMS)
              </h1>
            </div>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl">
            Central digital archive for all municipal tourism ordinances, executive orders, memoranda, agreements, site inspection reports, meeting records, media assets, and GIS spatial shapefiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur border border-white/20 transition-colors shadow-sm"
            title="Export Master Document Control Register CSV"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-300" />
            Export Archive CSV
          </button>

          {!isReadOnly && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-indigo-500/30"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Upload / Index Document
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Total Indexed Files</div>
            <div className="text-lg font-bold text-slate-900">{totalDocs} Records</div>
            <div className="text-[10px] text-indigo-600 font-semibold">14 Official Categories</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Legislative &amp; Legal</div>
            <div className="text-lg font-bold text-purple-800">{legislativeDocs} Enacted</div>
            <div className="text-[10px] text-slate-500">EOs, Ordinances, MOAs</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Administrative Orders</div>
            <div className="text-lg font-bold text-blue-800">{adminDocs} Orders</div>
            <div className="text-[10px] text-slate-500">Memos, Minutes, Attendance</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Media &amp; GIS Assets</div>
            <div className="text-lg font-bold text-amber-800">{mediaGisDocs} Files</div>
            <div className="text-[10px] text-amber-600 font-medium">Photos, 4K Video, GIS</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Compliance &amp; Audits</div>
            <div className="text-lg font-bold text-emerald-800">{complianceDocs} Audits</div>
            <div className="text-[10px] text-slate-500">{confidentialDocs} Confidential Access</div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="border-b border-slate-200 flex space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => { setActiveTab('all'); setCategoryFilter('ALL'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-white border-t-2 border-indigo-600 text-indigo-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FolderArchive className="w-4 h-4 mr-2 text-indigo-600" />
          All Documents Master Archive
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
            {totalDocs}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('legislative'); setCategoryFilter('ALL'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'legislative'
              ? 'bg-white border-t-2 border-purple-600 text-purple-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 mr-2 text-purple-600" />
          Legislative &amp; Executive Instruments
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold">
            {legislativeDocs}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('admin'); setCategoryFilter('ALL'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'admin'
              ? 'bg-white border-t-2 border-blue-600 text-blue-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 mr-2 text-blue-600" />
          Administrative &amp; Operations Archive
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
            {adminDocs}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('media_gis'); setCategoryFilter('ALL'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'media_gis'
              ? 'bg-white border-t-2 border-amber-600 text-amber-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <MapIcon className="w-4 h-4 mr-2 text-amber-600" />
          Multimedia &amp; GIS Geodatabase
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {mediaGisDocs}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('compliance'); setCategoryFilter('ALL'); setSearchTerm(''); }}
          className={`flex items-center px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all whitespace-nowrap ${
            activeTab === 'compliance'
              ? 'bg-white border-t-2 border-emerald-600 text-emerald-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileCheck2 className="w-4 h-4 mr-2 text-emerald-600" />
          Compliance &amp; Inspection Vault
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {complianceDocs}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search control no, title, signatory, tags..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {activeTab === 'all' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="ALL">All 14 Categories</option>
              <option value="Memoranda">Memoranda</option>
              <option value="Office Orders">Office Orders</option>
              <option value="Executive Orders">Executive Orders</option>
              <option value="Ordinances">Ordinances</option>
              <option value="Minutes of Meetings">Minutes of Meetings</option>
              <option value="Attendance Sheets">Attendance Sheets</option>
              <option value="Letters">Letters</option>
              <option value="Reports">Reports</option>
              <option value="MOAs">MOAs / MOUs</option>
              <option value="Resolutions">Resolutions</option>
              <option value="Photos">Photos</option>
              <option value="Videos">Videos</option>
              <option value="GIS Maps">GIS Maps</option>
              <option value="Inspection Reports">Inspection Reports</option>
            </select>
          )}

          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="ALL">All File Formats</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="XLSX">XLSX</option>
            <option value="JPG">JPG / Image</option>
            <option value="MP4">MP4 Video</option>
            <option value="SHP">SHP Geo-package</option>
          </select>

          <select
            value={securityFilter}
            onChange={(e) => setSecurityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Security Levels</option>
            <option value="Public">Public / Official</option>
            <option value="Confidential">Confidential / Restricted</option>
          </select>

          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === 'table' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                viewMode === 'grid' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Control # &amp; Category</th>
                  <th className="px-4 py-3">Document Subject / Title</th>
                  <th className="px-4 py-3">Origin &amp; Signatory</th>
                  <th className="px-4 py-3">Date Issued</th>
                  <th className="px-4 py-3">File Format &amp; Size</th>
                  <th className="px-4 py-3">Classification</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No documents found matching current filter parameters.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono font-bold text-indigo-700 block">{doc.controlNumber}</span>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadgeClass(doc.category)}`}>
                          {doc.category}
                        </span>
                      </td>

                      <td className="px-4 py-3 max-w-sm">
                        <div className="font-bold text-slate-900 line-clamp-1" title={doc.title}>
                          {doc.title}
                        </div>
                        {doc.description && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={doc.description}>
                            {doc.description}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doc.tags.map((t, i) => (
                            <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{doc.signatory}</div>
                        <div className="text-[10px] text-slate-500">{doc.officeOrigin || 'Municipal Tourism Office'}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                        {doc.dateIssued}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getFileTypeBadgeClass(doc.fileType)}`}>
                          {doc.fileType}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1.5 font-mono">{doc.fileSize}</span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {doc.isConfidential ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <Lock className="w-3 h-3 mr-1" />
                            Confidential
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Official Public
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedPreviewDoc(doc)}
                          className="p-1.5 text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Inspect Document Dossier & Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (['Photos', 'Videos', 'GIS Maps'].includes(doc.category)) {
                              setSelectedMediaSlipDoc(doc);
                            } else {
                              setSelectedControlSlipDoc(doc);
                            }
                          }}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Print Official Document Control Slip (Form 01 / Form 02)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {!isReadOnly && (
                          <button
                            onClick={() => {
                              setEditingDoc(doc);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Document Information"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!isReadOnly && (
                          <button
                            onClick={() => handleDeleteDocument(doc.id, doc.title)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove Document Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRID CARDS VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
              No documents found matching current filter parameters.
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadgeClass(doc.category)}`}>
                      {doc.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getFileTypeBadgeClass(doc.fileType)}`}>
                      {doc.fileType} • {doc.fileSize}
                    </span>
                  </div>

                  <div className="font-mono text-[10px] text-indigo-700 font-bold mb-1">{doc.controlNumber}</div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 mb-2" title={doc.title}>
                    {doc.title}
                  </h4>

                  {doc.mediaThumbnail && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 max-h-36">
                      <img src={doc.mediaThumbnail} alt={doc.title} className="w-full h-32 object-cover" />
                    </div>
                  )}

                  {doc.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2 rounded border border-slate-100">
                      {doc.description}
                    </p>
                  )}

                  <div className="space-y-1 text-xs text-slate-600 mb-3 border-t border-slate-100 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Signatory:</span>
                      <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[180px]">{doc.signatory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Office:</span>
                      <span className="text-slate-700 text-[11px] truncate max-w-[180px]">{doc.officeOrigin || 'MTO'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[11px]">Date Issued:</span>
                      <span className="font-mono text-slate-700 text-[11px]">{doc.dateIssued}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {doc.isConfidential ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-rose-700">
                        <Lock className="w-3 h-3 mr-1" />
                        Confidential
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Official Public
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedPreviewDoc(doc)}
                      className="p-1.5 text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Inspect Document Dossier & Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (['Photos', 'Videos', 'GIS Maps'].includes(doc.category)) {
                          setSelectedMediaSlipDoc(doc);
                        } else {
                          setSelectedControlSlipDoc(doc);
                        }
                      }}
                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Print Document Control Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    {!isReadOnly && (
                      <button
                        onClick={() => handleDeleteDocument(doc.id, doc.title)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL 1: UPLOAD / INDEX NEW DOCUMENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Index Official Document into Archive</h3>
                <p className="text-xs text-indigo-200">Catalog and store official tourism files and media records</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-indigo-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Control Reference Number</label>
                  <input
                    type="text"
                    required
                    value={formData.controlNumber}
                    onChange={(e) => setFormData({ ...formData, controlNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Category (14 Specs)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as DocumentCategory })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Memoranda">Memoranda</option>
                    <option value="Office Orders">Office Orders</option>
                    <option value="Executive Orders">Executive Orders</option>
                    <option value="Ordinances">Ordinances</option>
                    <option value="Minutes of Meetings">Minutes of Meetings</option>
                    <option value="Attendance Sheets">Attendance Sheets</option>
                    <option value="Letters">Letters</option>
                    <option value="Reports">Reports</option>
                    <option value="MOAs">MOAs / MOUs</option>
                    <option value="Resolutions">Resolutions</option>
                    <option value="Photos">Photos</option>
                    <option value="Videos">Videos</option>
                    <option value="GIS Maps">GIS Maps</option>
                    <option value="Inspection Reports">Inspection Reports</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Subject / Master Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Order No. 12 s. 2026 - Creation of Kalon Barak Task Force"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Signatory / Authority</label>
                  <input
                    type="text"
                    required
                    value={formData.signatory}
                    onChange={(e) => setFormData({ ...formData, signatory: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Office of Origin</label>
                  <input
                    type="text"
                    value={formData.officeOrigin}
                    onChange={(e) => setFormData({ ...formData, officeOrigin: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date Issued / Promulgated</label>
                  <input
                    type="date"
                    required
                    value={formData.dateIssued}
                    onChange={(e) => setFormData({ ...formData, dateIssued: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">File Format</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">DOCX Word Document</option>
                    <option value="XLSX">XLSX Excel Spreadsheet</option>
                    <option value="JPG">JPG / Image Archive</option>
                    <option value="PNG">PNG Graphic</option>
                    <option value="MP4">MP4 Video Clip</option>
                    <option value="SHP">SHP Geo-Spatial Package</option>
                    <option value="ZIP">ZIP Digital Archive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.4 MB"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Narrative Abstract / Brief Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of terms, clauses, mandates, or asset contents..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Governance, Ordinance, Tourism Code, Eco-Tourism"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="confidentialAdd"
                  checked={formData.isConfidential}
                  onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="confidentialAdd" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Classify as Confidential / Restricted Access (Executive Clearance Required)
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow"
                >
                  Confirm Archive Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT DOCUMENT */}
      {isEditModalOpen && editingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-amber-800 to-slate-900 text-white p-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Edit Document Archive Record</h3>
                <p className="text-xs text-amber-200">Update metadata and control information</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-amber-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateDocument} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Control Reference Number</label>
                  <input
                    type="text"
                    required
                    value={editingDoc.controlNumber}
                    onChange={(e) => setEditingDoc({ ...editingDoc, controlNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingDoc.category}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value as DocumentCategory })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Memoranda">Memoranda</option>
                    <option value="Office Orders">Office Orders</option>
                    <option value="Executive Orders">Executive Orders</option>
                    <option value="Ordinances">Ordinances</option>
                    <option value="Minutes of Meetings">Minutes of Meetings</option>
                    <option value="Attendance Sheets">Attendance Sheets</option>
                    <option value="Letters">Letters</option>
                    <option value="Reports">Reports</option>
                    <option value="MOAs">MOAs / MOUs</option>
                    <option value="Resolutions">Resolutions</option>
                    <option value="Photos">Photos</option>
                    <option value="Videos">Videos</option>
                    <option value="GIS Maps">GIS Maps</option>
                    <option value="Inspection Reports">Inspection Reports</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Signatory</label>
                  <input
                    type="text"
                    required
                    value={editingDoc.signatory}
                    onChange={(e) => setEditingDoc({ ...editingDoc, signatory: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Office of Origin</label>
                  <input
                    type="text"
                    value={editingDoc.officeOrigin || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, officeOrigin: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingDoc.description || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="confidentialEdit"
                  checked={editingDoc.isConfidential}
                  onChange={(e) => setEditingDoc({ ...editingDoc, isConfidential: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="confidentialEdit" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Confidential / Restricted Access
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DOCUMENT INSPECTION DOSSIER & PREVIEW */}
      {selectedPreviewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-t-2xl flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">
                  {selectedPreviewDoc.controlNumber} • {selectedPreviewDoc.category}
                </span>
                <h3 className="font-bold text-base leading-snug">{selectedPreviewDoc.title}</h3>
              </div>
              <button onClick={() => setSelectedPreviewDoc(null)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4">
              {selectedPreviewDoc.mediaThumbnail && (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img src={selectedPreviewDoc.mediaThumbnail} alt={selectedPreviewDoc.title} className="w-full h-56 object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category</span>
                  <span className="font-bold text-slate-900">{selectedPreviewDoc.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date Promulgated</span>
                  <span className="font-semibold text-slate-800 font-mono">{selectedPreviewDoc.dateIssued}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">File Specs</span>
                  <span className="font-semibold text-slate-800">{selectedPreviewDoc.fileType} ({selectedPreviewDoc.fileSize})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Originating Office</span>
                  <span className="font-semibold text-slate-800">{selectedPreviewDoc.officeOrigin || 'MTO'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Signatory</span>
                  <span className="font-semibold text-slate-800">{selectedPreviewDoc.signatory}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Security Level</span>
                  <span className={selectedPreviewDoc.isConfidential ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                    {selectedPreviewDoc.isConfidential ? 'Restricted / Confidential' : 'Public / Official'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-1">Official Abstract / Content Summary</h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {selectedPreviewDoc.description || 'Certified official municipal tourism administrative record stored in LGU archives.'}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-1">Indexed Metadata Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPreviewDoc.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Simulated secure file stream: Initiating download for ${selectedPreviewDoc.controlNumber}.${selectedPreviewDoc.fileType.toLowerCase()} (${selectedPreviewDoc.fileSize})`);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center transition-colors shadow"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5 text-indigo-300" />
                  Download File ({selectedPreviewDoc.fileSize})
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const doc = selectedPreviewDoc;
                      setSelectedPreviewDoc(null);
                      if (['Photos', 'Videos', 'GIS Maps'].includes(doc.category)) {
                        setSelectedMediaSlipDoc(doc);
                      } else {
                        setSelectedControlSlipDoc(doc);
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center transition-colors shadow"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" />
                    Print Document Control Slip
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewDoc(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL 1: LGU DMS FORM 01 - OFFICIAL RECORDS TRANSMITTAL & ARCHIVE CONTROL SLIP */}
      {selectedControlSlipDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6">
              {/* Document Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                <div className="text-xs uppercase tracking-widest font-semibold text-slate-500">
                  Republic of the Philippines • Province of Sarangani
                </div>
                <div className="text-lg font-black text-slate-900 uppercase">
                  Municipality of Malungon
                </div>
                <div className="text-xs font-bold text-indigo-800 uppercase tracking-wide">
                  Municipal Tourism Office — Records &amp; Archives Division
                </div>
                <div className="mt-2 inline-block px-3 py-1 bg-indigo-900 text-white text-xs font-bold uppercase tracking-wider rounded">
                  LGU DMS FORM 01: Official Document Control &amp; Transmittal Slip
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Control Reference No.:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedControlSlipDoc.controlNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date Promulgated / Issued:</span>
                  <span className="font-semibold text-slate-900">{selectedControlSlipDoc.dateIssued}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Category Classification:</span>
                  <span className="font-semibold text-slate-900">{selectedControlSlipDoc.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Security Classification:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedControlSlipDoc.isConfidential ? 'Restricted / Confidential' : 'General Public Official'}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-1 border-b pb-1">
                  1. Document Subject &amp; Formal Title
                </h4>
                <div className="p-3 bg-indigo-50/50 rounded border border-indigo-200 text-xs font-bold text-slate-900 leading-snug">
                  {selectedControlSlipDoc.title}
                </div>
              </div>

              {/* Authority */}
              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <span className="text-slate-500 block">Certifying Signatory:</span>
                  <span className="font-bold text-slate-900">{selectedControlSlipDoc.signatory}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Office of Origin:</span>
                  <span className="font-semibold text-slate-900">{selectedControlSlipDoc.officeOrigin || 'Municipal Tourism Office'}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-1 border-b pb-1">
                  2. Executive Summary &amp; Legal Mandate
                </h4>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {selectedControlSlipDoc.description || 'Certified official administrative record safely deposited into the MTODMS Central Records Repository.'}
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-300">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    {selectedControlSlipDoc.signatory}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Certifying Authority / Signatory
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    {currentUser?.name || 'Chief Records Officer'}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    LGU MTODMS Central Archivist
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-2 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => setSelectedControlSlipDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-lg shadow flex items-center"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Official Transmittal Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MODAL 2: LGU DMS FORM 02 - MEDIA & SPATIAL ASSET CUSTODY RECORD */}
      {selectedMediaSlipDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6">
              {/* Document Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                <div className="text-xs uppercase tracking-widest font-semibold text-slate-500">
                  Republic of the Philippines • Province of Sarangani
                </div>
                <div className="text-lg font-black text-slate-900 uppercase">
                  Municipality of Malungon
                </div>
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  Municipal Tourism Office — Digital Media &amp; GIS Photogrammetry Vault
                </div>
                <div className="mt-2 inline-block px-3 py-1 bg-amber-900 text-white text-xs font-bold uppercase tracking-wider rounded">
                  LGU DMS FORM 02: Official Media &amp; Spatial Digital Asset Custody Record
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Digital Asset ID:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedMediaSlipDoc.controlNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Asset Classification:</span>
                  <span className="font-semibold text-slate-900">{selectedMediaSlipDoc.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Digital Format &amp; Size:</span>
                  <span className="font-semibold text-slate-900">{selectedMediaSlipDoc.fileType} ({selectedMediaSlipDoc.fileSize})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Archival Ingestion Date:</span>
                  <span className="font-semibold text-slate-900">{selectedMediaSlipDoc.dateIssued}</span>
                </div>
              </div>

              {/* Asset Description */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-1 border-b pb-1">
                  1. Digital Asset Title &amp; Technical Specifications
                </h4>
                <div className="p-3 bg-amber-50/50 rounded border border-amber-200 text-xs font-bold text-slate-900 leading-snug mb-2">
                  {selectedMediaSlipDoc.title}
                </div>
                <p className="text-xs text-slate-700 italic">
                  {selectedMediaSlipDoc.description}
                </p>
              </div>

              {/* Legal Rights & Custody */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-1 border-b pb-1">
                  2. Intellectual Property &amp; Territorial Governance
                </h4>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  Property of the Municipality of Malungon. Authorized for municipal promotional campaigns, national DOT roadshows, and official GIS spatial planning. Free of third-party copyright encumbrances.
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-300">
                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    {selectedMediaSlipDoc.signatory}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Digital Media Specialist / GIS Officer
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                    CRISTINA D. CONSTANTINO-LA PAZ
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Municipal Tourism Action Officer-Designate
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-2 pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={() => setSelectedMediaSlipDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow flex items-center"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Official Media Custody Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
