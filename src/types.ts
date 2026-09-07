export type UserRole =
  | 'System Administrator'
  | 'Municipal Tourism Officer'
  | 'Administrative and Finance Personnel'
  | 'Research and Planning Personnel'
  | 'Policy Support and Regulation Personnel'
  | 'Product Development Personnel'
  | 'Promotion and Marketing Personnel'
  | 'Social Media Manager'
  | 'Tourism Information Officer'
  | 'Data Encoder'
  | 'Guest/User';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
}

export type ModuleKey =
  | 'dashboard'
  | 'tourists'
  | 'establishments'
  | 'msmes'
  | 'destinations'
  | 'events'
  | 'admin_finance'
  | 'research_planning'
  | 'policy_regulation'
  | 'product_dev'
  | 'marketing'
  | 'social_media'
  | 'tiac'
  | 'documents'
  | 'reports';

export interface TouristArrival {
  id: string;
  touristId: string;
  dateOfVisit: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  address: string;
  nationality: string;
  isForeign: boolean;
  contactNumber: string;
  emailAddress: string;
  occupation: string;
  purposeOfVisit: 'Leisure / Vacation' | 'Business / MICE' | 'Eco-Adventure' | 'Cultural / Heritage' | 'Visiting Friends & Relatives' | 'Education / Research';
  destinationVisited: string;
  accommodationUsed: string;
  numberOfDaysStayed: number;
  transportationUsed: 'Private Vehicle' | 'Public Bus' | 'Van / UV Express' | 'Motorcycle / Habal-habal' | 'Rental Car' | 'Tourist Van';
  touristSpending: number; // in PHP
  travelCompanion: 'Solo' | 'Family' | 'Friends / Group' | 'Couple' | 'Corporate / Delegation';
  companionsCount: number;
  feedbackRating: number; // 1-5
  feedbackComments: string;
  recordedBy: string;
}

export type EstablishmentCategory =
  | 'Resorts'
  | 'Hotels'
  | 'Homestays'
  | 'Restaurants'
  | 'Cafés'
  | 'Souvenir Shops'
  | 'Adventure Sites'
  | 'Eco Parks'
  | 'Campsites'
  | 'Farm Tourism'
  | 'Event Venues';

export type DOTAccreditationStatus = 'Accredited' | 'Application Pending' | 'Expired / For Renewal' | 'Under Inspection' | 'Not Accredited';

export interface InspectionRecord {
  id: string;
  date: string;
  inspector: string;
  rating: number;
  findings: string;
  status: 'Passed' | 'Conditional Pass' | 'Failed / Action Needed';
}

export interface TourismEstablishment {
  id: string;
  name: string;
  owner: string;
  category: EstablishmentCategory;
  address: string;
  barangay: string;
  contactNumber: string;
  email: string;
  businessPermitNumber: string;
  dotAccreditationStatus: DOTAccreditationStatus;
  dotAccreditationNumber?: string;
  numberOfEmployees: number;
  investmentCost: number; // PHP
  annualRevenue: number; // PHP
  environmentalCompliance: 'Compliant (ECC/CNC Issued)' | 'Pending Verification' | 'Non-Compliant';
  safetyCompliance: 'Fire & Safety Certified' | 'Pending Inspection' | 'Expired';
  insuranceCoverage: 'Comprehensive Public Liability' | 'Basic' | 'None';
  businessStatus: 'Active & Operating' | 'Temporary Closed' | 'Under Renovation' | 'Suspended';
  inspectionHistory: InspectionRecord[];
  renewalSchedule: string;
  photoUrl: string;
}

export interface MSMETourism {
  id: string;
  name: string;
  owner: string;
  productCategory: 'Handicrafts & Weaving' | 'Processed Food & Delicacies' | 'Coffee & Cacao' | 'Souvenirs & Apparel' | 'Organic Agri-products' | 'Indigenous Arts';
  localProducts: string;
  productionCapacity: string;
  marketLocation: string;
  registrationStatus: 'Fully Registered' | 'DTI Only' | 'In Progress';
  dtiRegistration: string;
  birRegistration: string;
  barangay: string;
  contactInformation: string;
  trainingsAttended: string[];
  financialAssistanceReceived: string;
  productPhotos: string[];
  inventoryCount: number;
  averagePrice: number;
}

