import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  ModuleKey,
  TouristArrival,
  TourismEstablishment,
  MSMETourism,
  TourismDestination,
  TourismEvent,
  EmployeeRecord,
  OfficeInventoryItem,
  FinancialMonitoringRecord,
  TourismResearch,
  TourismPolicy,
  NoticeOfViolation,
  TouristComplaint,
  TourismProduct,
  CapacityBuildingTraining,
  TourismInvestmentOpportunity,
  MarketingCampaign,
  MarketingCollateralItem,
  MarketingPartner,
  SocialMediaPlatformStat,
  ScheduledPost,
  TopSocialPost,
  SocialCampaignMetric,
  VisitorAssistanceLog,
  LostAndFoundItem,
  EmergencyCaseLog,
  TouristFeedbackEntry,
  FAQItem,
  OfficialDocument,
  AuditLogEntry,
} from '../types';

import {
  MUNICIPALITY_INFO,
  INITIAL_USERS,
  INITIAL_TOURISTS,
  INITIAL_ESTABLISHMENTS,
  INITIAL_MSMES,
  INITIAL_DESTINATIONS,
  INITIAL_EVENTS,
  INITIAL_EMPLOYEES,
  INITIAL_INVENTORY,
  INITIAL_FINANCIAL,
  INITIAL_RESEARCH,
  INITIAL_POLICIES,
  INITIAL_NOTICES,
  INITIAL_COMPLAINTS,
  INITIAL_PRODUCTS,
  INITIAL_CAPACITY_TRAININGS,
  INITIAL_INVESTMENT_OPPORTUNITIES,
  INITIAL_CAMPAIGNS,
  INITIAL_COLLATERALS,
  INITIAL_MARKETING_PARTNERS,
  INITIAL_SOCIAL_METRICS,
  INITIAL_SCHEDULED_POSTS,
  INITIAL_TOP_POSTS,
  INITIAL_SOCIAL_CAMPAIGNS,
  INITIAL_TIAC_LOGS,
  INITIAL_LOST_AND_FOUND,
  INITIAL_EMERGENCY_LOGS,
  INITIAL_TOURIST_FEEDBACK,
  INITIAL_FAQS,
  INITIAL_DOCUMENTS,
  INITIAL_AUDIT_LOGS,
} from '../data/seedData';

interface SystemNotification {
  id: string;
  type: 'SMS' | 'Email' | 'System';
  recipient: string;
  subject: string;
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Pending';
}

interface TourismContextType {
  // Current user & role
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  canAccess: (module: ModuleKey) => boolean;
  isReadOnly: boolean;

  // Active module
  activeModule: ModuleKey;
  setActiveModule: (module: ModuleKey) => void;
  currentModule: ModuleKey;
  setCurrentModule: (module: ModuleKey) => void;

  // Global Municipality Info
  municipalityInfo: typeof MUNICIPALITY_INFO;

  // Collections & CRUD
  tourists: TouristArrival[];
  addTourist: (tourist: Omit<TouristArrival, 'id'>) => void;
  updateTourist: (id: string, updated: Partial<TouristArrival>) => void;
  deleteTourist: (id: string) => void;

  establishments: TourismEstablishment[];
  addEstablishment: (est: Omit<TourismEstablishment, 'id'>) => void;
  updateEstablishment: (id: string, updated: Partial<TourismEstablishment>) => void;
  deleteEstablishment: (id: string) => void;

  msmes: MSMETourism[];
  addMsme: (msme: Omit<MSMETourism, 'id'>) => void;
  updateMsme: (id: string, updated: Partial<MSMETourism>) => void;
  deleteMsme: (id: string) => void;

  destinations: TourismDestination[];
  addDestination: (dest: Omit<TourismDestination, 'id'>) => void;
  updateDestination: (id: string, updated: Partial<TourismDestination>) => void;
  deleteDestination: (id: string) => void;

  events: TourismEvent[];
  addEvent: (ev: Omit<TourismEvent, 'id'>) => void;
  updateEvent: (id: string, updated: Partial<TourismEvent>) => void;
  deleteEvent: (id: string) => void;

  // Admin & Finance
  employees: EmployeeRecord[];
  addEmployee: (emp: Omit<EmployeeRecord, 'id'>) => void;
  updateEmployee: (id: string, updated: Partial<EmployeeRecord>) => void;
  deleteEmployee: (id: string) => void;

