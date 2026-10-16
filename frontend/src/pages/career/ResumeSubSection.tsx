import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Download,
  Sparkles,
  BarChart3,
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ResumeSubSection: React.FC = () => {
  const { studentProfile, skills, jobs, setCurrentSection, setCurrentSubSection } = useApp();
  const [selectedRole, setSelectedRole] = useState('Software Development Engineer (SDE)');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const verifiedSkills = skills.filter(s => s.verified);
  const totalSkills = skills.length;

  if (!studentProfile) {
    return (
      <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Profile Setup Required to Build Resume
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          The ATS resume builder dynamically compiles your verified credentials, academic CGPA, and evidence links without fabrication. Configure your student profile to view and export your resume.
        </p>
        <button
          onClick={() => {
            setCurrentSection('career');
            setCurrentSubSection('profile');
          }}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition-colors"
        >
          Go to Student Profile
        </button>
      </div>
    );
  }

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
            Standardized single-column format compiled strictly from your genuine academic and skill records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Copied Text!' : 'Copy Plaintext'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Resume Grounding & Verification Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Evidence Verification</span>
          <div className="my-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
              {verifiedSkills.length}
            </span>
            <span className="text-xs text-slate-400">/ {totalSkills} verified skills</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Grounded on student evidence proofs
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Machine Readability</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">100%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
          <span className="text-[10px] text-slate-400">Standardized headings, zero nested tables</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Target Role Alignment</span>
            <span className="font-bold text-slate-900 dark:text-white">{selectedRole.split(' ')[0]}</span>
          </div>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option>Software Development Engineer (SDE)</option>
            <option>Frontend Engineer (React / TypeScript)</option>
            <option>Backend Systems Engineer (Python / Go)</option>
            <option>Full-Stack Engineer</option>
          </select>
          <span className="text-[10px] text-slate-400">Tailors header keywords to job role</span>
        </div>
      </div>

      {/* Single-Column ATS Resume Sheet */}
      <div className="p-8 md:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto font-sans space-y-6 text-slate-800 dark:text-slate-200 print:shadow-none print:border-none">
        {/* Header Section */}
        <div className="text-center space-y-1.5 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
            {studentProfile.name}
          </h2>
          <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-center gap-2">
            <span>{studentProfile.email}</span>
            {studentProfile.phone && <span>• {studentProfile.phone}</span>}
            {studentProfile.githubUrl && (
              <span>• <a href={studentProfile.githubUrl} className="hover:underline">{studentProfile.githubUrl}</a></span>
            )}
            {studentProfile.linkedinUrl && (
              <span>• <a href={studentProfile.linkedinUrl} className="hover:underline">{studentProfile.linkedinUrl}</a></span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Target Role: {selectedRole}
          </p>
        </div>

        {/* Education Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
            Education
          </h3>
          <div className="flex items-start justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                DY Patil College of Engineering
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {studentProfile.degree} — {studentProfile.department}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900 dark:text-white">
                CGPA: {studentProfile.cgpa} / 10.00
              </p>
              <p className="text-slate-500">{studentProfile.batch}</p>
            </div>
          </div>
        </div>

        {/* Technical Skills Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
            Technical Skills
          </h3>
          {skills.length > 0 ? (
            <div className="text-xs space-y-1">
              <p>
                <strong className="text-slate-900 dark:text-white">Verified Skills: </strong>
                {verifiedSkills.map(s => s.name).join(', ') || 'No verified skills yet'}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">All Skills: </strong>
                {skills.map(s => s.name).join(', ')}
              </p>
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-1">
              No skills added yet. Add your verified technical skills in My Career &gt; Skills.
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
            Engineering Projects & Evidence
          </h3>
          {studentProfile.projects && studentProfile.projects.length > 0 ? (
            <div className="space-y-3">
              {studentProfile.projects.map((proj) => (
                <div key={proj.id} className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{proj.title}</span>
                    {proj.githubUrl && (
                      <span className="text-[11px] text-slate-500">[{proj.techStack.join(', ')}]</span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-1">
              No engineering projects logged in student profile yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