export type DestinationClassification = 'Natural / Eco-tourism' | 'Cultural & Heritage' | 'Adventure & Sports' | 'Agri-tourism / Farm' | 'Recreational / Leisure';

export interface TourismDestination {
  id: string;
  siteName: string;
  barangay: string;
  gpsCoordinates: string; // e.g. "6.2234° N, 125.2812° E"
  lat: number;
  lng: number;
  elevation: string;
  accessibility: 'All vehicles' | '4x4 Only / Mountain Road' | 'Trek / Walking Only' | 'Water Transport';
  distanceFromMunicipalHallKm: number;
  travelTimeMinutes: number;
  classification: DestinationClassification;
  attractions: string[];
  facilitiesAvailable: string[];
  safetyEquipment: string[];
  tourismActivities: string[];
  carryingCapacityDaily: number;
  currentVisitorsToday: number;
  entranceFee: number;
  contactPerson: string;
  contactNumber: string;
  status: 'Open / Normal Operations' | 'Regulated / Controlled' | 'Weather Advisory / Restricted' | 'Closed for Rehabilitation';
  photos: string[];
  droneImagesCount: number;
  hasGisMap: boolean;
}

export interface TourismEvent {
  id: string;
  eventName: string;
  date: string;
  endDate?: string;
  venue: string;
  organizer: string;
  budget: number;
  actualExpense: number;
  participantsExpected: number;
  attendanceActual: number;
  sponsors: string[];
  guests: string[];
  performers: string[];
  programFlow: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  evaluationRating: number;
  documentationUrls: string[];
  financialReportStatus: 'Approved & Liquidated' | 'Under Audit' | 'Pending Submission';
}

// Administrative and Finance Section
export interface EmployeeRecord {
  id: string;
  employeeNumber: string;
  name: string;
  appointment: 'Permanent' | 'Casual' | 'Job Order (JO)' | 'Contract of Service' | 'Co-terminus';
  position: string;
  employmentStatus: 'Active' | 'On Official Leave' | 'On Field Duty';
  leaveCredits: number;
  dailyTimeRecordHoursThisMonth: number;
  performanceEvaluationRating: string; // e.g., 'Outstanding (4.8/5)'
  trainings: string[];
  designation: string;
  serviceRecordYears: number;
  email: string;
  contact: string;
}

export interface OfficeInventoryItem {
  id: string;
  propertyNumber: string;
  itemName: string;
  category: 'Office Equipment' | 'Furniture & Fixture' | 'ICT Equipment' | 'Vehicle Inventory' | 'Office Supplies';
  condition: 'Serviceable' | 'Needs Minor Repair' | 'Unserviceable / For Disposal';
  acquisitionDate: string;
  acquisitionCost: number;
  assignedTo: string;
  location: string;
  disposalRecord?: string;
}

export interface FinancialMonitoringRecord {
  id: string;
  fiscalYear: number;
  annualBudget: number;
  obligations: number;
  disbursement: number;
  fundUtilizationRate: number; // calculated %
  purchaseRequestsCount: number;
  purchaseOrdersCount: number;
  cashAdvancesTotal: number;
  liquidationRate: number; // %
  annualProcurementPlanStatus: 'Approved by BAC' | 'Under Review' | 'Submitted to GPPB';
  recentTransactions: {
    id: string;
    date: string;
    description: string;
    type: 'PR' | 'PO' | 'Disbursement' | 'Liquidation';
    amount: number;
    status: 'Approved' | 'Processing' | 'Pending';
  }[];
}