  inventory: OfficeInventoryItem[];
  addInventoryItem: (item: Omit<OfficeInventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, updated: Partial<OfficeInventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  financial: FinancialMonitoringRecord;
  updateFinancial: (updated: Partial<FinancialMonitoringRecord>) => void;

  // Research & Policies
  research: TourismResearch[];
  addResearch: (res: Omit<TourismResearch, 'id'>) => void;
  updateResearch: (id: string, updated: Partial<TourismResearch>) => void;
  deleteResearch: (id: string) => void;

  policies: TourismPolicy[];
  addPolicy: (pol: Omit<TourismPolicy, 'id'>) => void;
  updatePolicy: (id: string, updated: Partial<TourismPolicy>) => void;
  deletePolicy: (id: string) => void;

  notices: NoticeOfViolation[];
  addNotice: (not: Omit<NoticeOfViolation, 'id'>) => void;
  updateNotice: (id: string, updated: Partial<NoticeOfViolation>) => void;
  deleteNotice: (id: string) => void;
  resolveNotice: (id: string) => void;

  complaints: TouristComplaint[];
  addComplaint: (comp: Omit<TouristComplaint, 'id'>) => void;
  updateComplaintStatus: (id: string, status: TouristComplaint['status'], resolutionNotes?: string) => void;
  updateComplaint: (id: string, data: Partial<TouristComplaint>) => void;
  deleteComplaint: (id: string) => void;

  feedbacks: TouristFeedbackEntry[];
  addFeedback: (feedback: Omit<TouristFeedbackEntry, 'id'>) => void;
  updateFeedbackStatus: (id: string, status: string) => void;

  // Product Dev
  products: TourismProduct[];
  addProduct: (prod: Omit<TourismProduct, 'id'>) => void;
  updateProduct: (id: string, data: Partial<TourismProduct>) => void;
  deleteProduct: (id: string) => void;
  capacityTrainings: CapacityBuildingTraining[];
  addCapacityTraining: (training: Omit<CapacityBuildingTraining, 'id'>) => void;
  updateCapacityTraining: (id: string, data: Partial<CapacityBuildingTraining>) => void;
  deleteCapacityTraining: (id: string) => void;
  investmentOpportunities: TourismInvestmentOpportunity[];
  addInvestmentOpportunity: (opp: Omit<TourismInvestmentOpportunity, 'id'>) => void;
  updateInvestmentOpportunity: (id: string, data: Partial<TourismInvestmentOpportunity>) => void;
  deleteInvestmentOpportunity: (id: string) => void;

  // Marketing & Social
  campaigns: MarketingCampaign[];
  addCampaign: (camp: Omit<MarketingCampaign, 'id'>) => void;
  updateCampaign: (id: string, data: Partial<MarketingCampaign>) => void;
  deleteCampaign: (id: string) => void;
  marketingCollaterals: MarketingCollateralItem[];
  addCollateral: (item: Omit<MarketingCollateralItem, 'id'>) => void;
  updateCollateral: (id: string, data: Partial<MarketingCollateralItem>) => void;
  deleteCollateral: (id: string) => void;
  marketingPartners: MarketingPartner[];
  addPartner: (partner: Omit<MarketingPartner, 'id'>) => void;
  updatePartner: (id: string, data: Partial<MarketingPartner>) => void;
  deletePartner: (id: string) => void;

  socialMetrics: SocialMediaPlatformStat[];
  updatePlatformStat: (platform: string, data: Partial<SocialMediaPlatformStat>) => void;
  topPosts: TopSocialPost[];
  addTopPost: (post: Omit<TopSocialPost, 'id'>) => void;
  deleteTopPost: (id: string) => void;
  scheduledPosts: ScheduledPost[];
  addScheduledPost: (post: Omit<ScheduledPost, 'id'>) => void;
  updateScheduledPost: (id: string, data: Partial<ScheduledPost>) => void;
  deleteScheduledPost: (id: string) => void;
  publishScheduledPost: (id: string) => void;
  socialCampaigns: SocialCampaignMetric[];
  addSocialCampaign: (camp: Omit<SocialCampaignMetric, 'id'>) => void;
  deleteSocialCampaign: (id: string) => void;

  // TIAC
  tiacLogs: VisitorAssistanceLog[];
  addTiacLog: (log: Omit<VisitorAssistanceLog, 'id'>) => void;
  updateTiacLog: (id: string, data: Partial<VisitorAssistanceLog>) => void;
  deleteTiacLog: (id: string) => void;

  lostAndFound: LostAndFoundItem[];
  addLostItem: (item: Omit<LostAndFoundItem, 'id'>) => void;
  claimLostItem: (id: string, claimantName: string) => void;
  deleteLostItem: (id: string) => void;

  emergencyLogs: EmergencyCaseLog[];
  addEmergencyLog: (log: Omit<EmergencyCaseLog, 'id'>) => void;
  updateEmergencyLog: (id: string, data: Partial<EmergencyCaseLog>) => void;

  touristFeedback: TouristFeedbackEntry[];
  addTouristFeedback: (feedback: Omit<TouristFeedbackEntry, 'id'>) => void;

  faqs: FAQItem[];
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;

  // Documents
  documents: OfficialDocument[];
  addDocument: (doc: Omit<OfficialDocument, 'id'>) => void;
  updateDocument: (id: string, data: Partial<OfficialDocument>) => void;
  deleteDocument: (id: string) => void;

  // Audit trail
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: AuditLogEntry['action'], module: string, details: string) => void;

  // Notifications
  notifications: SystemNotification[];
  sendNotification: (type: 'SMS' | 'Email', recipient: string, subject: string, message: string) => void;

  // Backup & Restore
  exportBackupJson: () => string;
  importBackupJson: (jsonData: string) => boolean;
  resetToDefaultData: () => void;
}

const TourismContext = createContext<TourismContextType | undefined>(undefined);

const STORAGE_KEY = 'mtodms_malungon_v1';

