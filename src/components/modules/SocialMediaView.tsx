import React, { useState, useMemo } from 'react';
import {
  Share2,
  Users,
  Eye,
  Heart,
  TrendingUp,
  MessageCircle,
  Calendar,
  Send,
  Video,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  Plus,
  Search,
  FileText,
  Download,
  Printer,
  ExternalLink,
  ThumbsUp,
  BarChart3,
  PieChart as PieIcon,
  Trash2,
  Edit3,
  AlertCircle,
  X,
  ChevronRight,
  Image as ImageIcon,
  Compass,
  Tag,
  Globe,
  Radio,
  Layers,
  Award,
  BarChart2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useTourism } from '../../context/TourismContext';
import {
  SocialMediaPlatformStat,
  ScheduledPost,
  TopSocialPost,
  SocialCampaignMetric
} from '../../types';

export const SocialMediaView: React.FC = () => {
  const {
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
    currentUser,
  } = useTourism();

  // Navigation Sub-tabs
  const [activeTab, setActiveTab] = useState<'analytics' | 'top_posts' | 'calendar' | 'campaigns'>('analytics');

  // Search & Filters
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [calendarStatusFilter, setCalendarStatusFilter] = useState<string>('All');
  const [postTypeFilter, setPostTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedTopPost, setSelectedTopPost] = useState<TopSocialPost | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<SocialMediaPlatformStat | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [editingScheduledPost, setEditingScheduledPost] = useState<ScheduledPost | null>(null);
  const [showAddTopPostModal, setShowAddTopPostModal] = useState<boolean>(false);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [printFormType, setPrintFormType] = useState<'smm-01' | 'smm-02'>('smm-01');

  // Form States
  const [scheduleForm, setScheduleForm] = useState({
    platform: 'Facebook' as 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube',
    title: '',
    scheduledTime: '',
    campaignTag: '',
    postType: 'Video / Reel' as ScheduledPost['postType'],
    captionSnippet: '',
    creator: currentUser?.name || 'MTO Social Media Specialist',
    targetAudience: 'Tourists, General Public',
    hashtags: '',
    mediaUrl: '',
    status: 'Scheduled' as ScheduledPost['status'],
  });

  const [topPostForm, setTopPostForm] = useState({
    platform: 'TikTok' as TopSocialPost['platform'],
    title: '',
    postType: 'Video / Reel' as TopSocialPost['postType'],
    publishDate: new Date().toISOString().substring(0, 10),
    campaignTag: 'Discover Malungon',
    impressionsReach: 150000,
    reactions: 12000,
    comments: 1500,
    shares: 4200,
    engagementRate: 14.5,
    permalink: '',
    captionExcerpt: '',
    sentimentRating: '98.0% Positive',
    keyHighlight: '',
  });

  const [campaignForm, setCampaignForm] = useState({
    campaignName: '',
    hashtags: '#MalungonTourism #DiscoverMalungon',
    channels: ['Facebook', 'Instagram', 'TikTok'] as ('Facebook' | 'Instagram' | 'TikTok' | 'YouTube')[],
    totalReach: 250000,
    totalEngagements: 35000,
    totalShares: 8500,
    ugcCount: 450,
    influencerPartners: '',
    inquiriesGenerated: 600,
    status: 'Active' as SocialCampaignMetric['status'],
    dateRange: '2026 Q3',
  });

  const [platformUpdateForm, setPlatformUpdateForm] = useState({
    followers: 0,
    monthlyReach: 0,
    monthlyEngagement: 0,
    shares: 0,
    reactions: 0,
    comments: 0,
    postsPublished: 0,
    avgEngagementRate: 0,
    growthRatePercent: 0,
    videoViews: 0,
    topPostTitle: '',
    topPostEngagement: '',
  });

  // Aggregates
  const totalFollowers = socialMetrics.reduce((sum, s) => sum + s.followers, 0);
  const totalReach = socialMetrics.reduce((sum, s) => sum + s.monthlyReach, 0);
  const totalEngagements = socialMetrics.reduce((sum, s) => sum + s.monthlyEngagement, 0);
  const totalShares = socialMetrics.reduce((sum, s) => sum + s.shares, 0);
  const totalReactions = socialMetrics.reduce((sum, s) => sum + s.reactions, 0);
  const totalComments = socialMetrics.reduce((sum, s) => sum + (s.comments || 0), 0);
  const totalVideoViews = socialMetrics.reduce((sum, s) => sum + (s.videoViews || 0), 0);

  // Filtered Top Posts
  const filteredTopPosts = useMemo(() => {
    return topPosts.filter((post) => {
      const matchPlatform = platformFilter === 'All' || post.platform === platformFilter;
      const matchType = postTypeFilter === 'All' || post.postType === postTypeFilter;
      const matchSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.campaignTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.captionExcerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPlatform && matchType && matchSearch;
    });
  }, [topPosts, platformFilter, postTypeFilter, searchQuery]);

  // Filtered Calendar Posts
  const filteredScheduledPosts = useMemo(() => {
    return scheduledPosts.filter((post) => {
      const matchPlatform = platformFilter === 'All' || post.platform === platformFilter;
      const matchStatus = calendarStatusFilter === 'All' || post.status === calendarStatusFilter;
      const matchSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.campaignTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.creator && post.creator.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchPlatform && matchStatus && matchSearch;
    });
  }, [scheduledPosts, platformFilter, calendarStatusFilter, searchQuery]);

  // Chart Data
  const platformChartData = useMemo(() => {
    return socialMetrics.map((p) => ({
      name: p.platform,
      Reach: p.monthlyReach,
      Engagement: p.monthlyEngagement,
      Followers: p.followers,
      Reactions: p.reactions,
    }));
  }, [socialMetrics]);

  const followerPieData = useMemo(() => {
    const colors: Record<string, string> = {
      Facebook: '#2563EB',
      Instagram: '#E11D48',
      TikTok: '#0F172A',
      YouTube: '#DC2626',
    };
    return socialMetrics.map((p) => ({
      name: p.platform,
      value: p.followers,
      color: colors[p.platform] || '#64748B',
    }));
  }, [socialMetrics]);

  // Handlers
  const handleOpenPlatformEdit = (stat: SocialMediaPlatformStat) => {
    setEditingPlatform(stat);
    setPlatformUpdateForm({
      followers: stat.followers,
      monthlyReach: stat.monthlyReach,
      monthlyEngagement: stat.monthlyEngagement,
      shares: stat.shares,
      reactions: stat.reactions,
      comments: stat.comments || 0,
      postsPublished: stat.postsPublished || 0,
      avgEngagementRate: stat.avgEngagementRate || 0,
      growthRatePercent: stat.growthRatePercent || 0,
      videoViews: stat.videoViews || 0,
      topPostTitle: stat.topPostTitle,
      topPostEngagement: stat.topPostEngagement,
    });
  };

  const handleSavePlatformMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlatform) return;
    updatePlatformStat(editingPlatform.platform, platformUpdateForm);
    setEditingPlatform(null);
  };

  const handleSaveScheduledPost = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = scheduleForm.hashtags
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t.startsWith('#'));

    if (editingScheduledPost) {
      updateScheduledPost(editingScheduledPost.id, {
        platform: scheduleForm.platform,
        title: scheduleForm.title,
        scheduledTime: scheduleForm.scheduledTime,
        campaignTag: scheduleForm.campaignTag,
        postType: scheduleForm.postType,
        captionSnippet: scheduleForm.captionSnippet,
        creator: scheduleForm.creator,
        targetAudience: scheduleForm.targetAudience,
        hashtags: tagArray.length > 0 ? tagArray : undefined,
        mediaUrl: scheduleForm.mediaUrl || undefined,
        status: scheduleForm.status,
      });
      setEditingScheduledPost(null);
    } else {
      addScheduledPost({
        platform: scheduleForm.platform,
        title: scheduleForm.title,
        scheduledTime: scheduleForm.scheduledTime,
        campaignTag: scheduleForm.campaignTag,
        postType: scheduleForm.postType,
        captionSnippet: scheduleForm.captionSnippet,
        creator: scheduleForm.creator,
        targetAudience: scheduleForm.targetAudience,
        hashtags: tagArray.length > 0 ? tagArray : ['#MalungonTourism'],
        mediaUrl: scheduleForm.mediaUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
        status: scheduleForm.status,
      });
    }
    setShowScheduleModal(false);
  };

  const handleOpenEditScheduledPost = (post: ScheduledPost) => {
    setEditingScheduledPost(post);
    setScheduleForm({
      platform: post.platform,
      title: post.title,
      scheduledTime: post.scheduledTime,
      campaignTag: post.campaignTag,
      postType: post.postType || 'Video / Reel',
      captionSnippet: post.captionSnippet || '',
      creator: post.creator || '',
      targetAudience: post.targetAudience || 'General Public',
      hashtags: post.hashtags ? post.hashtags.join(' ') : '',
      mediaUrl: post.mediaUrl || '',
      status: post.status,
    });
    setShowScheduleModal(true);
  };

  const handleSaveTopPost = (e: React.FormEvent) => {
    e.preventDefault();
    addTopPost({
      ...topPostForm,
      permalink: topPostForm.permalink || `https://${topPostForm.platform.toLowerCase()}.com/malungon/post/${Date.now()}`,
    });
    setShowAddTopPostModal(false);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    addSocialCampaign({
      ...campaignForm,
    });
    setShowAddCampaignModal(false);
  };

  // CSV Export
  const exportSocialCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    // Section 1: Platform Stats
    csvContent += '=== LGU MALUNGON TOURISM SOCIAL MEDIA PLATFORM STATS ===\r\n';
    csvContent += 'Platform,Followers,Monthly Reach,Monthly Engagement,Shares,Reactions,Comments,Engagement Rate %,MoM Growth %,Video Views,Top Post Title\r\n';
    socialMetrics.forEach((s) => {
      csvContent += `"${s.platform}",${s.followers},${s.monthlyReach},${s.monthlyEngagement},${s.shares},${s.reactions},${s.comments || 0},${s.avgEngagementRate || 0}%,${s.growthRatePercent || 0}%,${s.videoViews || 0},"${s.topPostTitle.replace(/"/g, '""')}"\r\n`;
    });

    csvContent += '\r\n=== TOP PERFORMING SOCIAL MEDIA POSTS ===\r\n';
    csvContent += 'Platform,Post Title,Format,Publish Date,Campaign,Impressions / Reach,Reactions,Comments,Shares,Engagement Rate %,Sentiment\r\n';
    topPosts.forEach((p) => {
      csvContent += `"${p.platform}","${p.title.replace(/"/g, '""')}","${p.postType}","${p.publishDate}","${p.campaignTag}",${p.impressionsReach},${p.reactions},${p.comments},${p.shares},${p.engagementRate}%,"${p.sentimentRating}"\r\n`;
    });

    csvContent += '\r\n=== EDITORIAL CONTENT CALENDAR & SCHEDULED POSTS ===\r\n';
    csvContent += 'Platform,Post Title,Schedule,Campaign Tag,Format,Status,Creator,Target Audience\r\n';
    scheduledPosts.forEach((p) => {
      csvContent += `"${p.platform}","${p.title.replace(/"/g, '""')}","${p.scheduledTime}","${p.campaignTag}","${p.postType || 'Standard'}","${p.status}","${p.creator || 'Unassigned'}","${p.targetAudience || 'General'}"\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `malungon_social_media_analytics_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Instagram':
        return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'TikTok':
        return 'text-slate-900 bg-slate-100 border-slate-300';
      case 'YouTube':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return 'bg-blue-600 text-white';
      case 'Instagram':
        return 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white';
      case 'TikTok':
        return 'bg-black text-white';
      case 'YouTube':
        return 'bg-red-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-pink-700 uppercase tracking-wider mb-1">
            <Share2 className="w-4 h-4" />
            <span>MODULE L • Digital Audience Engagement & Omnichannel Social Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Social Media Management (SMM)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-platform telemetry across Facebook, Instagram, TikTok, and YouTube channels for the Municipality of Malungon.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setEditingScheduledPost(null);
              setScheduleForm({
                platform: 'Facebook',
                title: '',
                scheduledTime: new Date(Date.now() + 86400000).toISOString().substring(0, 16).replace('T', ' '),
                campaignTag: 'Discover Malungon',
                postType: 'Video / Reel',
                captionSnippet: '',
                creator: currentUser?.name || 'MTO Media Team',
                targetAudience: 'Domestic & Regional Tourists',
                hashtags: '#DiscoverMalungon #Sarangani',
                mediaUrl: '',
                status: 'Scheduled',
              });
              setShowScheduleModal(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-pink-700 hover:bg-pink-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>

          <button
            onClick={exportSocialCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Official SMM Report</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Followers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalFollowers.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12.4% Net Audience Growth MoM</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Organic Reach</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{totalReach.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Across 4 Official LGU Channels</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Engagements</span>
            <Heart className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-black text-pink-700 mt-1">{totalEngagements.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {totalShares.toLocaleString()} shares • {totalComments.toLocaleString()} comments
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Video & Reel Views</span>
            <Video className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700 mt-1">{totalVideoViews.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Highland docuseries & viral clips</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-1 bg-white p-1 rounded-xl shadow-xs">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'analytics'
              ? 'bg-pink-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Omnichannel Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('top_posts')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'top_posts'
              ? 'bg-pink-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Top Performing Posts ({topPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'calendar'
              ? 'bg-pink-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Editorial Content Calendar ({scheduledPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'campaigns'
              ? 'bg-pink-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Campaign Social Performance ({socialCampaigns.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: OMNICHANNEL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Cross-Platform Reach & Engagement Matrix</h3>
                  <p className="text-xs text-slate-500">Monthly comparison of organic impressions vs. active user interactions</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[11px] font-bold">2026 Telemetry</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      formatter={(val: number) => val.toLocaleString()}
                      contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Reach" fill="#0284c7" radius={[4, 4, 0, 0]} name="Organic Reach" />
                    <Bar dataKey="Engagement" fill="#ec4899" radius={[4, 4, 0, 0]} name="Total Engagements" />
                    <Bar dataKey="Reactions" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Total Reactions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Audience Share by Platform</h3>
                  <p className="text-xs text-slate-500">Breakdown of {totalFollowers.toLocaleString()} aggregate followers</p>
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={followerPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={40}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {followerPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => val.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                {socialMetrics.map((m) => (
                  <div key={m.platform} className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">{m.platform}:</span>
                    <span className="font-bold text-slate-800">{m.followers.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Platform Dossier Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Official Channel Performance Profiles</h3>
                <p className="text-xs text-slate-500">Detailed metric telemetry across Facebook, Instagram, TikTok, and YouTube</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {socialMetrics.map((platform) => (
                <div
                  key={platform.platform}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-pink-300 transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold ${getPlatformBadge(platform.platform)}`}>
                          {platform.platform}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">Official LGU Verified Page</span>
                      </div>
                      <button
                        onClick={() => handleOpenPlatformEdit(platform)}
                        className="text-xs font-semibold text-pink-700 hover:text-pink-800 flex items-center gap-1 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Update Metrics</span>
                      </button>
                    </div>

                    {/* Metric Grid */}
                    <div className="grid grid-cols-3 gap-3 my-4">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Followers</span>
                        <span className="text-base font-bold text-slate-900">{platform.followers.toLocaleString()}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold block">+{platform.growthRatePercent || 0}% MoM</span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Reach</span>
                        <span className="text-base font-bold text-emerald-700">{platform.monthlyReach.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 font-medium block">Impressions</span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Engagement</span>
                        <span className="text-base font-bold text-pink-700">{platform.monthlyEngagement.toLocaleString()}</span>
                        <span className="text-[10px] text-pink-600 font-semibold block">{platform.avgEngagementRate || 0}% Avg Rate</span>
                      </div>
                    </div>

                    {/* Granular Breakdown */}
                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Heart className="w-3 h-3 text-pink-500" />
                          <span>Reactions / Likes:</span>
                        </span>
                        <span className="font-semibold text-slate-800">{platform.reactions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Share2 className="w-3 h-3 text-blue-500" />
                          <span>Shares / Reposts:</span>
                        </span>
                        <span className="font-semibold text-slate-800">{platform.shares.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <MessageCircle className="w-3 h-3 text-indigo-500" />
                          <span>Comments:</span>
                        </span>
                        <span className="font-semibold text-slate-800">{(platform.comments || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-emerald-500" />
                          <span>Posts Published this Month:</span>
                        </span>
                        <span className="font-semibold text-slate-800">{platform.postsPublished || 0} posts</span>
                      </div>
                      {platform.videoViews ? (
                        <div className="flex justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <Video className="w-3 h-3 text-red-500" />
                            <span>Video Views:</span>
                          </span>
                          <span className="font-bold text-red-700">{platform.videoViews.toLocaleString()} views</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Top Post Spotlight */}
                    <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Top Performing Post</span>
                        </span>
                        <span className="text-pink-700 font-semibold">{platform.topPostEngagement}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 line-clamp-1">{platform.topPostTitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TOP PERFORMING POSTS */}
      {activeTab === 'top_posts' && (
        <div className="space-y-5">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search top posts, campaigns..."
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none w-56 sm:w-64"
                />
              </div>

              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="All">All Platforms</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
              </select>

              <select
                value={postTypeFilter}
                onChange={(e) => setPostTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="All">All Post Formats</option>
                <option value="Video / Reel">Video / Reel</option>
                <option value="Photo Carousel">Photo Carousel</option>
                <option value="Infographic / Advisory">Infographic / Advisory</option>
                <option value="Text / Article">Text / Article</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddTopPostModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-pink-700 hover:bg-pink-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Top Post</span>
            </button>
          </div>

          {/* Top Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPlatformBadge(post.platform)}`}>
                      {post.platform}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{post.publishDate}</span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                    {post.campaignTag}
                  </span>

                  <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-2">{post.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 italic">"{post.captionExcerpt}"</p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Impressions</span>
                      <span className="text-xs font-bold text-slate-900">{post.impressionsReach.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Reactions</span>
                      <span className="text-xs font-bold text-pink-700">{post.reactions.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Engagement</span>
                      <span className="text-xs font-bold text-indigo-700">{post.engagementRate}%</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Shares: <strong className="text-slate-800">{post.shares.toLocaleString()}</strong></span>
                    <span>Comments: <strong className="text-slate-800">{post.comments.toLocaleString()}</strong></span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {post.sentimentRating}
                    </span>
                  </div>

                  {post.keyHighlight && (
                    <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-100 text-[11px] text-amber-900 font-medium">
                      💡 <strong>Impact:</strong> {post.keyHighlight}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedTopPost(post)}
                    className="text-xs font-bold text-pink-700 hover:text-pink-800 flex items-center gap-1"
                  >
                    <span>View Post Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {post.permalink && (
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
                        title="Open Live Post URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`Remove top post record "${post.title}"?`)) {
                          deleteTopPost(post.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: EDITORIAL CALENDAR & SCHEDULED POSTS */}
      {activeTab === 'calendar' && (
        <div className="space-y-5">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scheduled posts, authors..."
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-pink-500 focus:outline-none w-56 sm:w-64"
                />
              </div>

              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="All">All Channels</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
              </select>

              <select
                value={calendarStatusFilter}
                onChange={(e) => setCalendarStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Scheduled">Scheduled Only</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingScheduledPost(null);
                setScheduleForm({
                  platform: 'Facebook',
                  title: '',
                  scheduledTime: new Date(Date.now() + 86400000).toISOString().substring(0, 16).replace('T', ' '),
                  campaignTag: 'Discover Malungon',
                  postType: 'Video / Reel',
                  captionSnippet: '',
                  creator: currentUser?.name || 'MTO Media Team',
                  targetAudience: 'Domestic & Regional Tourists',
                  hashtags: '#DiscoverMalungon #Sarangani',
                  mediaUrl: '',
                  status: 'Scheduled',
                });
                setShowScheduleModal(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-pink-700 hover:bg-pink-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start md:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule New Post</span>
            </button>
          </div>

          {/* Table View */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Scheduled Post & Topic</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Format</th>
                    <th className="px-4 py-3">Publish Time</th>
                    <th className="px-4 py-3">Campaign Tag</th>
                    <th className="px-4 py-3">Assigned Creator</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredScheduledPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs">
                        <div className="font-bold">{post.title}</div>
                        {post.captionSnippet && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                            "{post.captionSnippet}"
                          </div>
                        )}
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="text-[10px] text-pink-700 font-mono mt-0.5">
                            {post.hashtags.join(' ')}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPlatformBadge(post.platform)}`}>
                          {post.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {post.postType || 'Video / Reel'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{post.scheduledTime}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-pink-700">{post.campaignTag}</td>
                      <td className="px-4 py-3 text-slate-600 text-[11px]">{post.creator || 'MTO Media Team'}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            post.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : post.status === 'Scheduled'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {post.status !== 'Published' && (
                            <button
                              onClick={() => publishScheduledPost(post.id)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold transition-colors"
                              title="Publish Now to Live Feed"
                            >
                              Publish Now
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditScheduledPost(post)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete scheduled post "${post.title}"?`)) {
                                deleteScheduledPost(post.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* SUB-TAB 4: CAMPAIGN SOCIAL PERFORMANCE */}
      {activeTab === 'campaigns' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Campaign Social Media Telemetry</h3>
              <p className="text-xs text-slate-500">Cross-channel reach, viral hashtag tracking, UGC volumes, and inquiry conversion</p>
            </div>

            <button
              onClick={() => setShowAddCampaignModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-pink-700 hover:bg-pink-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Campaign Tracker</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {socialCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-pink-300 transition-all"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        camp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : camp.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {camp.status}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{camp.dateRange}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{camp.campaignName}</h4>
                  <p className="text-xs font-mono text-pink-700 mt-1">{camp.hashtags}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {camp.channels.map((ch) => (
                      <span key={ch} className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPlatformBadge(ch)}`}>
                        {ch}
                      </span>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Reach</span>
                      <span className="text-sm font-bold text-emerald-700">{camp.totalReach.toLocaleString()}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Interactions</span>
                      <span className="text-sm font-bold text-pink-700">{camp.totalEngagements.toLocaleString()}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">UGC Tagged Posts</span>
                      <span className="text-sm font-bold text-slate-800">{camp.ugcCount.toLocaleString()}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Inquiries Generated</span>
                      <span className="text-sm font-bold text-indigo-700">{camp.inquiriesGenerated.toLocaleString()}</span>
                    </div>
                  </div>

                  {camp.influencerPartners && (
                    <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                      <span className="font-bold text-slate-700 block text-[11px]">Partner Influencers:</span>
                      <span>{camp.influencerPartners}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Tracking ID: {camp.id}</span>
                  <button
                    onClick={() => {
                      if (confirm(`Remove campaign tracker "${camp.campaignName}"?`)) {
                        deleteSocialCampaign(camp.id);
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete Tracker
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: TOP POST DETAIL DOSSIER */}
      {selectedTopPost && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${getPlatformBadge(selectedTopPost.platform)}`}>
                    {selectedTopPost.platform}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Published: {selectedTopPost.publishDate}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedTopPost.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTopPost(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              <div className="bg-pink-50 border border-pink-200 p-3.5 rounded-xl">
                <span className="text-[11px] font-bold text-pink-900 uppercase tracking-wider block">Post Excerpt / Caption:</span>
                <p className="text-sm font-medium text-pink-950 italic mt-1">"{selectedTopPost.captionExcerpt}"</p>
              </div>

              {/* Performance Metrics Table */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Audited Performance Metrics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Impressions / Reach</span>
                    <span className="text-base font-bold text-slate-900">{selectedTopPost.impressionsReach.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Reactions</span>
                    <span className="text-base font-bold text-pink-700">{selectedTopPost.reactions.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Comments</span>
                    <span className="text-base font-bold text-indigo-700">{selectedTopPost.comments.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Shares</span>
                    <span className="text-base font-bold text-blue-700">{selectedTopPost.shares.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Strategic Insights */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Strategic Engagement Takeaway</h4>
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                  <p className="font-medium leading-relaxed">{selectedTopPost.keyHighlight}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Audience Sentiment Rating:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {selectedTopPost.sentimentRating}
                  </span>
                </div>

                {selectedTopPost.permalink && (
                  <a
                    href={selectedTopPost.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors"
                  >
                    <span>Open Live Post</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPDATE PLATFORM METRICS */}
      {editingPlatform && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPlatformBadge(editingPlatform.platform)}`}>
                  {editingPlatform.platform}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Update Monthly Platform Telemetry</h3>
              </div>
              <button
                onClick={() => setEditingPlatform(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlatformMetrics} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Followers / Subscribers</label>
                  <input
                    type="number"
                    value={platformUpdateForm.followers}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, followers: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Monthly Organic Reach</label>
                  <input
                    type="number"
                    value={platformUpdateForm.monthlyReach}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, monthlyReach: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Engagements</label>
                  <input
                    type="number"
                    value={platformUpdateForm.monthlyEngagement}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, monthlyEngagement: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Reactions / Likes</label>
                  <input
                    type="number"
                    value={platformUpdateForm.reactions}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, reactions: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Shares / Reposts</label>
                  <input
                    type="number"
                    value={platformUpdateForm.shares}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, shares: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Comments</label>
                  <input
                    type="number"
                    value={platformUpdateForm.comments}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, comments: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Engagement Rate %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={platformUpdateForm.avgEngagementRate}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, avgEngagementRate: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">MoM Growth Rate %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={platformUpdateForm.growthRatePercent}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, growthRatePercent: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Video Views (Optional)</label>
                  <input
                    type="number"
                    value={platformUpdateForm.videoViews}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, videoViews: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Top Performing Post Title</label>
                  <input
                    type="text"
                    value={platformUpdateForm.topPostTitle}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, topPostTitle: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Top Post Engagement Summary</label>
                  <input
                    type="text"
                    value={platformUpdateForm.topPostEngagement}
                    onChange={(e) => setPlatformUpdateForm({ ...platformUpdateForm, topPostEngagement: e.target.value })}
                    placeholder="e.g. 18.4K Likes, 4.2K Shares"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlatform(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-lg font-semibold"
                >
                  Save Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE NEW POST / EDIT */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingScheduledPost ? 'Edit Scheduled Social Post' : 'Schedule Editorial Social Post'}
                </h3>
                <p className="text-xs text-slate-500">Cross-channel publishing calendar entry</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScheduledPost} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Channel</label>
                  <select
                    value={scheduleForm.platform}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, platform: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                    required
                  >
                    <option value="Facebook">Facebook Page</option>
                    <option value="Instagram">Instagram (@malungontourism)</option>
                    <option value="TikTok">TikTok (@malungontourism)</option>
                    <option value="YouTube">YouTube Channel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Post Format</label>
                  <select
                    value={scheduleForm.postType}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, postType: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  >
                    <option value="Video / Reel">Video / Short Reel</option>
                    <option value="Photo Carousel">Photo Carousel</option>
                    <option value="Story">Story / Ephemeral</option>
                    <option value="Infographic / Advisory">Infographic / Official Advisory</option>
                    <option value="Text / Article">Text Announcement</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Post Title / Topic Headline</label>
                  <input
                    type="text"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                    placeholder="e.g. Weekend Weather Advisory & Kalon Barak Cloud Chasing Schedule"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Scheduled Publish Date & Time</label>
                  <input
                    type="text"
                    value={scheduleForm.scheduledTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                    placeholder="2026-09-08 07:00 AM"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Campaign Tag</label>
                  <input
                    type="text"
                    value={scheduleForm.campaignTag}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, campaignTag: e.target.value })}
                    placeholder="e.g. Discover Malungon, 17th Slang Festival"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Draft Caption Copy / Script</label>
                  <textarea
                    rows={3}
                    value={scheduleForm.captionSnippet}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, captionSnippet: e.target.value })}
                    placeholder="Write the draft copy, promotional teaser, or call to action..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Hashtags (space-separated)</label>
                  <input
                    type="text"
                    value={scheduleForm.hashtags}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, hashtags: e.target.value })}
                    placeholder="#DiscoverMalungon #Sarangani"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                  <select
                    value={scheduleForm.status}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-lg font-semibold"
                >
                  {editingScheduledPost ? 'Update Schedule' : 'Confirm Post Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TOP POST */}
      {showAddTopPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record High-Impact Top Performing Post</h3>
                <p className="text-xs text-slate-500">Document viral posts and best-practice content</p>
              </div>
              <button
                onClick={() => setShowAddTopPostModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopPost} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Platform</label>
                  <select
                    value={topPostForm.platform}
                    onChange={(e) => setTopPostForm({ ...topPostForm, platform: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                    required
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Post Format</label>
                  <select
                    value={topPostForm.postType}
                    onChange={(e) => setTopPostForm({ ...topPostForm, postType: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  >
                    <option value="Video / Reel">Video / Reel</option>
                    <option value="Photo Carousel">Photo Carousel</option>
                    <option value="Live Stream">Live Stream</option>
                    <option value="Infographic / Advisory">Infographic / Advisory</option>
                    <option value="Text / Article">Text / Article</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Post Title / Description</label>
                  <input
                    type="text"
                    value={topPostForm.title}
                    onChange={(e) => setTopPostForm({ ...topPostForm, title: e.target.value })}
                    placeholder="e.g. POV: You wake up at 5:00 AM above the clouds"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={topPostForm.publishDate}
                    onChange={(e) => setTopPostForm({ ...topPostForm, publishDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Campaign Association</label>
                  <input
                    type="text"
                    value={topPostForm.campaignTag}
                    onChange={(e) => setTopPostForm({ ...topPostForm, campaignTag: e.target.value })}
                    placeholder="Discover Malungon"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Impressions / Reach</label>
                  <input
                    type="number"
                    value={topPostForm.impressionsReach}
                    onChange={(e) => setTopPostForm({ ...topPostForm, impressionsReach: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Reactions / Likes</label>
                  <input
                    type="number"
                    value={topPostForm.reactions}
                    onChange={(e) => setTopPostForm({ ...topPostForm, reactions: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Comments Count</label>
                  <input
                    type="number"
                    value={topPostForm.comments}
                    onChange={(e) => setTopPostForm({ ...topPostForm, comments: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Shares / Reposts</label>
                  <input
                    type="number"
                    value={topPostForm.shares}
                    onChange={(e) => setTopPostForm({ ...topPostForm, shares: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Engagement Rate %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={topPostForm.engagementRate}
                    onChange={(e) => setTopPostForm({ ...topPostForm, engagementRate: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Sentiment Rating</label>
                  <input
                    type="text"
                    value={topPostForm.sentimentRating}
                    onChange={(e) => setTopPostForm({ ...topPostForm, sentimentRating: e.target.value })}
                    placeholder="98.5% Positive"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Caption Excerpt</label>
                  <textarea
                    rows={2}
                    value={topPostForm.captionExcerpt}
                    onChange={(e) => setTopPostForm({ ...topPostForm, captionExcerpt: e.target.value })}
                    placeholder="Key caption snippet..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Strategic Highlight / Inquiries Drove</label>
                  <input
                    type="text"
                    value={topPostForm.keyHighlight}
                    onChange={(e) => setTopPostForm({ ...topPostForm, keyHighlight: e.target.value })}
                    placeholder="e.g. Generated 800+ homestay booking requests within 48h"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTopPostModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-lg font-semibold"
                >
                  Save Top Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CAMPAIGN TRACKER */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Social Campaign Telemetry Tracker</h3>
                <p className="text-xs text-slate-500">Cross-platform promotional push monitoring</p>
              </div>
              <button
                onClick={() => setShowAddCampaignModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Campaign Name</label>
                <input
                  type="text"
                  value={campaignForm.campaignName}
                  onChange={(e) => setCampaignForm({ ...campaignForm, campaignName: e.target.value })}
                  placeholder="e.g. #ExperienceMalungon 2026 Eco-Tourism Blitz"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Official Campaign Hashtags</label>
                <input
                  type="text"
                  value={campaignForm.hashtags}
                  onChange={(e) => setCampaignForm({ ...campaignForm, hashtags: e.target.value })}
                  placeholder="#ExperienceMalungon #SaranganiHighlands"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Estimated Cross-Platform Reach</label>
                  <input
                    type="number"
                    value={campaignForm.totalReach}
                    onChange={(e) => setCampaignForm({ ...campaignForm, totalReach: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Total Engagements</label>
                  <input
                    type="number"
                    value={campaignForm.totalEngagements}
                    onChange={(e) => setCampaignForm({ ...campaignForm, totalEngagements: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">UGC Posts Tracked</label>
                  <input
                    type="number"
                    value={campaignForm.ugcCount}
                    onChange={(e) => setCampaignForm({ ...campaignForm, ugcCount: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Inquiries Generated</label>
                  <input
                    type="number"
                    value={campaignForm.inquiriesGenerated}
                    onChange={(e) => setCampaignForm({ ...campaignForm, inquiriesGenerated: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Date Range</label>
                  <input
                    type="text"
                    value={campaignForm.dateRange}
                    onChange={(e) => setCampaignForm({ ...campaignForm, dateRange: e.target.value })}
                    placeholder="Q3 2026"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                  <select
                    value={campaignForm.status}
                    onChange={(e) => setCampaignForm({ ...campaignForm, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Influencer Collaborators</label>
                  <input
                    type="text"
                    value={campaignForm.influencerPartners}
                    onChange={(e) => setCampaignForm({ ...campaignForm, influencerPartners: e.target.value })}
                    placeholder="e.g. Explore Mindanao (520K), Byyahero Travel Show"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-700 hover:bg-pink-800 text-white rounded-lg font-semibold"
                >
                  Save Campaign Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL LGU DOCUMENTS MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Controls Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between rounded-t-2xl print:hidden">
              <div className="flex items-center space-x-2">
                <Printer className="w-4 h-4 text-pink-400" />
                <span className="font-bold text-sm">Official LGU Social Media Report Generator</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex bg-slate-800 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setPrintFormType('smm-01')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      printFormType === 'smm-01' ? 'bg-pink-700 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Form 01 (Monthly Digest)
                  </button>
                  <button
                    onClick={() => setPrintFormType('smm-02')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      printFormType === 'smm-02' ? 'bg-pink-700 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Form 02 (Content Schedule)
                  </button>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-pink-700 hover:bg-pink-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE DOCUMENT CANVAS */}
            <div className="p-8 sm:p-12 text-slate-900 bg-white font-serif">
              {/* LGU Official Letterhead */}
              <div className="text-center pb-4 border-b-2 border-slate-900 mb-6">
                <div className="text-xs font-sans uppercase tracking-widest text-slate-600 font-bold">Republic of the Philippines</div>
                <div className="text-xs font-sans uppercase tracking-wider text-slate-700 font-semibold">Province of Sarangani</div>
                <div className="text-base font-sans uppercase tracking-wider font-extrabold text-slate-900">Municipality of Malungon</div>
                <div className="text-sm font-sans font-bold text-pink-900 uppercase tracking-widest mt-0.5">
                  Municipal Tourism Office • Social Media & Digital Communications Desk
                </div>
                <div className="text-[10px] font-sans text-slate-500 mt-1">
                  2nd Floor, Legislative Building, Poblacion, Malungon, Sarangani Province 9503 | tourism@malungon.gov.ph
                </div>
              </div>

              {printFormType === 'smm-01' ? (
                /* FORM 01: MONTHLY SOCIAL MEDIA PERFORMANCE DIGEST */
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-sans">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Control No:</span>
                      <div className="text-xs font-mono font-bold text-slate-900">LGU-MLG-SMM-2026-M09</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-black uppercase text-pink-900 tracking-wider">LGU SMM Form 01</span>
                      <h2 className="text-base font-extrabold text-slate-900">Monthly Social Media Performance & Analytics Digest</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Report Month:</span>
                      <div className="text-xs font-bold text-slate-900">September 2026</div>
                    </div>
                  </div>

                  {/* Narrative Summary */}
                  <div className="font-sans text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[11px]">I. Executive Overview:</h4>
                    <p>
                      For the current reporting period, the Municipality of Malungon official social media channels achieved a cumulative organic audience reach of <strong>{totalReach.toLocaleString()}</strong> unique impressions, yielding <strong>{totalEngagements.toLocaleString()}</strong> active engagements across Facebook, Instagram, TikTok, and YouTube. Net audience growth accelerated by +12.4% MoM, propelled primarily by viral video content from Kalon Barak Skyline Ridge and Lamlifew Heritage Village.
                    </p>
                  </div>

                  {/* Platform Breakdown Table */}
                  <div className="font-sans">
                    <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">II. Certified Omnichannel Telemetry Matrix:</h4>
                    <table className="w-full text-left text-xs border border-slate-300">
                      <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-800 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Platform</th>
                          <th className="p-2 border-r border-slate-300 text-right">Followers</th>
                          <th className="p-2 border-r border-slate-300 text-right">Organic Reach</th>
                          <th className="p-2 border-r border-slate-300 text-right">Engagements</th>
                          <th className="p-2 border-r border-slate-300 text-right">Reactions</th>
                          <th className="p-2 border-r border-slate-300 text-right">Shares</th>
                          <th className="p-2 text-right">Eng. Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {socialMetrics.map((p) => (
                          <tr key={p.platform}>
                            <td className="p-2 font-bold text-slate-900 border-r border-slate-300">{p.platform}</td>
                            <td className="p-2 text-right font-mono border-r border-slate-300">{p.followers.toLocaleString()}</td>
                            <td className="p-2 text-right font-mono border-r border-slate-300">{p.monthlyReach.toLocaleString()}</td>
                            <td className="p-2 text-right font-mono border-r border-slate-300">{p.monthlyEngagement.toLocaleString()}</td>
                            <td className="p-2 text-right font-mono border-r border-slate-300">{p.reactions.toLocaleString()}</td>
                            <td className="p-2 text-right font-mono border-r border-slate-300">{p.shares.toLocaleString()}</td>
                            <td className="p-2 text-right font-mono font-bold text-pink-800">{p.avgEngagementRate}%</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-100 font-bold">
                          <td className="p-2 border-r border-slate-300 uppercase text-[10px]">Consolidated Total</td>
                          <td className="p-2 text-right font-mono border-r border-slate-300">{totalFollowers.toLocaleString()}</td>
                          <td className="p-2 text-right font-mono border-r border-slate-300">{totalReach.toLocaleString()}</td>
                          <td className="p-2 text-right font-mono border-r border-slate-300">{totalEngagements.toLocaleString()}</td>
                          <td className="p-2 text-right font-mono border-r border-slate-300">{totalReactions.toLocaleString()}</td>
                          <td className="p-2 text-right font-mono border-r border-slate-300">{totalShares.toLocaleString()}</td>
                          <td className="p-2 text-right font-mono text-pink-800">15.5% avg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Top Viral Posts Highlight */}
                  <div className="font-sans">
                    <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[11px]">III. Top Performing Content Assets:</h4>
                    <div className="space-y-2">
                      {topPosts.slice(0, 3).map((tp, idx) => (
                        <div key={tp.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-900">{idx + 1}. [{tp.platform}] {tp.title}</span>
                            <div className="text-slate-600 italic text-[11px]">"{tp.captionExcerpt}"</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Impact: {tp.keyHighlight}</div>
                          </div>
                          <div className="text-right whitespace-nowrap pl-4">
                            <span className="font-bold text-pink-800">{tp.impressionsReach.toLocaleString()} Reach</span>
                            <div className="text-[10px] text-slate-500">{tp.reactions.toLocaleString()} Likes • {tp.shares.toLocaleString()} Shares</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="pt-8 grid grid-cols-2 gap-12 font-sans text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-8">Prepared and Certified By:</span>
                      <div className="font-extrabold text-slate-900 text-sm">CHRISTIAN DAVE NAVARRO</div>
                      <div className="text-slate-600">Social Media & Communications Specialist</div>
                      <div className="text-[10px] text-slate-400">Municipal Tourism Office</div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-8">Noted and Approved By:</span>
                      <div className="font-extrabold text-slate-900 text-sm">CRISTINA D. CONSTANTINO-LA PAZ</div>
                      <div className="text-slate-600">Municipal Tourism Action Officer-Designate</div>
                      <div className="text-[10px] text-slate-400">LGU Malungon, Sarangani Province</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* FORM 02: EDITORIAL CONTENT CALENDAR APPROVAL FORM */
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-sans">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Control No:</span>
                      <div className="text-xs font-mono font-bold text-slate-900">LGU-MLG-SMM-CAL-2026-09</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-black uppercase text-pink-900 tracking-wider">LGU SMM Form 02</span>
                      <h2 className="text-base font-extrabold text-slate-900">Official Editorial Content Calendar & Production Approval</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Effective Period:</span>
                      <div className="text-xs font-bold text-slate-900">Sept 01 – Sept 30, 2026</div>
                    </div>
                  </div>

                  {/* Schedule Table */}
                  <div className="font-sans">
                    <table className="w-full text-left text-xs border border-slate-300">
                      <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-800 border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">Publish Schedule</th>
                          <th className="p-2 border-r border-slate-300">Platform</th>
                          <th className="p-2 border-r border-slate-300">Format</th>
                          <th className="p-2 border-r border-slate-300">Campaign / Topic Headline</th>
                          <th className="p-2 border-r border-slate-300">Creator</th>
                          <th className="p-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {scheduledPosts.map((sp) => (
                          <tr key={sp.id}>
                            <td className="p-2 font-mono text-[11px] border-r border-slate-300 whitespace-nowrap">{sp.scheduledTime}</td>
                            <td className="p-2 font-bold text-slate-900 border-r border-slate-300">{sp.platform}</td>
                            <td className="p-2 border-r border-slate-300">{sp.postType || 'Video / Reel'}</td>
                            <td className="p-2 font-semibold border-r border-slate-300">
                              <div>{sp.title}</div>
                              <div className="text-[10px] text-slate-500 italic font-normal">Tag: {sp.campaignTag}</div>
                            </td>
                            <td className="p-2 border-r border-slate-300">{sp.creator || 'Media Lead'}</td>
                            <td className="p-2 text-center font-bold text-[10px] uppercase">
                              <span className={sp.status === 'Published' ? 'text-emerald-800' : 'text-blue-800'}>
                                {sp.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Quality Assurance Directives */}
                  <div className="font-sans text-xs bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1 text-slate-700">
                    <h4 className="font-bold text-slate-900 uppercase text-[11px]">Editorial Directives & Content Compliance:</h4>
                    <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                      <li>Strictly observe Cultural Sensitivity & IP Guidelines when filming Blaan and Tagakaolo ancestral rituals.</li>
                      <li>Highlight Environmental Ordinances (Zero Single-Use Plastic and Leave No Trace principles) on all trail posts.</li>
                      <li>Verify weather forecasts with MDRRMO Malungon prior to broadcasting weekend mountain advisories.</li>
                    </ul>
                  </div>

                  {/* Signatures */}
                  <div className="pt-8 grid grid-cols-2 gap-12 font-sans text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-8">Endorsed By Content Lead:</span>
                      <div className="font-extrabold text-slate-900 text-sm">CHRISTIAN DAVE NAVARRO</div>
                      <div className="text-slate-600">Head of Digital Communications</div>
                      <div className="text-[10px] text-slate-400">Date: September 02, 2026</div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-8">Approved For Broadcast:</span>
                      <div className="font-extrabold text-slate-900 text-sm">CRISTINA D. CONSTANTINO-LA PAZ</div>
                      <div className="text-slate-600">Municipal Tourism Action Officer-Designate</div>
                      <div className="text-[10px] text-slate-400">Date: September 02, 2026</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

