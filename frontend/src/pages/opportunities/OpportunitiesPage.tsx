import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Bookmark,
  BookmarkCheck,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  Trophy,
  GraduationCap,
  Building2,
  ShieldCheck,
  Layers,
  Plus,
  X,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpRight,
  Lock,
  Award,
  Check,
  AlertCircle,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';
import {
  OpportunityItem,
  SavedOpportunityItem,
  OpportunityMatchEvaluation,
  ProviderAuditReport
} from '../../types';
import { ResumeVersionSummary } from '../../types/resume';
import { API_BASE } from '../../config/api';

export const OpportunitiesPage: React.FC = () => {
  // Main listings state
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab & Filters state
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'hackathons' | 'scholarships' | 'saved' | 'discovery'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRemote, setSelectedRemote] = useState<string>('all');
  const [selectedCompensation, setSelectedCompensation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  // Saved pipeline state
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunityItem[]>([]);
  const [savedStatusFilter, setSavedStatusFilter] = useState<string>('all');

  // AI Evaluation Modal
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalData, setEvalData] = useState<OpportunityMatchEvaluation | null>(null);
  const [selectedOppForEval, setSelectedOppForEval] = useState<OpportunityItem | null>(null);

  // Resume Tailoring Modal
  const [tailorModalOpen, setTailorModalOpen] = useState(false);
  const [resumes, setResumes] = useState<ResumeVersionSummary[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [tailorLoading, setTailorLoading] = useState(false);
  const [tailorReport, setTailorReport] = useState<any | null>(null);
  const [selectedOppForTailor, setSelectedOppForTailor] = useState<OpportunityItem | null>(null);
  const [acceptedProposalIds, setAcceptedProposalIds] = useState<string[]>([]);
  const [tailorSuccessMsg, setTailorSuccessMsg] = useState<string | null>(null);

  // Manual Import Modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importForm, setImportForm] = useState({
    title: '',
    company_or_organizer: '',
    category: 'job',
    source_url: '',
    application_url: '',
    provider: 'linkedin',
    location: 'Remote',
    remote_status: 'remote',
    compensation_type: 'unknown',
    compensation_amount: '',
    skills: '',
    deadline: '',
    description: ''
  });

  // Provider Audit Modal
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditReports, setAuditReports] = useState<ProviderAuditReport[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Initial Data Fetch
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);

      let categoryParam = '';
      if (activeTab === 'jobs') categoryParam = 'job';
      else if (activeTab === 'hackathons') categoryParam = 'hackathon';
      else if (activeTab === 'scholarships') categoryParam = 'scholarship';

      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (categoryParam) params.append('category', categoryParam);
      if (selectedProvider !== 'all') params.append('provider', selectedProvider);
      if (selectedRemote !== 'all') params.append('remote_status', selectedRemote);
      if (selectedCompensation !== 'all') params.append('compensation_type', selectedCompensation);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const res = await fetch(`${API_BASE}/opportunities?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load opportunities`);
      const data = await res.json();
      setOpportunities(data.items || []);
      setTotalOpportunities(data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Unable to communicate with Opportunities service.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedOpportunities = async () => {
    try {
      const url = savedStatusFilter === 'all'
        ? `${API_BASE}/opportunities/saved`
        : `${API_BASE}/opportunities/saved?status=${savedStatusFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSavedOpportunities(data || []);
      }
    } catch (err) {
      console.error('Failed to load saved opportunities:', err);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch(`${API_BASE}/resumes`);
      if (res.ok) {
        const data = await res.json();
        setResumes(data || []);
        if (data && data.length > 0 && !selectedResumeId) {
          setSelectedResumeId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
  };

  const fetchAuditReports = async () => {
    try {
      setAuditLoading(true);
      const res = await fetch(`${API_BASE}/opportunities/providers/audit`);
      if (res.ok) {
        const data = await res.json();
        setAuditReports(data || []);
      }
    } catch (err) {
      console.error('Failed to load audit reports:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedOpportunities();
    } else if (activeTab !== 'discovery') {
      fetchOpportunities();
    }
  }, [activeTab, selectedRemote, selectedCompensation, selectedStatus, selectedProvider, savedStatusFilter]);

  useEffect(() => {
    fetchSavedOpportunities();
    fetchResumes();
  }, []);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  // Save / Toggle Saved Handler
  const handleSaveToggle = async (opp: OpportunityItem) => {
    const isSaved = savedOpportunities.some(s => s.opportunity_id === opp.id);
    try {
      if (isSaved) {
        const res = await fetch(`${API_BASE}/opportunities/saved/${opp.id}`, { method: 'DELETE' });
        if (res.ok) {
          setSavedOpportunities(prev => prev.filter(s => s.opportunity_id !== opp.id));
        }
      } else {
        const res = await fetch(`${API_BASE}/opportunities/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunity_id: opp.id, application_status: 'saved' })
        });
        if (res.ok) {
          const newSaved = await res.json();
          setSavedOpportunities(prev => [newSaved, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  // Update Status in Pipeline
  const handleUpdateStatus = async (oppId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/opportunities/${oppId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_status: newStatus })
      });
      if (res.ok) {
        await fetchSavedOpportunities();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // AI Evaluation Handler
  const handleOpenEvaluation = async (opp: OpportunityItem) => {
    setSelectedOppForEval(opp);
    setEvalModalOpen(true);
    setEvalData(null);
    setEvalLoading(true);

    try {
      const res = await fetch(`${API_BASE}/opportunities/${opp.id}/evaluate`);
      if (!res.ok) throw new Error('Evaluation failed');
      const data = await res.json();
      setEvalData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvalLoading(false);
    }
  };

  // Resume Tailor Handler
  const handleOpenTailor = (opp: OpportunityItem) => {
    setSelectedOppForTailor(opp);
    setTailorReport(null);
    setAcceptedProposalIds([]);
    setTailorSuccessMsg(null);
    setTailorModalOpen(true);
  };

  const handleExecuteTailoring = async () => {
    if (!selectedOppForTailor || !selectedResumeId) return;
    try {
      setTailorLoading(true);
      setTailorSuccessMsg(null);
      const res = await fetch(`${API_BASE}/opportunities/${selectedOppForTailor.id}/tailor-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_id: selectedResumeId })
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.detail || 'Tailoring failed');
      }
      const data = await res.json();
      setTailorReport(data.tailor_report);
      // Pre-select all proposals by default for easy review
      const props = data.tailor_report?.tailoring_proposals || [];
      setAcceptedProposalIds(props.map((p: any) => p.id));
    } catch (err: any) {
      alert(`Resume Tailoring Error: ${err.message}`);
    } finally {
      setTailorLoading(false);
    }
  };

  const handleApplyTailorProposals = async () => {
    if (!selectedResumeId || !tailorReport) return;
    try {
      setTailorLoading(true);
      const res = await fetch(`${API_BASE}/resumes/${selectedResumeId}/apply-proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accepted_proposal_ids: acceptedProposalIds
        })
      });
      if (!res.ok) throw new Error('Failed to apply proposals');
      setTailorSuccessMsg('Selected tailored edits successfully applied to your resume draft! Open ATS Resume Studio to inspect.');
    } catch (err: any) {
      alert(`Error applying proposals: ${err.message}`);
    } finally {
      setTailorLoading(false);
    }
  };

  // Manual Import Submit Handler
  const handleManualImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setImportLoading(true);
      setImportError(null);

      const skillsArray = importForm.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const res = await fetch(`${API_BASE}/opportunities/import-manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: importForm.title.trim(),
          company_or_organizer: importForm.company_or_organizer.trim(),
          category: importForm.category,
          source_url: importForm.source_url.trim(),
          application_url: importForm.application_url.trim() || importForm.source_url.trim(),
          provider: importForm.provider,
          location: importForm.location.trim() || 'Remote',
          remote_status: importForm.remote_status,
          compensation_type: importForm.compensation_type,
          compensation_amount: importForm.compensation_amount.trim() || undefined,
          skills: skillsArray,
          deadline: importForm.deadline.trim() || undefined,
          description: importForm.description.trim()
        })
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.detail || 'Import failed');
      }

      setImportModalOpen(false);
      setImportForm({
        title: '',
        company_or_organizer: '',
        category: 'job',
        source_url: '',
        application_url: '',
        provider: 'linkedin',
        location: 'Remote',
        remote_status: 'remote',
        compensation_type: 'unknown',
        compensation_amount: '',
        skills: '',
        deadline: '',
        description: ''
      });
      await fetchOpportunities();
      await fetchSavedOpportunities();
    } catch (err: any) {
      setImportError(err.message || 'Failed to import opportunity');
    } finally {
      setImportLoading(false);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: string, isStale: boolean) => {
    if (isStale) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Unverified (&gt;7d)
        </span>
      );
    }
    switch (status) {
      case 'closing_soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
            <Clock className="w-3 h-3 text-rose-600" />
            Closing Soon
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Closed
          </span>
        );
      case 'open':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Open
          </span>
        );
    }
  };

  const getProvenanceBadge = (type: string) => {
    switch (type) {
      case 'api_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            API Verified
          </span>
        );
      case 'official_feed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            <Layers className="w-3 h-3 text-cyan-600" />
            Official Feed
          </span>
        );
      case 'manual_import':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            User Import
          </span>
        );
      case 'link_discovery':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <LinkIcon className="w-3 h-3 text-slate-500" />
            Link Discovery
          </span>
        );
    }
  };

  const closingSoonCount = opportunities.filter(o => o.status === 'closing_soon').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Opportunities Intelligence
              </span>
              <span className="text-xs text-slate-400">• Linked to Jarvis & Resume Studio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Jobs, Internships & Competitions Radar
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Discover real tech opportunities across LinkedIn, Devpost, MLH, Unstop, Wellfound, Naukri, and official company ATS portals.
              Zero scraping, strict data provenance, and one-click AI resume tailoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Import Job / Paste Link
            </button>

            <button
              onClick={() => {
                fetchAuditReports();
                setAuditModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Provider Compliance Audit
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-400 font-medium">Monitored Opportunities</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{totalOpportunities || opportunities.length} Verified</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Closing Soon</span>
            <p className="text-xl font-extrabold text-amber-400 mt-0.5">{closingSoonCount} Urgent</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Your Saved Pipeline</span>
            <p className="text-xl font-extrabold text-brand-300 mt-0.5">{savedOpportunities.length} Tracked</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Compliance Boundary</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">8 Legal Providers</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Opportunities ({totalOpportunities || opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'jobs'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Jobs & Internships
          </button>
          <button
            onClick={() => setActiveTab('hackathons')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hackathons'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Hackathons & Coding
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scholarships'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Scholarships & Fellowships
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            My Saved Pipeline ({savedOpportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'discovery'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Source Discovery Hub
          </button>
        </div>

        {activeTab !== 'saved' && activeTab !== 'discovery' && (
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, skills, company..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
            />
          </form>
        )}
      </div>

      {/* Filter Toolbar (Visible when browsing opportunities) */}
      {activeTab !== 'saved' && activeTab !== 'discovery' && (
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>

          {/* Remote Mode */}
          <select
            value={selectedRemote}
            onChange={(e) => setSelectedRemote(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
          >
            <option value="all">Workplace: All Modes</option>
            <option value="remote">Remote Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="on_site">On-site</option>
          </select>

          {/* Compensation */}
          <select
            value={selectedCompensation}
            onChange={(e) => setSelectedCompensation(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
          >
            <option value="all">Compensation: All</option>
            <option value="paid">Paid Salary / CTC</option>
            <option value="stipend">Paid Stipend</option>
            <option value="prize">Cash Prizes</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
          >
            <option value="all">Status: All</option>
            <option value="open">Open</option>
            <option value="closing_soon">Closing Soon</option>
          </select>

          {/* Provider */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
          >
            <option value="all">Provider: All Sources</option>
            <option value="company_career">Company ATS (Greenhouse)</option>
            <option value="university">University Placement Cell</option>
            <option value="devpost">Devpost</option>
            <option value="mlh">Major League Hacking (MLH)</option>
            <option value="linkedin">LinkedIn</option>
            <option value="unstop">Unstop</option>
            <option value="wellfound">Wellfound</option>
            <option value="naukri">Naukri</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRemote('all');
              setSelectedCompensation('all');
              setSelectedStatus('all');
              setSelectedProvider('all');
            }}
            className="ml-auto text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* TAB 1, 2, 3, 4: Opportunity Listings Grid */}
      {activeTab !== 'saved' && activeTab !== 'discovery' && (
        <>
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-3" />
              <p className="text-sm text-slate-500">Checking verified opportunity feeds...</p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm">
              <AlertCircle className="w-5 h-5 inline mr-2 text-rose-600" />
              {error}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <Briefcase className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No opportunities match your filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try loosening your filters, or paste an external job URL via the Import tool.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => {
                const isSaved = savedOpportunities.some(s => s.opportunity_id === opp.id);
                return (
                  <div
                    key={opp.id}
                    className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 hover:shadow-xl transition-all duration-200 overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/60 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {getProvenanceBadge(opp.provenance_type)}
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {opp.category}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          {opp.company_or_organizer}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSaveToggle(opp)}
                        title={isSaved ? 'Remove from Saved' : 'Save to Pipeline'}
                        className={`p-2 rounded-xl transition-all shrink-0 ${
                          isSaved
                            ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-300'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 pt-4 flex-1 space-y-4">
                      {/* Status & Deadline Banner */}
                      <div className="flex items-center justify-between text-xs">
                        {getStatusBadge(opp.status, opp.is_stale)}
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {opp.deadline ? `Due: ${opp.deadline}` : 'Open / Rolling'}
                        </span>
                      </div>

                      {/* Location & Compensation */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{opp.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate font-semibold text-slate-800 dark:text-slate-200">
                          <DollarSign className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                          <span className="truncate">{opp.compensation_amount || opp.compensation_type}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {opp.description}
                      </p>

                      {/* Skills Tags */}
                      {opp.skills && opp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {opp.skills.slice(0, 4).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {opp.skills.length > 4 && (
                            <span className="px-1.5 py-0.5 text-[11px] text-slate-400">
                              +{opp.skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEvaluation(opp)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition-all flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Match
                        </button>

                        <button
                          onClick={() => handleOpenTailor(opp)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 hover:bg-brand-100 transition-all flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Tailor Resume
                        </button>
                      </div>

                      <a
                        href={opp.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-all flex items-center gap-1"
                      >
                        Apply
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 5: Saved Opportunities Pipeline */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Application Pipeline & Deadline Tracker
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Pipeline Stage:</span>
              <select
                value={savedStatusFilter}
                onChange={(e) => setSavedStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                <option value="all">All Stages ({savedOpportunities.length})</option>
                <option value="saved">Saved Bookmarks</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {savedOpportunities.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <Bookmark className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No saved opportunities in this stage</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Bookmark roles from the All Opportunities tab or import private links to track your application lifecycle.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedOpportunities.map((saved) => {
                const opp = saved.opportunity;
                if (!opp) return null;
                return (
                  <div
                    key={saved.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                          {opp.category} • {opp.company_or_organizer}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Deadline: {opp.deadline || 'Open / Rolling'}
                        </p>
                      </div>

                      {/* Application Status Dropdown */}
                      <select
                        value={saved.application_status}
                        onChange={(e) => handleUpdateStatus(opp.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offered">Offered 🎉</option>
                        <option value="rejected">Rejected</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenTailor(opp)}
                          className="px-3 py-1.5 rounded-xl font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-all flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Tailor Resume
                        </button>
                        <button
                          onClick={() => handleOpenEvaluation(opp)}
                          className="px-3 py-1.5 rounded-xl font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all"
                        >
                          View Fit
                        </button>
                      </div>

                      <a
                        href={opp.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-900 dark:text-white hover:underline flex items-center gap-1"
                      >
                        Open Portal
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Source Discovery Hub (Link-Based Provider Routes) */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Source Discovery Directory
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              Placement Hub complies strictly with provider terms of service. For platforms without public open APIs
              (such as LinkedIn, Unstop, Wellfound, and Naukri), direct outbound search links are generated with your target
              keywords. You can import individual job URLs back into Placement Hub for private resume tailoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'LinkedIn Jobs',
                url: 'https://www.linkedin.com/jobs/search/?keywords=software+engineer+intern&location=India',
                type: 'Link Discovery',
                desc: 'Explore active early-career software engineering openings on LinkedIn.'
              },
              {
                name: 'Unstop Hackathons',
                url: 'https://unstop.com/hackathons',
                type: 'Curated Challenges',
                desc: 'Official national student hackathons, coding challenges, and corporate PPI sprints.'
              },
              {
                name: 'Devpost Hackathons',
                url: 'https://devpost.com/hackathons',
                type: 'Official Feed',
                desc: 'Global hackathons with verified cash prizes and hardware grants.'
              },
              {
                name: 'Major League Hacking',
                url: 'https://mlh.io/seasons/2026/events',
                type: 'Official Season',
                desc: 'Official student hackathon league season events and Global Hack Weeks.'
              },
              {
                name: 'Wellfound Startups',
                url: 'https://wellfound.com/jobs?query=Software+Engineer&location=India',
                type: 'Startup Roles',
                desc: 'High-growth funded tech startups hiring interns and junior developers.'
              },
              {
                name: 'Naukri Campus',
                url: 'https://www.naukri.com/software-engineer-fresher-jobs-in-pune',
                type: 'Enterprise IT',
                desc: 'Verified graduate trainee and IT services drives in Pune & Bangalore.'
              },
              {
                name: 'Greenhouse Job Boards',
                url: 'https://boards.greenhouse.io',
                type: 'ATS API Verified',
                desc: 'Direct corporate career listings from tech companies using Greenhouse ATS.'
              },
              {
                name: 'University Placement Cell',
                url: '/api/v1/placements/drives',
                type: 'Campus Drives',
                desc: 'Verified on-campus Super Dream & Dream drives for D.Y. Patil students.'
              }
            ].map((p, pIdx) => (
              <div
                key={pIdx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {p.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>

                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all"
                >
                  Open External Search
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: AI Match & Skill Gap Evaluation */}
      {evalModalOpen && selectedOppForEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Relevance & Eligibility Fit
                </h3>
              </div>
              <button
                onClick={() => setEvalModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {evalLoading ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-600" />
                  <p className="text-xs text-slate-500">Comparing verified profile skills against requirements...</p>
                </div>
              ) : evalData ? (
                <>
                  {/* Score Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50/50 dark:from-brand-950/40 dark:to-indigo-950/20 border border-brand-200/60 dark:border-brand-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-brand-700 dark:text-brand-300 font-bold uppercase tracking-wider">
                        Advisory Relevance Score
                      </span>
                      <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {evalData.match_percentage}% Match
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{evalData.match_level} Candidate</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-brand-600/30">
                      {evalData.match_percentage}%
                    </div>
                  </div>

                  {/* Why it matches */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Why Your Profile Matches
                    </h5>
                    <div className="space-y-1.5">
                      {evalData.why_it_matches.map((w, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 space-y-2">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Matched Skills ({evalData.matched_skills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {evalData.matched_skills.length > 0 ? (
                          evalData.matched_skills.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">None explicitly listed</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 space-y-2">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Identified Skill Gaps ({evalData.skill_gaps.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {evalData.skill_gaps.length > 0 ? (
                          evalData.skill_gaps.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No major gaps identified</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ethical AI Notice */}
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <span>{evalData.advisory_notice}</span>
                  </div>
                </>
              ) : null}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setEvalModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Resume Studio Tailoring Bridge */}
      {tailorModalOpen && selectedOppForTailor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-600" />
                  Tailor Resume for {selectedOppForTailor.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Powered by Google Gemini Resume Studio • Granular candidate review before applying
                </p>
              </div>
              <button
                onClick={() => setTailorModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {tailorSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{tailorSuccessMsg}</span>
                </div>
              )}

              {/* Resume Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Resume Version to Tailor:
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.target_role}) — {r.ats_score} ATS Score {r.is_master ? '[Master Profile]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {!tailorReport && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-brand-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Analyze Job Description & Generate Proposed Edits
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Gemini will analyze {selectedOppForTailor.title} and generate before-and-after proposals
                    highlighting verified skills. No qualifications or fake metrics will be invented.
                  </p>
                  <button
                    onClick={handleExecuteTailoring}
                    disabled={tailorLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${tailorLoading ? 'animate-spin' : ''}`} />
                    {tailorLoading ? 'Analyzing...' : 'Generate Proposed Edits'}
                  </button>
                </div>
              )}

              {tailorReport && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Proposed Tailoring Edits ({tailorReport.tailoring_proposals?.length || 0})
                    </span>
                    <span className="text-slate-500">
                      Predicted Score: {tailorReport.score_before || 80} → {tailorReport.score_after || 88}
                    </span>
                  </div>

                  {tailorReport.tailoring_proposals?.map((prop: any) => {
                    const isAccepted = acceptedProposalIds.includes(prop.id);
                    return (
                      <div
                        key={prop.id}
                        className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                          isAccepted
                            ? 'bg-brand-50/50 dark:bg-brand-950/20 border-brand-300 dark:border-brand-800'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                            Section: {prop.section}
                          </span>
                          <button
                            onClick={() => {
                              if (isAccepted) {
                                setAcceptedProposalIds(prev => prev.filter(id => id !== prop.id));
                              } else {
                                setAcceptedProposalIds(prev => [...prev, prop.id]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              isAccepted
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {isAccepted ? 'Accepted' : 'Accept Edit'}
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div className="text-slate-500 line-through">
                            <strong>Before:</strong> {prop.original_text}
                          </div>
                          <div className="text-brand-900 dark:text-brand-200 font-semibold">
                            <strong>After:</strong> {prop.suggested_text}
                          </div>
                          <div className="text-[11px] text-slate-400 italic">
                            Reason: {prop.reason}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    <strong>Zero Automation Notice:</strong> Placement Hub never auto-submits resumes or sends applications.
                    Applying proposals updates your resume draft in Resume Studio for manual candidate review.
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setTailorModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>

              {tailorReport && (
                <button
                  onClick={handleApplyTailorProposals}
                  disabled={tailorLoading || acceptedProposalIds.length === 0}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
                >
                  Apply {acceptedProposalIds.length} Edits to Resume Draft
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Manual Opportunity Import */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Import Opportunity / Paste Link
                </h3>
                <p className="text-xs text-slate-500">
                  Track private job listings from LinkedIn, Unstop, or company career portals
                </p>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualImportSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {importError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {importError}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Opportunity URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.linkedin.com/jobs/view/... or employer URL"
                  value={importForm.source_url}
                  onChange={(e) => setImportForm(prev => ({ ...prev, source_url: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Role / Challenge Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer Intern"
                    value={importForm.title}
                    onChange={(e) => setImportForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Company / Organizer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Acme Labs"
                    value={importForm.company_or_organizer}
                    onChange={(e) => setImportForm(prev => ({ ...prev, company_or_organizer: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={importForm.category}
                    onChange={(e) => setImportForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="job">Job</option>
                    <option value="internship">Internship</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="competition">Competition</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="fellowship">Fellowship</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Work Mode</label>
                  <select
                    value={importForm.remote_status}
                    onChange={(e) => setImportForm(prev => ({ ...prev, remote_status: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on_site">On-site</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={importForm.deadline}
                    onChange={(e) => setImportForm(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune, India or Remote"
                    value={importForm.location}
                    onChange={(e) => setImportForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Compensation (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹8-12 LPA or $5k Prize"
                    value={importForm.compensation_amount}
                    onChange={(e) => setImportForm(prev => ({ ...prev, compensation_amount: e.target.value, compensation_type: e.target.value ? 'paid' : 'unknown' }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, React, FastAPI, Docker"
                  value={importForm.skills}
                  onChange={(e) => setImportForm(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Job Description / Notes *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste factual requirements and responsibilities..."
                  value={importForm.description}
                  onChange={(e) => setImportForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importLoading}
                  className="px-5 py-2 rounded-xl font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
                >
                  {importLoading ? 'Importing...' : 'Save & Track Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Provider Compliance & Phase 0 Access Audit */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Phase 0: Provider Access & Legal Compliance Audit
                </h3>
                <p className="text-xs text-slate-500">
                  Documented verification across all 8 requested opportunity channels
                </p>
              </div>
              <button
                onClick={() => setAuditModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {auditLoading ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-600" />
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4 text-xs">
                  {auditReports.map((report, rIdx) => (
                    <div key={rIdx} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{report.name}</h4>
                          <span className="text-[10px] text-slate-400">({report.category})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {report.official_api_available ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              Official API / Feed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              Link-Discovery Mode Only
                            </span>
                          )}
                          {getProvenanceBadge(report.provenance_type)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600 dark:text-slate-400 pt-1">
                        <div>
                          <strong className="text-slate-800 dark:text-slate-200">Auth & Permissions:</strong>
                          <p className="mt-0.5 leading-relaxed">{report.auth_and_approval_requirements}</p>
                        </div>
                        <div>
                          <strong className="text-slate-800 dark:text-slate-200">Terms & Scraping Prohibitions:</strong>
                          <p className="mt-0.5 leading-relaxed">{report.terms_and_permitted_use}</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 leading-relaxed">
                        <strong>Compliance Guarantee:</strong> {report.disclaimer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setAuditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