export const TourismProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[1]); // Default to Municipal Tourism Officer
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');

  // Load from localStorage or fallback to initial seeds
  const [tourists, setTourists] = useState<TouristArrival[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tourists`);
    return saved ? JSON.parse(saved) : INITIAL_TOURISTS;
  });

  const [establishments, setEstablishments] = useState<TourismEstablishment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_establishments`);
    return saved ? JSON.parse(saved) : INITIAL_ESTABLISHMENTS;
  });

  const [msmes, setMsmes] = useState<MSMETourism[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_msmes`);
    return saved ? JSON.parse(saved) : INITIAL_MSMES;
  });

  const [destinations, setDestinations] = useState<TourismDestination[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_destinations`);
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  const [events, setEvents] = useState<TourismEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_employees`);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [inventory, setInventory] = useState<OfficeInventoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [financial, setFinancial] = useState<FinancialMonitoringRecord>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_financial`);
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL;
  });

  const [research, setResearch] = useState<TourismResearch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_research`);
    return saved ? JSON.parse(saved) : INITIAL_RESEARCH;
  });

  const [policies, setPolicies] = useState<TourismPolicy[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_policies`);
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
  });

  const [notices, setNotices] = useState<NoticeOfViolation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notices`);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [complaints, setComplaints] = useState<TouristComplaint[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_complaints`);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [products, setProducts] = useState<TourismProduct[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [capacityTrainings, setCapacityTrainings] = useState<CapacityBuildingTraining[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_capacity_trainings`);
    return saved ? JSON.parse(saved) : INITIAL_CAPACITY_TRAININGS;
  });

  const [investmentOpportunities, setInvestmentOpportunities] = useState<TourismInvestmentOpportunity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_investment_opps`);
    return saved ? JSON.parse(saved) : INITIAL_INVESTMENT_OPPORTUNITIES;
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_campaigns`);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [marketingCollaterals, setMarketingCollaterals] = useState<MarketingCollateralItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_marketing_collaterals`);
    return saved ? JSON.parse(saved) : INITIAL_COLLATERALS;
  });

  const [marketingPartners, setMarketingPartners] = useState<MarketingPartner[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_marketing_partners`);
    return saved ? JSON.parse(saved) : INITIAL_MARKETING_PARTNERS;
  });

  const [socialMetrics, setSocialMetrics] = useState<SocialMediaPlatformStat[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_social_metrics`);
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_METRICS;
  });

  const [topPosts, setTopPosts] = useState<TopSocialPost[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_top_posts`);
    return saved ? JSON.parse(saved) : INITIAL_TOP_POSTS;
  });

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_scheduled_posts`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_POSTS;
  });

  const [socialCampaigns, setSocialCampaigns] = useState<SocialCampaignMetric[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_social_campaigns`);
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL_CAMPAIGNS;
  });

  const [tiacLogs, setTiacLogs] = useState<VisitorAssistanceLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tiac_logs`);
    return saved ? JSON.parse(saved) : INITIAL_TIAC_LOGS;
  });

  const [lostAndFound, setLostAndFound] = useState<LostAndFoundItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_lost_found`);
    return saved ? JSON.parse(saved) : INITIAL_LOST_AND_FOUND;
  });

  const [emergencyLogs, setEmergencyLogs] = useState<EmergencyCaseLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_emergency_logs`);
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_LOGS;
  });

  const [touristFeedback, setTouristFeedback] = useState<TouristFeedbackEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tourist_feedback`);
    return saved ? JSON.parse(saved) : INITIAL_TOURIST_FEEDBACK;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_faqs`);
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [documents, setDocuments] = useState<OfficialDocument[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_documents`);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-1',
      type: 'SMS',
      recipient: '+63 917 222 9876 (Kalon Barak Skyline)',
      subject: 'Annual DOT Accreditation Renewal Notice',
      message: 'Notice from MTO Malungon: Kindly submit your renewal documents by Jan 20, 2027.',
      sentAt: '2026-09-02 08:30 AM',
      status: 'Delivered',
    },
    {
      id: 'notif-2',
      type: 'Email',
      recipient: 'all-enterprises@malungon.gov.ph',
      subject: 'DOT Region XII Advisory: 18th Slang Festival Special Rates',
      message: 'Encouraging all accredited accommodation providers to activate visitor discount packages for Slang Festival.',
      sentAt: '2026-09-01 02:15 PM',
      status: 'Delivered',
    },
  ]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tourists`, JSON.stringify(tourists));
  }, [tourists]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_establishments`, JSON.stringify(establishments));
  }, [establishments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_msmes`, JSON.stringify(msmes));
  }, [msmes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_destinations`, JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_employees`, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_financial`, JSON.stringify(financial));
  }, [financial]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_research`, JSON.stringify(research));
  }, [research]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_policies`, JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_complaints`, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_capacity_trainings`, JSON.stringify(capacityTrainings));
  }, [capacityTrainings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_investment_opps`, JSON.stringify(investmentOpportunities));
  }, [investmentOpportunities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_campaigns`, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_marketing_collaterals`, JSON.stringify(marketingCollaterals));
  }, [marketingCollaterals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_marketing_partners`, JSON.stringify(marketingPartners));
  }, [marketingPartners]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_social_metrics`, JSON.stringify(socialMetrics));
  }, [socialMetrics]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_top_posts`, JSON.stringify(topPosts));
  }, [topPosts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_scheduled_posts`, JSON.stringify(scheduledPosts));
  }, [scheduledPosts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_social_campaigns`, JSON.stringify(socialCampaigns));
  }, [socialCampaigns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tiac_logs`, JSON.stringify(tiacLogs));
  }, [tiacLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_lost_found`, JSON.stringify(lostAndFound));
  }, [lostAndFound]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_emergency_logs`, JSON.stringify(emergencyLogs));
  }, [emergencyLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tourist_feedback`, JSON.stringify(touristFeedback));
  }, [touristFeedback]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_faqs`, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_documents`, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Audit logging helper
  const addAuditLog = (action: AuditLogEntry['action'], module: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 199)]);
  };

  // Role Access Control checking (from Section IV. USER ACCESS LEVEL)
  const canAccess = (module: ModuleKey): boolean => {
    const role = currentUser.role;
    if (role === 'System Administrator' || role === 'Municipal Tourism Officer') {
      return true;
    }
    switch (role) {
      case 'Administrative and Finance Personnel':
        return ['dashboard', 'admin_finance', 'documents', 'reports'].includes(module);
      case 'Research and Planning Personnel':
        return ['dashboard', 'research_planning', 'destinations', 'reports', 'documents'].includes(module);
      case 'Policy Support and Regulation Personnel':
        return ['dashboard', 'policy_regulation', 'establishments', 'reports', 'documents'].includes(module);
      case 'Product Development Personnel':
        return ['dashboard', 'product_dev', 'destinations', 'msmes', 'reports'].includes(module);
      case 'Promotion and Marketing Personnel':
        return ['dashboard', 'marketing', 'events', 'social_media', 'reports'].includes(module);
      case 'Social Media Manager':
        return ['dashboard', 'social_media', 'marketing', 'events'].includes(module);
      case 'Tourism Information Officer':
        return ['dashboard', 'tiac', 'tourists', 'destinations'].includes(module);
      case 'Data Encoder':
        return ['dashboard', 'tourists', 'establishments', 'msmes', 'events'].includes(module);
      case 'Guest/User':
        return ['dashboard', 'destinations', 'events', 'product_dev'].includes(module);
      default:
        return true;
    }
  };

  const isReadOnly = currentUser.role === 'Guest/User';

  // CRUD Implementations
  const addTourist = (touristData: Omit<TouristArrival, 'id'>) => {
    const newTourist: TouristArrival = {
      id: `ta-${Date.now()}`,
      ...touristData,
    };
    setTourists((prev) => [newTourist, ...prev]);
    addAuditLog('CREATE', 'Tourist Arrival Management', `Registered visitor ${newTourist.name} (${newTourist.touristId})`);
  };

  const updateTourist = (id: string, updated: Partial<TouristArrival>) => {
    setTourists((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    addAuditLog('UPDATE', 'Tourist Arrival Management', `Updated visitor record ID ${id}`);
  };

  const deleteTourist = (id: string) => {
    const target = tourists.find((t) => t.id === id);
    setTourists((prev) => prev.filter((t) => t.id !== id));
    addAuditLog('DELETE', 'Tourist Arrival Management', `Removed visitor record ${target?.name || id}`);
  };

  const addEstablishment = (estData: Omit<TourismEstablishment, 'id'>) => {
    const newEst: TourismEstablishment = {
      id: `est-${Date.now()}`,
      ...estData,
    };
    setEstablishments((prev) => [newEst, ...prev]);
    addAuditLog('CREATE', 'Tourism Establishment Database', `Registered enterprise ${newEst.name} under ${newEst.category}`);
  };

  const updateEstablishment = (id: string, updated: Partial<TourismEstablishment>) => {
    setEstablishments((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    addAuditLog('UPDATE', 'Tourism Establishment Database', `Updated enterprise record ${id}`);
  };

  const deleteEstablishment = (id: string) => {
    const target = establishments.find((e) => e.id === id);
    setEstablishments((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('DELETE', 'Tourism Establishment Database', `Archived enterprise ${target?.name || id}`);
  };

  const addMsme = (msmeData: Omit<MSMETourism, 'id'>) => {
    const newMsme: MSMETourism = {
      id: `msme-${Date.now()}`,
      ...msmeData,
    };
    setMsmes((prev) => [newMsme, ...prev]);
    addAuditLog('CREATE', 'MSME Tourism Database', `Enrolled MSME ${newMsme.name}`);
  };

  const updateMsme = (id: string, updated: Partial<MSMETourism>) => {
    setMsmes((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
    addAuditLog('UPDATE', 'MSME Tourism Database', `Modified MSME record ${id}`);
  };

  const deleteMsme = (id: string) => {
    setMsmes((prev) => prev.filter((m) => m.id !== id));
    addAuditLog('DELETE', 'MSME Tourism Database', `Removed MSME ${id}`);
  };

  const addDestination = (destData: Omit<TourismDestination, 'id'>) => {
    const newDest: TourismDestination = {
      id: `dest-${Date.now()}`,
      ...destData,
    };
    setDestinations((prev) => [newDest, ...prev]);
    addAuditLog('CREATE', 'Tourism Destination Database', `Added tourism attraction ${newDest.siteName}`);
  };

  const updateDestination = (id: string, updated: Partial<TourismDestination>) => {
    setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
    addAuditLog('UPDATE', 'Tourism Destination Database', `Updated destination ${id}`);
  };

  const deleteDestination = (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('DELETE', 'Tourism Destination Database', `Removed destination ${id}`);
  };

  const addEvent = (evData: Omit<TourismEvent, 'id'>) => {
    const newEvent: TourismEvent = {
      id: `ev-${Date.now()}`,
      ...evData,
    };
    setEvents((prev) => [newEvent, ...prev]);
    addAuditLog('CREATE', 'Events Management System', `Created event ${newEvent.eventName}`);
  };

  const updateEvent = (id: string, updated: Partial<TourismEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    addAuditLog('UPDATE', 'Events Management System', `Updated event details ${id}`);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('DELETE', 'Events Management System', `Deleted event ${id}`);
  };

  // Personnel & Inventory
  const addEmployee = (empData: Omit<EmployeeRecord, 'id'>) => {
    const newEmp: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      ...empData,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    addAuditLog('CREATE', 'Administrative & Finance', `Added employee record for ${newEmp.name}`);
  };

  const updateEmployee = (id: string, updated: Partial<EmployeeRecord>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    addAuditLog('UPDATE', 'Administrative & Finance', `Updated employee ${id}`);
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('DELETE', 'Administrative & Finance', `Removed employee ${id}`);
  };

  const addInventoryItem = (itemData: Omit<OfficeInventoryItem, 'id'>) => {
    const newItem: OfficeInventoryItem = {
      id: `inv-${Date.now()}`,
      ...itemData,
    };
    setInventory((prev) => [newItem, ...prev]);
    addAuditLog('CREATE', 'Office Inventory', `Registered property item ${newItem.propertyNumber}`);
  };

  const updateInventoryItem = (id: string, updated: Partial<OfficeInventoryItem>) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
    addAuditLog('UPDATE', 'Office Inventory', `Updated item ${id}`);
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('DELETE', 'Office Inventory', `Archived inventory item ${id}`);
  };

  const updateFinancial = (updated: Partial<FinancialMonitoringRecord>) => {
    setFinancial((prev) => {
      const next = { ...prev, ...updated };
      if (next.annualBudget > 0) {
        next.fundUtilizationRate = Math.round((next.obligations / next.annualBudget) * 1000) / 10;
      }
      return next;
    });
    addAuditLog('UPDATE', 'Financial Monitoring', `Updated municipal tourism budget and obligations metrics`);
  };

  // Research & Policies
  const addResearch = (resData: Omit<TourismResearch, 'id'>) => {
    const newRes: TourismResearch = { id: `res-${Date.now()}`, ...resData };
    setResearch((prev) => [newRes, ...prev]);
    addAuditLog('CREATE', 'Research & Planning', `Uploaded tourism study: ${newRes.title}`);
  };

  const updateResearch = (id: string, updated: Partial<TourismResearch>) => {
    setResearch((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
    addAuditLog('UPDATE', 'Research & Planning', `Updated research study ${id}`);
  };

  const deleteResearch = (id: string) => {
    setResearch((prev) => prev.filter((r) => r.id !== id));
    addAuditLog('DELETE', 'Research & Planning', `Deleted research study ${id}`);
  };

  const addPolicy = (polData: Omit<TourismPolicy, 'id'>) => {
    const newPol: TourismPolicy = { id: `pol-${Date.now()}`, ...polData };
    setPolicies((prev) => [newPol, ...prev]);
    addAuditLog('CREATE', 'Policy Support & Regulation', `Registered policy: ${newPol.referenceNumber}`);
  };

  const updatePolicy = (id: string, updated: Partial<TourismPolicy>) => {
    setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    addAuditLog('UPDATE', 'Policy Support & Regulation', `Updated policy: ${id}`);
  };

  const deletePolicy = (id: string) => {
    setPolicies((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE', 'Policy Support & Regulation', `Removed policy: ${id}`);
  };

  const addNotice = (notData: Omit<NoticeOfViolation, 'id'>) => {
    const newNot: NoticeOfViolation = { id: `nov-${Date.now()}`, ...notData };
    setNotices((prev) => [newNot, ...prev]);
    addAuditLog('CREATE', 'Policy Support & Regulation', `Issued notice of violation to ${newNot.establishmentName}`);
  };

  const updateNotice = (id: string, updated: Partial<NoticeOfViolation>) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
    addAuditLog('UPDATE', 'Policy Support & Regulation', `Updated notice: ${id}`);
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    addAuditLog('DELETE', 'Policy Support & Regulation', `Deleted notice: ${id}`);
  };

  const resolveNotice = (id: string) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'Resolved & Cleared' } : n)));
    addAuditLog('RESOLVE', 'Policy Support & Regulation', `Resolved notice of violation ${id}`);
  };

  const addComplaint = (compData: Omit<TouristComplaint, 'id'>) => {
    const newComp: TouristComplaint = { id: `comp-${Date.now()}`, ...compData };
    setComplaints((prev) => [newComp, ...prev]);
    addAuditLog('CREATE', 'Policy Support & Regulation', `Logged tourist complaint ${newComp.trackingNumber}`);
  };

  const updateComplaintStatus = (id: string, status: TouristComplaint['status'], resolutionNotes?: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, resolutionNotes: resolutionNotes || c.resolutionNotes } : c))
    );
    addAuditLog('RESOLVE', 'Policy Support & Regulation', `Updated complaint ${id} status to ${status}`);
  };

  const updateComplaint = (id: string, data: Partial<TouristComplaint>) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    addAuditLog('UPDATE', 'Policy Support & Regulation', `Updated complaint ${id}`);
  };

  const deleteComplaint = (id: string) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DELETE', 'Policy Support & Regulation', `Deleted complaint: ${id}`);
  };

  // Products, Marketing, Social
  const addProduct = (prodData: Omit<TourismProduct, 'id'>) => {
    const newProd: TourismProduct = { id: `prod-${Date.now()}`, ...prodData };
    setProducts((prev) => [newProd, ...prev]);
    addAuditLog('CREATE', 'Tourism Product Development', `Added product concept ${newProd.productName}`);
  };

  const updateProduct = (id: string, data: Partial<TourismProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    addAuditLog('UPDATE', 'Tourism Product Development', `Updated tourism product: ${id}`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE', 'Tourism Product Development', `Deleted tourism product: ${id}`);
  };

  const addCapacityTraining = (tData: Omit<CapacityBuildingTraining, 'id'>) => {
    const newT: CapacityBuildingTraining = { id: `cbt-${Date.now()}`, ...tData };
    setCapacityTrainings((prev) => [newT, ...prev]);
    addAuditLog('CREATE', 'Tourism Product Development', `Added capacity building training: ${newT.title}`);
  };

  const updateCapacityTraining = (id: string, data: Partial<CapacityBuildingTraining>) => {
    setCapacityTrainings((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    addAuditLog('UPDATE', 'Tourism Product Development', `Updated capacity training: ${id}`);
  };

  const deleteCapacityTraining = (id: string) => {
    setCapacityTrainings((prev) => prev.filter((t) => t.id !== id));
    addAuditLog('DELETE', 'Tourism Product Development', `Deleted capacity training: ${id}`);
  };

  const addInvestmentOpportunity = (oppData: Omit<TourismInvestmentOpportunity, 'id'>) => {
    const newOpp: TourismInvestmentOpportunity = { id: `inv-${Date.now()}`, ...oppData };
    setInvestmentOpportunities((prev) => [newOpp, ...prev]);
    addAuditLog('CREATE', 'Tourism Product Development', `Added investment opportunity: ${newOpp.projectTitle}`);
  };

  const updateInvestmentOpportunity = (id: string, data: Partial<TourismInvestmentOpportunity>) => {
    setInvestmentOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
    addAuditLog('UPDATE', 'Tourism Product Development', `Updated investment opportunity: ${id}`);
  };

  const deleteInvestmentOpportunity = (id: string) => {
    setInvestmentOpportunities((prev) => prev.filter((o) => o.id !== id));
    addAuditLog('DELETE', 'Tourism Product Development', `Deleted investment opportunity: ${id}`);
  };

  const addCampaign = (campData: Omit<MarketingCampaign, 'id'>) => {
    const newCamp: MarketingCampaign = { id: `mkt-${Date.now()}`, ...campData };
    setCampaigns((prev) => [newCamp, ...prev]);
    addAuditLog('CREATE', 'Promotion & Marketing', `Launched campaign: ${newCamp.campaignTitle}`);
  };

  const updateCampaign = (id: string, data: Partial<MarketingCampaign>) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    addAuditLog('UPDATE', 'Promotion & Marketing', `Updated marketing campaign: ${id}`);
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DELETE', 'Promotion & Marketing', `Deleted marketing campaign: ${id}`);
  };

  const addCollateral = (itemData: Omit<MarketingCollateralItem, 'id'>) => {
    const newItem: MarketingCollateralItem = { id: `col-${Date.now()}`, ...itemData };
    setMarketingCollaterals((prev) => [newItem, ...prev]);
    addAuditLog('CREATE', 'Promotion & Marketing', `Registered collateral: ${newItem.title}`);
  };

  const updateCollateral = (id: string, data: Partial<MarketingCollateralItem>) => {
    setMarketingCollaterals((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
    addAuditLog('UPDATE', 'Promotion & Marketing', `Updated collateral: ${id}`);
  };

  const deleteCollateral = (id: string) => {
    setMarketingCollaterals((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('DELETE', 'Promotion & Marketing', `Deleted collateral: ${id}`);
  };

  const addPartner = (partnerData: Omit<MarketingPartner, 'id'>) => {
    const newPartner: MarketingPartner = { id: `part-${Date.now()}`, ...partnerData };
    setMarketingPartners((prev) => [newPartner, ...prev]);
    addAuditLog('CREATE', 'Promotion & Marketing', `Enrolled partner: ${newPartner.name}`);
  };

  const updatePartner = (id: string, data: Partial<MarketingPartner>) => {
    setMarketingPartners((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    addAuditLog('UPDATE', 'Promotion & Marketing', `Updated partner: ${id}`);
  };

  const deletePartner = (id: string) => {
    setMarketingPartners((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE', 'Promotion & Marketing', `Deleted partner: ${id}`);
  };

  const updatePlatformStat = (platform: string, data: Partial<SocialMediaPlatformStat>) => {
    setSocialMetrics((prev) => prev.map((s) => (s.platform === platform ? { ...s, ...data } : s)));
    addAuditLog('UPDATE', 'Social Media Management', `Updated monthly metrics for ${platform}`);
  };

  const addTopPost = (postData: Omit<TopSocialPost, 'id'>) => {
    const newPost: TopSocialPost = { id: `tp-${Date.now()}`, ...postData };
    setTopPosts((prev) => [newPost, ...prev]);
    addAuditLog('CREATE', 'Social Media Management', `Added top performing post: ${newPost.title}`);
  };

  const deleteTopPost = (id: string) => {
    setTopPosts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE', 'Social Media Management', `Deleted top post record: ${id}`);
  };

  const addScheduledPost = (postData: Omit<ScheduledPost, 'id'>) => {
    const newPost: ScheduledPost = { id: `sp-${Date.now()}`, ...postData };
    setScheduledPosts((prev) => [newPost, ...prev]);
    addAuditLog('CREATE', 'Social Media Management', `Scheduled ${newPost.platform} post: ${newPost.title}`);
  };

  const updateScheduledPost = (id: string, data: Partial<ScheduledPost>) => {
    setScheduledPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    addAuditLog('UPDATE', 'Social Media Management', `Updated scheduled post: ${id}`);
  };

  const deleteScheduledPost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE', 'Social Media Management', `Deleted scheduled post: ${id}`);
  };

  const publishScheduledPost = (id: string) => {
    setScheduledPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Published' as const } : p))
    );
    addAuditLog('UPDATE', 'Social Media Management', `Marked post ${id} as Published to live feed`);
  };

  const addSocialCampaign = (campData: Omit<SocialCampaignMetric, 'id'>) => {
    const newCamp: SocialCampaignMetric = { id: `sc-${Date.now()}`, ...campData };
    setSocialCampaigns((prev) => [newCamp, ...prev]);
    addAuditLog('CREATE', 'Social Media Management', `Added social campaign tracker: ${newCamp.campaignName}`);
  };

  const deleteSocialCampaign = (id: string) => {
    setSocialCampaigns((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DELETE', 'Social Media Management', `Deleted social campaign tracker: ${id}`);
  };

  // TIAC & Lost and Found
  const addTiacLog = (logData: Omit<VisitorAssistanceLog, 'id'>) => {
    const newLog: VisitorAssistanceLog = { id: `tiac-${Date.now()}`, ...logData };
    setTiacLogs((prev) => [newLog, ...prev]);
    addAuditLog('CREATE', 'TIAC Assistance', `Logged visitor assistance for ${newLog.visitorName}`);
  };

  const updateTiacLog = (id: string, data: Partial<VisitorAssistanceLog>) => {
    setTiacLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
    addAuditLog('UPDATE', 'TIAC Assistance', `Updated visitor assistance record: ${id}`);
  };

  const deleteTiacLog = (id: string) => {
    setTiacLogs((prev) => prev.filter((l) => l.id !== id));
    addAuditLog('DELETE', 'TIAC Assistance', `Deleted visitor assistance record: ${id}`);
  };

  const addLostItem = (itemData: Omit<LostAndFoundItem, 'id'>) => {
    const newItem: LostAndFoundItem = { id: `lf-${Date.now()}`, ...itemData };
    setLostAndFound((prev) => [newItem, ...prev]);
    addAuditLog('CREATE', 'TIAC Lost & Found', `Recorded lost item: ${newItem.itemDescription}`);
  };

  const claimLostItem = (id: string, claimantName: string) => {
    setLostAndFound((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Claimed by Owner',
              claimantName,
              dateClaimed: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : item
      )
    );
    addAuditLog('RESOLVE', 'TIAC Lost & Found', `Released item ${id} to verified owner ${claimantName}`);
  };

  const deleteLostItem = (id: string) => {
    setLostAndFound((prev) => prev.filter((item) => item.id !== id));
    addAuditLog('DELETE', 'TIAC Lost & Found', `Deleted lost & found record: ${id}`);
  };

  const addEmergencyLog = (logData: Omit<EmergencyCaseLog, 'id'>) => {
    const newLog: EmergencyCaseLog = { id: `emg-${Date.now()}`, ...logData };
    setEmergencyLogs((prev) => [newLog, ...prev]);
    addAuditLog('CREATE', 'TIAC Emergency Coordination', `Logged emergency dispatch: ${newLog.incidentNumber} (${newLog.incidentType})`);
  };

  const updateEmergencyLog = (id: string, data: Partial<EmergencyCaseLog>) => {
    setEmergencyLogs((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    addAuditLog('UPDATE', 'TIAC Emergency Coordination', `Updated emergency case status: ${id}`);
  };

  const addTouristFeedback = (feedbackData: Omit<TouristFeedbackEntry, 'id'>) => {
    const newFeedback: TouristFeedbackEntry = { id: `fb-${Date.now()}`, ...feedbackData };
    setTouristFeedback((prev) => [newFeedback, ...prev]);
    addAuditLog('CREATE', 'TIAC Feedback & CSAT', `Logged tourist feedback from ${newFeedback.visitorName}`);
  };

  const addFAQ = (faqData: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = { id: `faq-${Date.now()}`, ...faqData };
    setFaqs((prev) => [newFaq, ...prev]);
    addAuditLog('CREATE', 'TIAC Knowledge Base', `Added FAQ item: ${newFaq.question}`);
  };

  // Documents
  const addDocument = (docData: Omit<OfficialDocument, 'id'>) => {
    const newDoc: OfficialDocument = { id: `doc-${Date.now()}`, ...docData };
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('CREATE', 'Document Management System', `Archived official document ${newDoc.controlNumber}`);
  };

  const updateDocument = (id: string, data: Partial<OfficialDocument>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
    addAuditLog('UPDATE', 'Document Management System', `Updated official document ${id}`);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('DELETE', 'Document Management System', `Removed document record ${id}`);
  };

  // Notifications
  const sendNotification = (type: 'SMS' | 'Email', recipient: string, subject: string, message: string) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      type,
      recipient,
      subject,
      message,
      sentAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('CREATE', 'SMS & Email Notification Service', `Sent ${type} alert to ${recipient}`);
  };

  // Backup & Restore
  const exportBackupJson = (): string => {
    const payload = {
      timestamp: new Date().toISOString(),
      municipality: MUNICIPALITY_INFO.name,
      version: '1.0.0',
      data: {
        tourists,
        establishments,
        msmes,
        destinations,
        events,
        employees,
        inventory,
        financial,
        research,
        policies,
        notices,
        complaints,
        products,
        capacityTrainings,
        investmentOpportunities,
        campaigns,
        marketingCollaterals,
        marketingPartners,
        socialMetrics,
        topPosts,
        scheduledPosts,
        socialCampaigns,
        tiacLogs,
        lostAndFound,
        emergencyLogs,
        touristFeedback,
        faqs,
        documents,
        auditLogs,
      },
    };
    addAuditLog('EXPORT', 'Database Management', 'Exported complete MTODMS system backup archive');
    return JSON.stringify(payload, null, 2);
  };

  const importBackupJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.data) return false;
      const d = parsed.data;
      if (d.tourists) setTourists(d.tourists);
      if (d.establishments) setEstablishments(d.establishments);
      if (d.msmes) setMsmes(d.msmes);
      if (d.destinations) setDestinations(d.destinations);
      if (d.events) setEvents(d.events);
      if (d.employees) setEmployees(d.employees);
      if (d.inventory) setInventory(d.inventory);
      if (d.financial) setFinancial(d.financial);
      if (d.research) setResearch(d.research);
      if (d.policies) setPolicies(d.policies);
      if (d.notices) setNotices(d.notices);
      if (d.complaints) setComplaints(d.complaints);
      if (d.products) setProducts(d.products);
      if (d.capacityTrainings) setCapacityTrainings(d.capacityTrainings);
      if (d.investmentOpportunities) setInvestmentOpportunities(d.investmentOpportunities);
      if (d.campaigns) setCampaigns(d.campaigns);
      if (d.marketingCollaterals) setMarketingCollaterals(d.marketingCollaterals);
      if (d.marketingPartners) setMarketingPartners(d.marketingPartners);
      if (d.socialMetrics) setSocialMetrics(d.socialMetrics);
      if (d.topPosts) setTopPosts(d.topPosts);
      if (d.scheduledPosts) setScheduledPosts(d.scheduledPosts);
      if (d.socialCampaigns) setSocialCampaigns(d.socialCampaigns);
      if (d.tiacLogs) setTiacLogs(d.tiacLogs);
      if (d.lostAndFound) setLostAndFound(d.lostAndFound);
      if (d.emergencyLogs) setEmergencyLogs(d.emergencyLogs);
      if (d.touristFeedback) setTouristFeedback(d.touristFeedback);
      if (d.faqs) setFaqs(d.faqs);
      if (d.documents) setDocuments(d.documents);
      addAuditLog('UPDATE', 'Database Management', 'Successfully restored database from uploaded backup file');
      return true;
    } catch {
      return false;
    }
  };

  const resetToDefaultData = () => {
    setTourists(INITIAL_TOURISTS);
    setEstablishments(INITIAL_ESTABLISHMENTS);
    setMsmes(INITIAL_MSMES);
    setDestinations(INITIAL_DESTINATIONS);
    setEvents(INITIAL_EVENTS);
    setEmployees(INITIAL_EMPLOYEES);
    setInventory(INITIAL_INVENTORY);
    setFinancial(INITIAL_FINANCIAL);
    setResearch(INITIAL_RESEARCH);
    setPolicies(INITIAL_POLICIES);
    setNotices(INITIAL_NOTICES);
    setComplaints(INITIAL_COMPLAINTS);
    setProducts(INITIAL_PRODUCTS);
    setCapacityTrainings(INITIAL_CAPACITY_TRAININGS);
    setInvestmentOpportunities(INITIAL_INVESTMENT_OPPORTUNITIES);
    setCampaigns(INITIAL_CAMPAIGNS);
    setMarketingCollaterals(INITIAL_COLLATERALS);
    setMarketingPartners(INITIAL_MARKETING_PARTNERS);
    setSocialMetrics(INITIAL_SOCIAL_METRICS);
    setTopPosts(INITIAL_TOP_POSTS);
    setScheduledPosts(INITIAL_SCHEDULED_POSTS);
    setSocialCampaigns(INITIAL_SOCIAL_CAMPAIGNS);
    setTiacLogs(INITIAL_TIAC_LOGS);
    setLostAndFound(INITIAL_LOST_AND_FOUND);
    setEmergencyLogs(INITIAL_EMERGENCY_LOGS);
    setTouristFeedback(INITIAL_TOURIST_FEEDBACK);
    setFaqs(INITIAL_FAQS);
    setDocuments(INITIAL_DOCUMENTS);
    addAuditLog('UPDATE', 'Database Management', 'Reset system state to official baseline seed data');
  };

  return (
    <TourismContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users: INITIAL_USERS,
        canAccess,
        isReadOnly,
        activeModule,
        setActiveModule,
        currentModule: activeModule,
        setCurrentModule: setActiveModule,
        municipalityInfo: MUNICIPALITY_INFO,
        tourists,
        addTourist,
        updateTourist,
        deleteTourist,
        establishments,
        addEstablishment,
        updateEstablishment,
        deleteEstablishment,
        msmes,
        addMsme,
        updateMsme,
        deleteMsme,
        destinations,
        addDestination,
        updateDestination,
        deleteDestination,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
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
        research,
        addResearch,
        updateResearch,
        deleteResearch,
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
        updateComplaint,
        deleteComplaint,
        feedbacks: touristFeedback,
        addFeedback: addTouristFeedback,
        updateFeedbackStatus: (id: string, status: string) => {
          setTouristFeedback((prev) => prev.map((f) => f.id === id ? { ...f, status } as any : f));
        },
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        capacityTrainings,
        addCapacityTraining,
        updateCapacityTraining,
        deleteCapacityTraining,
        investmentOpportunities,
        addInvestmentOpportunity,
        updateInvestmentOpportunity,
        deleteInvestmentOpportunity,
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        marketingCollaterals,
        addCollateral,
        updateCollateral,
        deleteCollateral,
        marketingPartners,
        addPartner,
        updatePartner,
        deletePartner,
        socialMetrics,
        updatePlatformStat,
        topPosts,
        addTopPost,
        deleteTopPost,
        scheduledPosts,
        addScheduledPost,
        updateScheduledPost,
        deleteScheduledPost,
        publishScheduledPost,
        socialCampaigns,
        addSocialCampaign,
        deleteSocialCampaign,
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
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        auditLogs,
        addAuditLog,
        notifications,
        sendNotification,
        exportBackupJson,
        importBackupJson,
        resetToDefaultData,
      }}
    >
      {children}
    </TourismContext.Provider>
  );
};

export const useTourism = (): TourismContextType => {
  const context = useContext(TourismContext);
  if (!context) {
    throw new Error('useTourism must be used within a TourismProvider');
  }
  return context;
};
