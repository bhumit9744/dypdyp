import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Download,
  Sparkles,
  BarChart3,
  ExternalLink,
  RefreshCw,
  Copy
} from 'lucide-react';
import { mockResumeData, mockStudentProfile } from '../../mock/data';

export const ResumeSubSection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('SDE-1 (Backend & Distributed Systems)');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            ATS-Friendly Evidence Resume Builder
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standardized single-column format optimized for Workday, Greenhouse, and Taleo parsing algorithms.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Copied Markdown!' : 'Copy Plaintext'}</span>
          </button>
          <button
            onClick={() => alert('ATS Single-Column Clean PDF Generated successfully.')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ATS PDF</span>
          </button>
        </div>
      </div>

      {/* ATS Score & Dimension Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Overall ATS Score</span>
          <div className="my-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
              {mockResumeData.atsScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Exceeds 85% ATS Threshold
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Keyword Relevance</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {mockResumeData.atsBreakdown.keywordMatch}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full"
              style={{ width: `${mockResumeData.atsBreakdown.keywordMatch}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-400">Matches 24/25 SDE-1 JD terms</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Machine Readability</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {mockResumeData.atsBreakdown.formatting}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${mockResumeData.atsBreakdown.formatting}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-400">No tables/columns/unparsed graphics</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Quantified Metrics</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {mockResumeData.atsBreakdown.quantifiedImpact}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{ width: `${mockResumeData.atsBreakdown.quantifiedImpact}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-400">8 evidence-backed impact metrics</span>
        </div>
      </div>

      {/* Interactive Resume Preview Sheet */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 font-sans">
        {/* Header Block */}
        <div className="text-center space-y-1.5 border-b border-slate-200 dark:border-slate-800 pb-5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
            {mockStudentProfile.name}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Pune, Maharashtra • {mockStudentProfile.phone} • {mockStudentProfile.email}
          </p>
          <p className="text-xs text-brand-600 dark:text-brand-400 space-x-3 font-medium">
            <a href={mockStudentProfile.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">
              github.com/bhumit9744
            </a>
            <span>•</span>
            <a href={mockStudentProfile.portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline">
              bhumit.dev
            </a>
            <span>•</span>
            <a href={mockStudentProfile.linkedinUrl} target="_blank" rel="noreferrer" className="hover:underline">
              linkedin.com/in/bhumit9744
            </a>
          </p>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
            Education
          </h3>
          <div className="flex justify-between items-start text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                D. Y. Patil College of Engineering, Akurdi
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                Bachelor of Technology (B.Tech) in Computer Science & Engineering
              </p>
            </div>
            <div className="text-right">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                CGPA: {mockStudentProfile.cgpa} / 10.00
              </span>
              <p className="text-slate-400">{mockStudentProfile.batch}</p>
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
            Technical Proficiencies
          </h3>
          <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
            <p>
              <span className="font-semibold text-slate-900 dark:text-white">Languages: </span>
              Python, TypeScript, JavaScript, SQL, C++, Java
            </p>
            <p>
              <span className="font-semibold text-slate-900 dark:text-white">Backend & APIs: </span>
              FastAPI, Node.js, Express, RESTful APIs, gRPC, WebSocket architecture
            </p>
            <p>
              <span className="font-semibold text-slate-900 dark:text-white">Frontend & UI: </span>
              React 19, React Native, Vite, Tailwind CSS, Next.js, Redux Toolkit
            </p>
            <p>
              <span className="font-semibold text-slate-900 dark:text-white">Databases & DevOps: </span>
              PostgreSQL, Redis, Docker, Git, Linux, GitHub Actions CI/CD
            </p>
          </div>
        </div>

        {/* Verified Projects */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
            Verified Projects & Production Artifacts
          </h3>
          {mockStudentProfile.projects.map((proj) => (
            <div key={proj.id} className="text-xs space-y-1">
              <div className="flex justify-between items-baseline font-semibold text-slate-900 dark:text-white">
                <span>{proj.title}</span>
                <span className="text-[11px] text-slate-400">{proj.techStack.join(' | ')}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                • {proj.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
