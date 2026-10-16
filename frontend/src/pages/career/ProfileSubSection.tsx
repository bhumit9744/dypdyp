import React, { useState } from 'react';
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
  Code2,
  Edit3,
  UserCheck,
  Plus,
  Save,
  X
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/common/Icons';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';

export const ProfileSubSection: React.FC = () => {
  const { studentProfile, updateStudentProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<StudentProfile>>(
    studentProfile || {
      name: '',
      email: '',
      rollNo: '',
      department: 'Computer Engineering',
      degree: 'B.Tech',
      batch: '2022 - 2026',
      graduationYear: 2026,
      cgpa: 8.5,
      bio: '',
      githubUrl: '',
      portfolioUrl: '',
      linkedinUrl: '',
      phone: '',
      activeBacklogs: 0,
      placementStatus: 'Eligible',
      projects: []
    }
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo || !formData.email) {
      alert('Please fill required fields (Name, Roll Number, Email)');
      return;
    }

    const updatedProfile: StudentProfile = {
      id: studentProfile?.id || `std_${formData.rollNo?.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: formData.name || '',
      email: formData.email || '',
      rollNo: formData.rollNo || '',
      department: formData.department || 'Computer Engineering',
      degree: formData.degree || 'B.Tech',
      batch: formData.batch || '2022 - 2026',
      graduationYear: Number(formData.graduationYear) || 2026,
      cgpa: Number(formData.cgpa) || 8.0,
      avatar: formData.avatar || '',
      bio: formData.bio || '',
      githubUrl: formData.githubUrl || '',
      portfolioUrl: formData.portfolioUrl || '',
      linkedinUrl: formData.linkedinUrl || '',
      phone: formData.phone || '',
      activeBacklogs: Number(formData.activeBacklogs) || 0,
      placementStatus: (formData.placementStatus as any) || 'Eligible',
      projects: studentProfile?.projects || []
    };

    await updateStudentProfile(updatedProfile);
    setIsEditing(false);
  };

  if (!studentProfile && !isEditing) {
    return (
      <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mx-auto">
          <UserCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No Student Profile Registered
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Operating under Live Data Policy. No mock student accounts are seeded. Configure your real university credentials to enable eligibility checks, resume compilation, and application logging.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Real Student Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Edit Profile Modal / Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-brand-600" />
              {studentProfile ? 'Update Student Profile' : 'Register Real Student Profile'}
            </h2>
            {studentProfile && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                placeholder="e.g. Bhumit Gupta"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">College Email *</label>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                placeholder="bhumit.gupta@dypatil.edu"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">University Roll Number *</label>
              <input
                type="text"
                required
                value={formData.rollNo || ''}
                onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                placeholder="e.g. 21CS1044"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
              <input
                type="text"
                value={formData.department || ''}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                placeholder="Computer Science & Engineering"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Degree</label>
              <input
                type="text"
                value={formData.degree || ''}
                onChange={e => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                placeholder="Bachelor of Technology (B.Tech)"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Cumulative CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa || 8.0}
                onChange={e => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Batch</label>
              <input
                type="text"
                value={formData.batch || ''}
                onChange={e => setFormData({ ...formData, batch: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                placeholder="2022 - 2026"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Graduation Year</label>
              <input
                type="number"
                value={formData.graduationYear || 2026}
                onChange={e => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Active Backlogs</label>
              <input
                type="number"
                min="0"
                value={formData.activeBacklogs || 0}
                onChange={e => setFormData({ ...formData, activeBacklogs: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">GitHub Profile URL</label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Portfolio Website URL</label>
              <input
                type="url"
                value={formData.portfolioUrl || ''}
                onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Short Bio / Technical Summary</label>
            <textarea
              rows={3}
              value={formData.bio || ''}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              placeholder="e.g. Software engineering student focused on distributed backend architectures..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {studentProfile && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-xs inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Real Profile
            </button>
          </div>
        </form>
      )}

      {/* Student Banner */}
      {studentProfile && (
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {studentProfile.avatar ? (
              <img
                src={studentProfile.avatar}
                alt={studentProfile.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center font-bold text-2xl text-brand-600">
                {studentProfile.name[0]}
              </div>
            )}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  {studentProfile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {studentProfile.placementStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {studentProfile.degree} in {studentProfile.department}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                {studentProfile.bio || 'No personal bio added yet.'}
              </p>
            </div>
          </div>

          {/* Links & Edit button */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={() => {
                setFormData(studentProfile);
                setIsEditing(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            {studentProfile.githubUrl && (
              <a
                href={studentProfile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {studentProfile.portfolioUrl && (
              <a
                href={studentProfile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {studentProfile.linkedinUrl && (
              <a
                href={studentProfile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Academic Credentials Grid */}
      {studentProfile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>Academic Performance</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {studentProfile.cgpa}
              </span>
              <span className="text-xs text-slate-400">/ 10.00 Cumulative</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {studentProfile.activeBacklogs === 0
                ? '0 Active Backlogs (Eligible for all drives)'
                : `${studentProfile.activeBacklogs} Active Backlogs`}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>Batch & Department</span>
            </div>
            <div className="space-y-1">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {studentProfile.batch}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Roll: {studentProfile.rollNo} • Graduating {studentProfile.graduationYear}
              </p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              {studentProfile.department}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <Mail className="w-4 h-4 text-brand-600" />
              <span>Contact Coordinates</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-slate-800 dark:text-slate-200 font-medium truncate">
                {studentProfile.email}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                {studentProfile.phone || 'No phone number added'}
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Candidate Authenticated
            </div>
          </div>
        </div>
      )}

      {/* Featured Projects with Evidence */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-600" />
              Verified Engineering Projects
            </h2>
            <p className="text-xs text-slate-500">
              Evidence artifacts submitted for technical recruiter review
            </p>
          </div>
        </div>

        {studentProfile?.projects && studentProfile.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {studentProfile.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-500/50 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">
                      {proj.title}
                    </h3>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-500">No project evidence links logged yet.</p>
            <p className="text-[11px] text-slate-400">
              Add your verified GitHub repositories and deployed live projects to demonstrate hands-on software engineering capabilities to visiting recruiters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
