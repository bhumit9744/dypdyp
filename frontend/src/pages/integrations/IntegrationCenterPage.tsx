import React, { useState, useEffect } from 'react';
import {
  Globe,
  Cloud,
  Database,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Lock,
  GitBranch,
  Star,
  GitFork,
  Check,
  X,
  Eye,
  EyeOff,
  Radio,
  Workflow,
  GitCommit,
  AlertTriangle,
  ChevronRight,
  Server
} from 'lucide-react';
import {
  IntegrationProviderCard,
  IntegrationStatusType,
  GitHubDataResponse
} from '../../types';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const GitHubIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

export const IntegrationCenterPage: React.FC = () => {
  const [cards, setCards] = useState<IntegrationProviderCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Connect Modal State
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProviderCard | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [repoInput, setRepoInput] = useState('bhumit9744/dypdyp');
  const [showToken, setShowToken] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  // Testing / Refreshing state per provider ID
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // GitHub Data Details Modal State
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [githubData, setGithubData] = useState<GitHubDataResponse | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [activeDataTab, setActiveDataTab] = useState<'commits' | 'issues' | 'workflows'>('commits');

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/integrations`);
      if (!res.ok) {
        throw new Error(`Failed to load integrations (HTTP ${res.status})`);
      }
      const data: IntegrationProviderCard[] = await res.json();
      setCards(data);
    } catch (err: any) {
      setError(err.message || 'Unable to communicate with the integration service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  // Connect Handler
  const handleOpenConnect = (card: IntegrationProviderCard) => {
    setSelectedProvider(card);
    setTokenInput('');
    setRepoInput(card.repository || 'bhumit9744/dypdyp');
    setConnectError(null);
    setConnectModalOpen(true);
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    try {
      setConnecting(true);
      setConnectError(null);
      const res = await fetch(`${API_BASE}/integrations/${selectedProvider.id}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenInput.trim() || null,
          repository: repoInput.trim() || undefined,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.detail || body.error || 'Connection failed.');
      }

      setConnectModalOpen(false);
      await fetchIntegrations();
    } catch (err: any) {
      setConnectError(err.message || 'Verification failed. Please check credentials and repository name.');
    } finally {
      setConnecting(false);
    }
  };

  // Test Connection
  const handleTestConnection = async (providerId: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [providerId]: true }));
      const res = await fetch(`${API_BASE}/integrations/${providerId}/test`, {
        method: 'POST',
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.detail || 'Test verification failed.');
      }
      await fetchIntegrations();
    } catch (err: any) {
      alert(`Test verification returned an error: ${err.message}`);
      await fetchIntegrations();
    } finally {
      setActionLoading(prev => ({ ...prev, [providerId]: false }));
    }
  };

  // Refresh Connection
  const handleRefreshConnection = async (providerId: string) => {
    await handleTestConnection(providerId);
  };

  // Disconnect Provider
  const handleDisconnect = async (providerId: string) => {
    if (!window.confirm(`Are you sure you want to disconnect ${providerId}? Credentials will be cleared.`)) {
      return;
    }
    try {
      setActionLoading(prev => ({ ...prev, [providerId]: true }));
      const res = await fetch(`${API_BASE}/integrations/${providerId}/disconnect`, {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error('Failed to disconnect');
      }
      await fetchIntegrations();
    } catch (err: any) {
      alert(`Error disconnecting: ${err.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [providerId]: false }));
    }
  };

  // Load Live GitHub Data
  const handleOpenGitHubData = async () => {
    setDataModalOpen(true);
    try {
      setLoadingData(true);
      setDataError(null);
      const res = await fetch(`${API_BASE}/integrations/github/data`);
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.detail || 'Failed to retrieve GitHub telemetry.');
      }
      const data: GitHubDataResponse = await res.json();
      setGithubData(data);
    } catch (err: any) {
      setDataError(err.message || 'Unable to fetch real-time repository data.');
    } finally {
      setLoadingData(false);
    }
  };

  // Helper for status badge styling
  const getStatusBadge = (status: IntegrationStatusType) => {
    switch (status) {
      case 'Connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        );
      case 'Connecting':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
            Connecting
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Expired
          </span>
        );
      case 'Degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
            <AlertCircle className="w-3 h-3 text-orange-600" />
            Degraded
          </span>
        );
      case 'Error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Error
          </span>
        );
      case 'Not connected':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Not connected
          </span>
        );
    }
  };

  const getProviderIcon = (iconName: string) => {
    switch (iconName) {
      case 'github':
        return <GitHubIcon className="w-6 h-6 text-slate-900 dark:text-white" />;
      case 'google':
        return <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'vercel':
        return <Server className="w-6 h-6 text-slate-900 dark:text-white" />;
      case 'cloudflare':
        return <Cloud className="w-6 h-6 text-orange-500" />;
      case 'supabase':
        return <Database className="w-6 h-6 text-emerald-500" />;
      default:
        return <Layers className="w-6 h-6 text-brand-600" />;
    }
  };

  const formatVerificationTime = (isoString?: string | null) => {
    if (!isoString) return 'Never verified';
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const connectedCount = cards.filter(c => c.status === 'Connected').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Architecture Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                Integration Center
              </span>
              <span className="text-xs text-slate-400">
                • Read-Only Credentials Isolated
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Placement Hub External Providers
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect authorized engineering, deployment, and cloud infrastructure telemetry.
              All connections require real provider verification. Status is never inferred from configuration alone.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchIntegrations}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh All
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-400 font-medium">Configured Providers</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{cards.length || 5}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Active Connections</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{connectedCount} Connected</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Access Principle</span>
            <p className="text-xl font-extrabold text-indigo-300 mt-0.5">Least-Privilege (Read-Only)</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">AI Agent Link</span>
            <p className="text-xl font-extrabold text-cyan-400 mt-0.5">JARVIS Allowlisted</p>
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchIntegrations}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const isActing = actionLoading[card.id] || false;
          const isGitHub = card.id === 'github';

          return (
            <div
              key={card.id}
              className={`rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                card.status === 'Connected'
                  ? 'border-emerald-200 dark:border-emerald-900/60'
                  : card.status === 'Error' || card.status === 'Expired'
                  ? 'border-rose-200 dark:border-rose-900/60'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="p-6 space-y-5">
                {/* Card Top Row: Icon, Category & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 shadow-xs">
                      {getProviderIcon(card.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                        {card.name}
                        {card.is_read_only && (
                          <span title="Read-only access enforced" className="text-slate-400">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {card.category}
                      </span>
                    </div>
                  </div>

                  <div>{getStatusBadge(card.status)}</div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[36px]">
                  {card.description}
                </p>

                {/* Account Details if Connected */}
                {card.account_name && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5 truncate">
                      {card.account_avatar ? (
                        <img
                          src={card.account_avatar}
                          alt={card.account_name}
                          className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                          {card.account_name.charAt(0)}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {card.account_name}
                        </p>
                        {card.repository && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {card.repository}
                          </p>
                        )}
                      </div>
                    </div>

                    {card.rate_limit_info?.remaining !== undefined && (
                      <span className="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                        {card.rate_limit_info.remaining} left
                      </span>
                    )}
                  </div>
                )}

                {/* Error Banner if Error or Expired */}
                {card.last_error && (
                  <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-700 dark:text-rose-300 space-y-1">
                    <div className="flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Verification Diagnostics:
                    </div>
                    <p className="leading-snug break-words">{card.last_error}</p>
                  </div>
                )}

                {/* Capabilities Pills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Declared Capabilities
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {card.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {cap.replace('READ_', '')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Timestamp */}
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last verified: {formatVerificationTime(card.last_verified_at)}</span>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800/80 rounded-b-3xl flex items-center justify-between gap-2">
                {card.status === 'Connected' ? (
                  <>
                    <div className="flex items-center gap-2">
                      {isGitHub && (
                        <button
                          onClick={handleOpenGitHubData}
                          className="px-3 py-1.5 rounded-xl font-semibold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
                        >
                          View Live Data
                        </button>
                      )}
                      <button
                        onClick={() => handleTestConnection(card.id)}
                        disabled={isActing}
                        title="Run on-demand verification"
                        className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${isActing ? 'animate-spin text-brand-600' : ''}`} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDisconnect(card.id)}
                      disabled={isActing}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleOpenConnect(card)}
                      className="px-3.5 py-1.5 rounded-xl font-semibold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs transition-colors"
                    >
                      {card.status === 'Error' || card.status === 'Expired' ? 'Reconnect' : 'Connect'}
                    </button>

                    <a
                      href={card.docs_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1 font-medium"
                    >
                      Docs <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* GitHub Connect Configuration Modal */}
      {connectModalOpen && selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {getProviderIcon(selectedProvider.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Connect {selectedProvider.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedProvider.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setConnectModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Security Notice */}
            <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <p>
                Tokens are stored in encrypted form on your local server. They are never transmitted to client responses, React state, or browser storage. Read-only permissions are recommended.
              </p>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-4">
              {/* Token Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Personal Access Token (PAT)</span>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Generate on GitHub ↗
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full pr-10 pl-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Required scopes: <code className="text-brand-600 dark:text-brand-400">repo</code> (for private repositories) or <code className="text-brand-600 dark:text-brand-400">public_repo</code>.
                </p>
              </div>

              {/* Target Repository */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Repository (owner/repo)
                </label>
                <input
                  type="text"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="bhumit9744/dypdyp"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Error Message */}
              {connectError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-800">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{connectError}</span>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setConnectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connecting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {connecting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Verify & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub Live Data Details Modal / Drawer */}
      {dataModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-5 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    {githubData?.repository.full_name || 'bhumit9744/dypdyp'}
                  </h2>
                  <a
                    href={githubData?.repository.html_url || 'https://github.com/bhumit9744/dypdyp'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {githubData?.repository.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenGitHubData}
                  disabled={loadingData}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Refresh Live Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setDataModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Error or Loading */}
            {loadingData && (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-500">Querying real GitHub REST API...</p>
              </div>
            )}

            {dataError && !loadingData && (
              <div className="p-4 my-4 rounded-2xl bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 text-xs">
                {dataError}
              </div>
            )}

            {githubData && !loadingData && (
              <div className="flex-1 overflow-y-auto space-y-6 pt-4 pr-1">
                {/* Metrics Pill Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-medium">Default Branch</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5 text-brand-600" />
                      {githubData.repository.default_branch}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-medium">Stars / Forks</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        {githubData.repository.stars_count}
                      </span>
                      <span className="flex items-center gap-0.5 text-slate-500">
                        <GitFork className="w-3.5 h-3.5" />
                        {githubData.repository.forks_count}
                      </span>
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-medium">Open Issues / PRs</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {githubData.repository.open_issues_count}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-medium">Rate Limit Remaining</span>
                    <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {githubData.rate_limit?.remaining ?? 'N/A'} / {githubData.rate_limit?.limit ?? 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6">
                  <button
                    onClick={() => setActiveDataTab('commits')}
                    className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeDataTab === 'commits'
                        ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <GitCommit className="w-3.5 h-3.5" />
                    Commits Feed ({githubData.commits.length})
                  </button>
                  <button
                    onClick={() => setActiveDataTab('issues')}
                    className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeDataTab === 'issues'
                        ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Issues & Pull Requests ({githubData.issues.length})
                  </button>
                  <button
                    onClick={() => setActiveDataTab('workflows')}
                    className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                      activeDataTab === 'workflows'
                        ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    CI/CD Actions Workflows ({githubData.workflows.length})
                  </button>
                </div>

                {/* Tab 1: Commits Feed */}
                {activeDataTab === 'commits' && (
                  <div className="space-y-3">
                    {githubData.commits.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No recent commits found or repository is empty.</p>
                    ) : (
                      githubData.commits.map((c) => (
                        <div
                          key={c.sha}
                          className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 text-xs hover:border-brand-300 dark:hover:border-slate-700 transition-colors"
                        >
                          <div className="space-y-1 min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {c.message}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                              <span>{c.author_name}</span>
                              <span>•</span>
                              <span>{c.date ? new Date(c.date).toLocaleDateString() : 'Recent'}</span>
                            </div>
                          </div>

                          <a
                            href={c.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded-lg font-mono text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-brand-600 shrink-0 flex items-center gap-1"
                          >
                            {c.short_sha}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab 2: Issues & Pull Requests */}
                {activeDataTab === 'issues' && (
                  <div className="space-y-3">
                    {githubData.issues.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">No open issues or pull requests.</p>
                    ) : (
                      githubData.issues.map((it) => (
                        <div
                          key={it.id}
                          className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  it.is_pr
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                }`}
                              >
                                {it.type}
                              </span>
                              <span className="font-semibold text-slate-900 dark:text-white truncate">
                                #{it.number} {it.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Opened by {it.author_name} • {it.comments_count} comments
                            </p>
                          </div>

                          <a
                            href={it.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab 3: CI/CD Actions Workflows */}
                {activeDataTab === 'workflows' && (
                  <div className="space-y-3">
                    {githubData.workflows.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">
                        No GitHub Actions workflow runs recorded or Actions are not configured for this repo.
                      </p>
                    ) : (
                      githubData.workflows.map((w) => (
                        <div
                          key={w.id}
                          className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  w.conclusion === 'success'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : w.conclusion === 'failure'
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                }`}
                              >
                                {w.conclusion || w.status}
                              </span>
                              <span className="font-semibold text-slate-900 dark:text-white truncate">
                                {w.name} #{w.run_number}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Branch: <code className="font-mono">{w.head_branch}</code> • Trigger: {w.event}
                            </p>
                          </div>

                          <a
                            href={w.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
