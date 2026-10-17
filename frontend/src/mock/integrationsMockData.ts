import { IntegrationProviderCard } from '../types';

export const MOCK_INTEGRATION_CARDS: IntegrationProviderCard[] = [
  {
    id: 'github',
    name: 'GitHub Developer Ecosystem',
    description: 'Synchronizes public repositories, commit activity, verified code evidence, and pull request milestones directly to student profile.',
    category: 'Developer Tools',
    icon: 'github',
    capabilities: ['Repository synchronization', 'Commit telemetry', 'Project evidence linking', 'Actions status'],
    docs_url: 'https://docs.github.com/en/rest',
    is_read_only: true,
    status: 'Connected',
    account_name: 'bhumit9744',
    account_avatar: 'https://github.com/bhumit9744.png',
    repository: 'bhumit9744/dypdyp',
    scopes: ['read:user', 'repo:status', 'read:org'],
    last_verified_at: '2026-10-17T10:00:00Z',
    rate_limit_info: {
      limit: 5000,
      remaining: 4890,
      used: 110,
      resource: 'core'
    }
  },
  {
    id: 'google_workspace',
    name: 'Google Workspace for Education',
    description: 'Integrates campus university email, Google Calendar for recruitment interview slots, and Google Drive transcript attachments.',
    category: 'Academic & Scheduling',
    icon: 'google',
    capabilities: ['Interview calendar sync', 'Drive document evidence', 'Campus email notifications'],
    docs_url: 'https://developers.google.com/workspace',
    is_read_only: true,
    status: 'Connected',
    account_name: 'bhumit.gupta@dypatil.edu',
    scopes: ['calendar.readonly', 'drive.readonly', 'gmail.readonly'],
    last_verified_at: '2026-10-17T09:30:00Z'
  },
  {
    id: 'vercel',
    name: 'Vercel Deployment Pipeline',
    description: 'Tracks live project deployment previews, serverless execution telemetry, and continuous production status.',
    category: 'Cloud & Hosting',
    icon: 'vercel',
    capabilities: ['Production URL detection', 'Deployment health check', 'Build logging'],
    docs_url: 'https://vercel.com/docs/rest-api',
    is_read_only: true,
    status: 'Connected',
    account_name: 'bhumit9744',
    repository: 'dypdyp-frontend',
    scopes: ['deployments:read', 'projects:read'],
    last_verified_at: '2026-10-17T08:15:00Z'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Professional Network',
    description: 'Enables Jarvis to draft achievement posts, search alumni referral connections, and link verified credentials.',
    category: 'Professional Network',
    icon: 'linkedin',
    capabilities: ['One-click post composer', 'Profile credential linking', 'Campus referral outreach'],
    docs_url: 'https://learn.microsoft.com/en-us/linkedin/consumer/',
    is_read_only: false,
    status: 'Connected',
    account_name: 'Bhumit Gupta (LinkedIn Verified)',
    account_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    scopes: ['w_member_social', 'r_liteprofile', 'r_emailaddress'],
    last_verified_at: '2026-10-17T11:00:00Z'
  },
  {
    id: 'supabase',
    name: 'Supabase Cloud Infrastructure',
    description: 'Powers cloud relational storage, real-time table broadcasts, and secure authentication proofs.',
    category: 'Database & Cloud',
    icon: 'database',
    capabilities: ['Realtime event streams', 'PostgreSQL row-level security', 'Edge functions'],
    docs_url: 'https://supabase.com/docs',
    is_read_only: true,
    status: 'Connected',
    repository: 'placement-hub-db',
    last_verified_at: '2026-10-17T07:45:00Z'
  },
  {
    id: 'leetcode',
    name: 'LeetCode Problem Solving Metrics',
    description: 'Fetches verified algorithmic problem-solving counts, contest ratings, and topic badges to feed into ATS scoring.',
    category: 'Competitive Coding',
    icon: 'code',
    capabilities: ['Solved problem tally', 'Topic breakdown (DSA)', 'Contest rating sync'],
    docs_url: 'https://leetcode.com',
    is_read_only: true,
    status: 'Connected',
    account_name: 'bhumit9744',
    last_verified_at: '2026-10-17T12:00:00Z'
  }
];