// Research and Planning
export interface TourismResearch {
  id: string;
  title: string;
  leadResearcher: string;
  year: number;
  category: 'Visitor Survey' | 'Economic Impact Assessment' | 'Carrying Capacity Study' | 'Master Plan' | 'SWOT Analysis';
  keyFindings: string;
  fileUrl: string;
  status: 'Adopted by LGU' | 'Published' | 'Under Review';
}

// Policy Support and Regulation
export interface TourismPolicy {
  id: string;
  referenceNumber: string; // e.g. "SB Ordinance No. 2024-012"
  title: string;
  type: 'Municipal Ordinance' | 'Executive Order' | 'Tourism Code Section' | 'Administrative Memo';
  dateApproved: string;
  status: 'Enforced' | 'Under Amendment' | 'Proposed';
  summary: string;
  penalties: string;
  complianceRate: string;
}

export interface NoticeOfViolation {
  id: string;
  establishmentName: string;
  violationDate: string;
  violationDetails: string;
  ordinanceViolated: string;
  correctiveActionRequired: string;
  deadline: string;
  status: 'Pending Corrective Action' | 'Resolved & Cleared' | 'Escalated to Legal';
  docketNumber?: string;
  barangay?: string;
  inspectingOfficer?: string;
  fineAmount?: number;
}

export interface TouristComplaint {
  id: string;
  trackingNumber: string;
  complainant: string;
  dateFiled: string;
  targetEntity: string;
  category: 'Overpricing / Unofficial Fee' | 'Safety / Sanitation' | 'Service Quality' | 'False Advertising' | 'Environmental Concern';
  description: string;
  status: 'Received' | 'Investigation On-going' | 'Mediation Scheduled' | 'Resolved / Closed';
  resolutionNotes?: string;
  contactNumber?: string;
  entityType?: string;
  urgency?: string;
  barangay?: string;
  email?: string;
  actionTaken?: string;
  assignedOfficer?: string;
  resolutionDate?: string;
  slaStatus?: string;
}

export type TouristFeedback = TouristFeedbackEntry;

// Tourism Product Development
export type TourismCluster = 'Cultural Tourism' | 'Eco-tourism' | 'Agri-tourism' | 'Adventure Tourism';
export type ProductLifecycleStage = 'Introduction' | 'Growth' | 'Maturity' | 'Decline / Revitalization';
export type ProductDevelopmentStatus = 'Concept / Ideation' | 'Feasibility Study' | 'Infrastructure / Site Development' | 'Pilot Testing / Trial Run' | 'Commercial Operations';

export interface TourismProduct {
  id: string;
  productName: string;
  cluster: TourismCluster;
  productType?: 'Existing' | 'Proposed';
  lifecycle?: ProductLifecycleStage;
  developmentStatus?: ProductDevelopmentStatus;
  stage: 'Conceptual Phase' | 'Feasibility / Pilot' | 'Market-Ready' | 'Established';
  targetMarket: string;
  communityStakeholders: string;
  barangay?: string;
  leadOrganization?: string;
  investmentRequired: number;
  capacityBuildingConducted: string[];
  evaluationScore: number; // 0-100 (Product Readiness Index)
  readinessStatus: 'Ready for Promotion' | 'Requires Facility Upgrades' | 'Under Community Validation';
  keyFeatures?: string[];
  lastEvaluatedDate?: string;
}

export interface CapacityBuildingTraining {
  id: string;
  title: string;
  cluster: TourismCluster | 'Cross-Cutting';
  targetBeneficiaries: string;
  partnerAgency: string; // e.g. "DOT Region XII", "TESDA", "NCIP", "DTI"
  dateConducted: string;
  durationHours: number;
  venue: string;
  participantsCount: number;
  femaleParticipants: number;
  ipParticipants: number;
  certifiedCount: number;
  status: 'Completed' | 'Ongoing' | 'Scheduled';
}

export interface TourismInvestmentOpportunity {
  id: string;
  projectTitle: string;
  cluster: TourismCluster;
  barangay: string;
  estimatedCapital: number;
  businessModel: 'Public-Private Partnership (PPP)' | 'LGU-Community Cooperative' | 'Joint Venture' | 'Private Concession';
  projectedPaybackYears: number;
  lguIncentives: string;
  briefDescription: string;
  readiness: 'Bankable / Investment-Ready' | 'Feasibility Underway' | 'Concept Pipeline';
  targetInvestor: string;
}

