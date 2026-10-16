import React from 'react';
import {
  GraduationCap,
  Globe,
  Star,
  CheckCircle2,
  ExternalLink,
  Award,
  BookOpen,
  Mail,
  Phone,
  Code2
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/common/Icons';
import { mockStudentProfile } from '../../mock/data';

export const ProfileSubSection: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Student Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={mockStudentProfile.avatar}
            alt={mockStudentProfile.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {mockStudentProfile.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {mockStudentProfile.placementStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mockStudentProfile.degree} in {mockStudentProfile.department}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {mockStudentProfile.bio}
            </p>
          </div>
        </div>

        {/* Links & Contacts */}
        <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
          <a
            href={mockStudentProfile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Profile</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href={mockStudentProfile.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live Portfolio</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href={mockStudentProfile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
          >
            <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>LinkedIn Network</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Academic Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span>Academic Performance</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {mockStudentProfile.cgpa}
            </span>
            <span className="text-xs text-slate-400">/ 10.00 Cumulative</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            0 Active Backlogs • Verified by Registrar
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <span>Batch & Department</span>
          </div>
          <div className="space-y-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {mockStudentProfile.batch}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Roll: {mockStudentProfile.rollNo} • Graduating {mockStudentProfile.graduationYear}
            </p>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            DY Patil College of Engineering, Akurdi
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <Mail className="w-4 h-4 text-brand-600" />
            <span>Verified Contact Coordinates</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="text-slate-800 dark:text-slate-200 font-medium truncate">
              {mockStudentProfile.email}
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              {mockStudentProfile.phone}
            </div>
          </div>
          <div className="text-xs text-slate-500">
            2FA Active • Campus Portal Synced
          </div>
        </div>
      </div>

      {/* Featured Projects with Evidence */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-600" />
              Verified Engineering Projects
            </h2>
            <p className="text-xs text-slate-500">
              Evidence artifacts directly submitted for campus technical evaluation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mockStudentProfile.projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500/50 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">
                    {proj.title}
                  </h3>
                  {proj.stars && (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 shrink-0">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{proj.stars}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-900/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      Code Repository
                    </a>
                  )}
                  {proj.liveDemoUrl && (
                    <a
                      href={proj.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 dark:text-slate-300 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Demo Link
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