// Promotion and Marketing
export interface MarketingCampaign {
  id: string;
  campaignTitle: string;
  type: 'Promotional Campaign' | 'Tourism Video' | 'Brochures / Collateral' | 'Travel Fair / Expo' | 'Digital Poster' | 'Influencer Fam Tour';
  targetAudience: string;
  startDate: string;
  endDate: string;
  budget: number;
  actualExpenses?: number;
  channels: string[];
  leadPartner: string;
  status: 'Active' | 'Completed' | 'In Production';
  deliverablesSummary: string;
  keyDeliverables?: string[];
  viewsOrReach: number;
  roiLeadsGenerated?: number;
  campaignManager?: string;
}

export type CollateralCategory = 'Tourism Video' | 'Brochure' | 'Flyer' | 'Tarpaulin / Billboard' | 'Digital Poster';

export interface MarketingCollateralItem {
  id: string;
  title: string;
  category: CollateralCategory;
  targetAudience: string;
  fileFormat: string;
  dimensionsOrDuration: string;
  quantityOrCopies: number;
  storageLocationOrUrl: string;
  dateProduced: string;
  status: 'In Distribution' | 'Archived' | 'In Production';
}

export interface MarketingPartner {
  id: string;
  name: string;
  type: 'Travel Fair / Expo' | 'Media Partner' | 'Tourism Influencer' | 'Industry Association';
  contactPerson: string;
  contactDetails: string;
  reachAudience: string;
  collaborationScope: string;
  status: 'Active Partner' | 'Past Collaboration' | 'Prospective';
}

// Social Media Management
export interface SocialMediaPlatformStat {
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube';
  followers: number;
  monthlyReach: number;
  monthlyEngagement: number;
  shares: number;
  reactions: number;
  comments: number;
  postsPublished: number;
  avgEngagementRate: number;
  growthRatePercent: number;
  videoViews?: number;
  topPostTitle: string;
  topPostEngagement: string;
}

export interface ScheduledPost {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube';
  title: string;
  scheduledTime: string;
  campaignTag: string;
  status: 'Scheduled' | 'Published' | 'Draft';
  postType?: 'Video / Reel' | 'Photo Carousel' | 'Story' | 'Infographic / Advisory' | 'Text / Article';
  captionSnippet?: string;
  creator?: string;
  targetAudience?: string;
  mediaUrl?: string;
  hashtags?: string[];
}

export interface TopSocialPost {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube';
  title: string;
  postType: 'Video / Reel' | 'Photo Carousel' | 'Live Stream' | 'Infographic / Advisory' | 'Text / Article';
  publishDate: string;
  campaignTag: string;
  impressionsReach: number;
  reactions: number;
  comments: number;
  shares: number;
  engagementRate: number;
  permalink?: string;
  captionExcerpt: string;
  sentimentRating: string;
  keyHighlight: string;
}

export interface SocialCampaignMetric {
  id: string;
  campaignName: string;
  hashtags: string;
  channels: ('Facebook' | 'Instagram' | 'TikTok' | 'YouTube')[];
  totalReach: number;
  totalEngagements: number;
  totalShares: number;
  ugcCount: number;
  influencerPartners: string;
  inquiriesGenerated: number;
  status: 'Active' | 'Completed' | 'Upcoming';
  dateRange: string;
}

// TIAC (Tourism Information and Assistance Center)
export interface VisitorAssistanceLog {
  id: string;
  timestamp: string;
  visitorName: string;
  contact: string;
  visitorOrigin?: string;
  groupSize?: number;
  inquiryChannel?: 'Walk-in Desk' | 'Phone Hotline' | 'Email' | 'Social Media' | 'Tourism Booth';
  assistanceType: 'Walk-in Inquiries' | 'Online / Telephone Inquiry' | 'Lost & Found' | 'Emergency Assistance' | 'Referral / Guide Booking' | 'Feedback / Survey' | 'Information Requests';
  destinationInterest?: string;
  details: string;
  actionTaken: string;
  officerInCharge: string;
  status: 'Resolved' | 'Referred' | 'Pending Follow-up';
  urgencyLevel?: 'Standard' | 'Urgent' | 'Emergency';
}

export interface LostAndFoundItem {
  id: string;
  itemDescription: string;
  category?: 'Electronics / Gadgets' | 'Personal Items / Bags' | 'Wallets & IDs' | 'Documents / Keys' | 'Apparel & Gear';
  locationFound: string;
  dateFound: string;
  foundBy: string;
  custodyOfficer?: string;
  storageLocation?: string;
  status: 'Unclaimed' | 'Claimed by Owner' | 'Turned over to PNP';
  dateClaimed?: string;
  claimantName?: string;
  contactNumber?: string;
}

export interface EmergencyCaseLog {
  id: string;
  incidentNumber: string;
  timestamp: string;
  incidentType: 'Medical Assistance' | 'Trail Incident / Lost Hiker' | 'Vehicular Breakdown' | 'Weather Advisory Distress' | 'Minor Injury';
  location: string;
  reportedBy: string;
  contactNumber: string;
  respondingAgencies: string[];
  actionsTaken: string;
  outcomeStatus: 'Active / Responding' | 'Stabilized & Transported' | 'Resolved On-site';
  officerInCharge: string;
}

export interface TouristFeedbackEntry {
  id: string;
  date: string;
  visitorName: string;
  visitorOrigin: string;
  destinationVisited: string;
  overallRating: number;
  cleanlinessRating: number;
  safetyRating: number;
  hospitalityRating: number;
  comments: string;
  recommendToOthers: boolean;
  submissionChannel?: string;
  referenceNumber?: string;
  npsScore?: number;
  ratings?: {
    staffCourtesy?: number;
    facilityCondition?: number;
    valueForMoney?: number;
    accessibility?: number;
    overallExperience?: number;
    informationAccuracy?: number;
    cleanliness?: number;
    safetySecurity?: number;
    hospitalityFriendliness?: number;
    facilitiesAmenities?: number;
    accessibilitySignages?: number;
    [key: string]: any;
  };
  touristName?: string;
  touristOrigin?: string;
  positiveRemarks?: string;
  areasForImprovement?: string;
  dateSubmitted?: string;
  status?: string;
  artaSQD?: any;
  wouldRecommend?: boolean;
}

export interface FAQItem {
  id: string;
  category: 'Logistics & Travel' | 'Attractions & Permits' | 'Accommodations & Rates' | 'Culture & Etiquette' | 'Emergency & Safety';
  question: string;
  answer: string;
  relatedDestinations?: string;
}

// Document Management System (DMS)
export type DocumentCategory =
  | 'Memoranda'
  | 'Office Orders'
  | 'Executive Orders'
  | 'Ordinances'
  | 'Minutes of Meetings'
  | 'Attendance Sheets'
  | 'Letters'
  | 'Reports'
  | 'MOAs'
  | 'Resolutions'
  | 'Photos'
  | 'Videos'
  | 'GIS Maps'
  | 'Inspection Reports'
  | 'Official Letters'
  | 'MOA / MOU';

export interface OfficialDocument {
  id: string;
  controlNumber: string;
  title: string;
  category: DocumentCategory;
  dateIssued: string;
  signatory: string;
  officeOrigin?: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'JPG' | 'PNG' | 'MP4' | 'ZIP' | 'SHP' | string;
  tags: string[];
  isConfidential: boolean;
  description?: string;
  downloadUrl?: string;
  status?: 'Active / In Force' | 'Archived' | 'Superseded' | 'Under Review';
  mediaThumbnail?: string;
}

// System Audit Trail
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'INSPECT' | 'RESOLVE' | 'LOGIN';
  module: string;
  details: string;
}
