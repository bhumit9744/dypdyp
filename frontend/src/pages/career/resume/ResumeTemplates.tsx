import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Code2,
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { ResumeContent, StylingConfig, ProjectItem, ExperienceItem } from '../../../types/resume';

interface TemplateProps {
  content: ResumeContent;
  styling: StylingConfig;
  sectionsOrder: string[];
  isEditing: boolean;
  onUpdateContent: (updated: ResumeContent) => void;
}

export const ResumeTemplateRenderer: React.FC<
  TemplateProps & { templateId: string }
> = ({ templateId, ...props }) => {
  switch (templateId) {
    case 'modern-minimal':
      return <ModernMinimalTemplate {...props} />;
    case 'technical-ats':
      return <TechnicalAtsTemplate {...props} />;
    case 'software-engineer':
      return <SoftwareEngineerTemplate {...props} />;
    case 'data-ai':
      return <DataAiTemplate {...props} />;
    case 'creative-professional':
      return <CreativeProfessionalTemplate {...props} />;
    case 'classic-professional':
    default:
      return <ClassicProfessionalTemplate {...props} />;
  }
};

/* =========================================================================
 * Helper: Editable Text Block
 * ========================================================================= */
interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  isEditing: boolean;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  isEditing,
  className = '',
  placeholder = 'Click to edit...',
  multiline = false
}) => {
  if (!isEditing) {
    return <span className={className}>{value || placeholder}</span>;
  }

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className={`w-full bg-slate-50/50 hover:bg-slate-100/80 focus:bg-white border border-transparent hover:border-slate-300 focus:border-brand-500 rounded px-1.5 py-0.5 outline-none transition-colors resize-y ${className}`}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-slate-50/50 hover:bg-slate-100/80 focus:bg-white border border-transparent hover:border-slate-300 focus:border-brand-500 rounded px-1.5 py-0.5 outline-none transition-colors ${className}`}
    />
  );
};

/* =========================================================================
 * Helper: Styling class generators
 * ========================================================================= */
const getFontFamilyClass = (family: string) => {
  switch (family) {
    case 'serif':
      return 'font-serif';
    case 'mono':
      return 'font-mono';
    case 'garamond':
      return 'font-serif tracking-normal';
    case 'inter':
    default:
      return 'font-sans';
  }
};

const getFontSizeClass = (size: string) => {
  switch (size) {
    case '9pt':
      return 'text-[11px] leading-[1.3]';
    case '11pt':
      return 'text-[13px] leading-[1.5]';
    case '10pt':
    default:
      return 'text-[12px] leading-[1.4]';
  }
};

const getMarginsClass = (margins: string) => {
  switch (margins) {
    case 'compact':
      return 'p-6';
    case 'spacious':
      return 'p-12';
    case 'standard':
    default:
      return 'p-8';
  }
};

/* =========================================================================
 * 1. Classic Professional Template (Conservative single-column ATS)
 * ========================================================================= */
export const ClassicProfessionalTemplate: React.FC<TemplateProps> = ({
  content,
  styling,
  sectionsOrder,
  isEditing,
  onUpdateContent
}) => {
  const { contact, summary, education, skills, experience, projects, certifications, achievements } = content;
  const accent = styling.accent_color || '#1e293b';

  return (
    <div
      className={`min-h-[297mm] text-slate-800 bg-white ${getFontFamilyClass(
        styling.font_family
      )} ${getFontSizeClass(styling.font_size)} ${getMarginsClass(styling.margins)}`}
    >
      {/* Header */}
      <header className="text-center pb-4 border-b border-slate-300">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
          <EditableText
            value={contact.full_name}
            onChange={(val) =>
              onUpdateContent({ ...content, contact: { ...contact, full_name: val } })
            }
            isEditing={isEditing}
            className="text-center font-bold"
          />
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs text-slate-600">
          <EditableText
            value={contact.email}
            onChange={(val) =>
              onUpdateContent({ ...content, contact: { ...contact, email: val } })
            }
            isEditing={isEditing}
          />
          <span>•</span>
          <EditableText
            value={contact.phone}
            onChange={(val) =>
              onUpdateContent({ ...content, contact: { ...contact, phone: val } })
            }
            isEditing={isEditing}
          />
          <span>•</span>
          <EditableText
            value={contact.location}
            onChange={(val) =>
              onUpdateContent({ ...content, contact: { ...contact, location: val } })
            }
            isEditing={isEditing}
          />
          {contact.linkedin && (
            <>
              <span>•</span>
              <EditableText
                value={contact.linkedin}
                onChange={(val) =>
                  onUpdateContent({ ...content, contact: { ...contact, linkedin: val } })
                }
                isEditing={isEditing}
              />
            </>
          )}
          {contact.github && (
            <>
              <span>•</span>
              <EditableText
                value={contact.github}
                onChange={(val) =>
                  onUpdateContent({ ...content, contact: { ...contact, github: val } })
                }
                isEditing={isEditing}
              />
            </>
          )}
        </div>
      </header>

      {/* Sections dynamically ordered */}
      <main className="space-y-4 mt-4">
        {sectionsOrder.map((sectionKey) => {
          if (sectionKey === 'summary' && summary) {
            return (
              <section key="summary" className="space-y-1.5">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-300"
                  style={{ color: accent }}
                >
                  Professional Summary
                </h2>
                <EditableText
                  value={summary}
                  onChange={(val) => onUpdateContent({ ...content, summary: val })}
                  isEditing={isEditing}
                  multiline
                  className="text-slate-700 leading-relaxed block"
                />
              </section>
            );
          }

          if (sectionKey === 'education' && education.length > 0) {
            return (
              <section key="education" className="space-y-2">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-300"
                  style={{ color: accent }}
                >
                  Education
                </h2>
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-semibold text-slate-900">
                      <EditableText
                        value={edu.institution}
                        onChange={(val) => {
                          const updated = [...education];
                          updated[idx].institution = val;
                          onUpdateContent({ ...content, education: updated });
                        }}
                        isEditing={isEditing}
                      />
                      <span className="text-xs text-slate-600 font-normal">
                        {edu.start_year} – {edu.end_year}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-slate-700">
                      <EditableText
                        value={edu.degree}
                        onChange={(val) => {
                          const updated = [...education];
                          updated[idx].degree = val;
                          onUpdateContent({ ...content, education: updated });
                        }}
                        isEditing={isEditing}
                      />
                      {edu.score_or_cgpa && (
                        <span className="text-xs font-medium text-slate-700">
                          {edu.score_or_cgpa}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionKey === 'skills' && skills.length > 0) {
            return (
              <section key="skills" className="space-y-1.5">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-300"
                  style={{ color: accent }}
                >
                  Technical Skills
                </h2>
                <div className="space-y-1">
                  {skills.map((group, idx) => (
                    <div key={idx} className="flex gap-2 text-slate-700">
                      <span className="font-semibold min-w-[120px] text-slate-900">
                        {group.category}:
                      </span>
                      <span>{group.items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'experience' && experience.length > 0) {
            return (
              <section key="experience" className="space-y-2.5">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-300"
                  style={{ color: accent }}
                >
                  Professional Experience
                </h2>
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-xs text-slate-600">
                        {exp.start_date} – {exp.current ? 'Present' : exp.end_date}
                      </span>
                    </div>
                    <div className="text-slate-700 font-medium italic">{exp.company}</div>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx}>
                          <EditableText
                            value={b}
                            onChange={(val) => {
                              const updated = [...experience];
                              updated[idx].bullets[bIdx] = val;
                              onUpdateContent({ ...content, experience: updated });
                            }}
                            isEditing={isEditing}
                            multiline
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionKey === 'projects' && projects.length > 0) {
            return (
              <section key="projects" className="space-y-2.5">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-300"
                  style={{ color: accent }}
                >
                  Technical Projects
                </h2>
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{proj.title}</span>
                        {proj.tech_stack && proj.tech_stack.length > 0 && (
                          <span className="text-xs text-slate-500 font-normal">
                            | {proj.tech_stack.join(', ')}
                          </span>
                        )}
                      </div>
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-brand-600 hover:underline flex items-center gap-1"
                        >
                          <Code2 className="w-3 h-3" />
                          Code
                        </a>
                      )}
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx}>
                          <EditableText
                            value={b}
                            onChange={(val) => {
                              const updated = [...projects];
                              updated[idx].bullets[bIdx] = val;
                              onUpdateContent({ ...content, projects: updated });
                            }}
                            isEditing={isEditing}
                            multiline
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionKey === 'certifications' && certifications && certifications.length > 0) {
            return (
              <section key="certifications" className="space-y-1">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-300"
                  style={{ color: accent }}
                >
                  Certifications
                </h2>
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                  {certifications.map((cert, idx) => (
                    <li key={idx}>
                      <span className="font-semibold text-slate-900">{cert.name}</span>
                      {cert.issuer && <span> — {cert.issuer}</span>}
                      {cert.issue_date && <span className="text-xs text-slate-500"> ({cert.issue_date})</span>}
                    </li>
                  ))}
                </ul>
              </section>
            );
          }

          if (sectionKey === 'achievements' && achievements && achievements.length > 0) {
            return (
              <section key="achievements" className="space-y-1">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-300"
                  style={{ color: accent }}
                >
                  Honors & Achievements
                </h2>
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                  {achievements.map((ach, idx) => (
                    <li key={idx}>{ach}</li>
                  ))}
                </ul>
              </section>
            );
          }

          return null;
        })}
      </main>
    </div>
  );
};

/* =========================================================================
 * 2. Modern Minimal Template (Airy modern tech, refined typography)
 * ========================================================================= */
export const ModernMinimalTemplate: React.FC<TemplateProps> = ({
  content,
  styling,
  sectionsOrder,
  isEditing,
  onUpdateContent
}) => {
  const { contact, summary, education, skills, experience, projects, certifications } = content;
  const accent = styling.accent_color || '#2563eb';

  return (
    <div
      className={`min-h-[297mm] text-slate-700 bg-white ${getFontFamilyClass(
        styling.font_family
      )} ${getFontSizeClass(styling.font_size)} ${getMarginsClass(styling.margins)}`}
    >
      <header className="pb-4 mb-4 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            <EditableText
              value={contact.full_name}
              onChange={(val) =>
                onUpdateContent({ ...content, contact: { ...contact, full_name: val } })
              }
              isEditing={isEditing}
            />
          </h1>
          <p className="text-sm font-medium mt-0.5" style={{ color: accent }}>
            {summary.slice(0, 50)}...
          </p>
        </div>
        <div className="text-right text-xs space-y-0.5 text-slate-500">
          <div>{contact.email}</div>
          <div>{contact.phone}</div>
          <div>{contact.location}</div>
          {contact.github && <div className="text-slate-600 font-mono text-[10px]">{contact.github}</div>}
        </div>
      </header>

      <main className="space-y-5">
        {sectionsOrder.map((sectionKey) => {
          if (sectionKey === 'summary' && summary) {
            return (
              <section key="summary" className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Profile
                </h3>
                <p className="text-slate-700 leading-relaxed">{summary}</p>
              </section>
            );
          }

          if (sectionKey === 'skills' && skills.length > 0) {
            return (
              <section key="skills" className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Technical Stack
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {skills.map((s, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-50/80 border border-slate-100">
                      <div className="font-semibold text-xs text-slate-900 mb-1">{s.category}</div>
                      <div className="text-xs text-slate-600">{s.items.join(' • ')}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (sectionKey === 'projects' && projects.length > 0) {
            return (
              <section key="projects" className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Featured Projects
                </h3>
                {projects.map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{p.title}</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {p.tech_stack?.join(', ')}
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-600">
                      {p.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionKey === 'experience' && experience.length > 0) {
            return (
              <section key="experience" className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Experience
                </h3>
                {experience.map((e, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline font-semibold text-slate-900">
                      <span>{e.role} — {e.company}</span>
                      <span className="text-xs text-slate-400 font-normal">
                        {e.start_date} – {e.current ? 'Present' : e.end_date}
                      </span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-600">
                      {e.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionKey === 'education' && education.length > 0) {
            return (
              <section key="education" className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Education
                </h3>
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-slate-900">{edu.institution}</span>
                      <div className="text-slate-600">{edu.degree}</div>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-semibold text-slate-900">{edu.score_or_cgpa}</span>
                      <div className="text-slate-400">{edu.start_year} – {edu.end_year}</div>
                    </div>
                  </div>
                ))}
              </section>
            );
          }

          return null;
        })}
      </main>
    </div>
  );
};

/* =========================================================================
 * 3. Technical ATS Template (Compact, structured parsing density)
 * ========================================================================= */
export const TechnicalAtsTemplate: React.FC<TemplateProps> = ({
  content,
  styling,
  sectionsOrder,
  isEditing,
  onUpdateContent
}) => {
  const { contact, summary, education, skills, experience, projects, certifications } = content;
  const accent = styling.accent_color || '#0f766e';

  return (
    <div
      className={`min-h-[297mm] text-slate-800 bg-white ${getFontFamilyClass(
        styling.font_family
      )} ${getFontSizeClass(styling.font_size)} ${getMarginsClass(styling.margins)}`}
    >
      <header className="border-b-2 pb-2 text-center" style={{ borderColor: accent }}>
        <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
          <EditableText
            value={contact.full_name}
            onChange={(val) =>
              onUpdateContent({ ...content, contact: { ...contact, full_name: val } })
            }
            isEditing={isEditing}
          />
        </h1>
        <div className="mt-1 text-xs font-mono text-slate-600 flex flex-wrap justify-center gap-1.5">
          <span>{contact.email}</span>
          <span>|</span>
          <span>{contact.phone}</span>
          <span>|</span>
          <span>{contact.location}</span>
          {contact.github && (
            <>
              <span>|</span>
              <span>{contact.github}</span>
            </>
          )}
          {contact.linkedin && (
            <>
              <span>|</span>
              <span>{contact.linkedin}</span>
            </>
          )}
        </div>
      </header>

      <main className="space-y-3 mt-3">
        {sectionsOrder.map((sectionKey) => {
          if (sectionKey === 'skills' && skills.length > 0) {
            return (
              <section key="skills">
                <div
                  className="font-bold text-xs uppercase px-1.5 py-0.5 text-white mb-1.5"
                  style={{ backgroundColor: accent }}
                >
                  Technical Competencies
                </div>
                <table className="w-full text-xs">
                  <tbody>
                    {skills.map((s, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="font-bold text-slate-900 py-0.5 pr-2 w-36 align-top">
                          {s.category}:
                        </td>
                        <td className="text-slate-700 py-0.5">{s.items.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            );
          }

          if (sectionKey === 'projects' && projects.length > 0) {
            return (
              <section key="projects" className="space-y-2">
                <div
                  className="font-bold text-xs uppercase px-1.5 py-0.5 text-white mb-1.5"
                  style={{ backgroundColor: accent }}
                >
                  Technical Project Implementations
                </div>
                {projects.map((p, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{p.title}</span>
                      <span className="font-mono text-[10px] text-slate-500 font-normal">
                        [{p.tech_stack.join(', ')}]
                      </span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                      {p.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionKey === 'experience' && experience.length > 0) {
            return (
              <section key="experience" className="space-y-2">
                <div
                  className="font-bold text-xs uppercase px-1.5 py-0.5 text-white mb-1.5"
                  style={{ backgroundColor: accent }}
                >
                  Work Experience
                </div>
                {experience.map((e, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{e.role} — {e.company}</span>
                      <span className="text-xs font-normal text-slate-600">
                        {e.start_date} – {e.current ? 'Present' : e.end_date}
                      </span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                      {e.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          }

          if (sectionKey === 'education' && education.length > 0) {
            return (
              <section key="education" className="space-y-1.5">
                <div
                  className="font-bold text-xs uppercase px-1.5 py-0.5 text-white mb-1.5"
                  style={{ backgroundColor: accent }}
                >
                  Education & Credentials
                </div>
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-baseline text-slate-800">
                    <div>
                      <span className="font-bold">{edu.degree}</span>, {edu.institution}
                    </div>
                    <div className="font-mono text-xs text-slate-600">
                      {edu.score_or_cgpa} | {edu.start_year}–{edu.end_year}
                    </div>
                  </div>
                ))}
              </section>
            );
          }

          return null;
        })}
      </main>
    </div>
  );
};

/* =========================================================================
 * 4. Software Engineer Template (Skills matrix & code repositories top)
 * ========================================================================= */
export const SoftwareEngineerTemplate: React.FC<TemplateProps> = ({
  content,
  styling,
  sectionsOrder,
  isEditing,
  onUpdateContent
}) => {
  const { contact, summary, education, skills, experience, projects } = content;
  const accent = styling.accent_color || '#3b82f6';

  return (
    <div
      className={`min-h-[297mm] text-slate-800 bg-white ${getFontFamilyClass(
        styling.font_family
      )} ${getFontSizeClass(styling.font_size)} ${getMarginsClass(styling.margins)}`}
    >
      <header className="flex justify-between items-start border-b pb-3 border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            <EditableText
              value={contact.full_name}
              onChange={(val) =>
                onUpdateContent({ ...content, contact: { ...contact, full_name: val } })
              }
              isEditing={isEditing}
            />
          </h1>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
            Software Development Engineer
          </div>
        </div>
        <div className="text-right text-xs space-y-0.5">
          <div className="text-slate-600 font-mono">{contact.email}</div>
          <div className="text-slate-600 font-mono">{contact.github}</div>
          <div className="text-slate-500">{contact.location}</div>
        </div>
      </header>

      {/* Prominent Skills Matrix */}
      <section className="my-3 p-2.5 rounded bg-slate-50 border border-slate-200">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Technical Stack Matrix
        </h2>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {skills.map((s, idx) => (
            <div key={idx}>
              <span className="font-bold text-slate-900">{s.category}: </span>
              <span className="text-slate-600">{s.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Projects prioritized */}
      <main className="space-y-4">
        <section className="space-y-2.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
            style={{ color: accent, borderColor: accent }}
          >
            Software Engineering Projects
          </h2>
          {projects.map((p, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900">{p.title}</span>
                <span className="font-mono text-[10px] text-slate-500">
                  Tech: {p.tech_stack.join(', ')}
                </span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {p.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {experience.length > 0 && (
          <section className="space-y-2.5">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
              style={{ color: accent, borderColor: accent }}
            >
              Industry Experience
            </h2>
            {experience.map((e, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{e.role} @ {e.company}</span>
                  <span className="text-xs text-slate-500 font-normal">
                    {e.start_date} – {e.current ? 'Present' : e.end_date}
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {e.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <section className="space-y-1.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
            style={{ color: accent, borderColor: accent }}
          >
            Education & Academic Track Record
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <span className="font-bold text-slate-900">{edu.institution}</span>
                <div className="text-xs text-slate-600">{edu.degree}</div>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-slate-900">{edu.score_or_cgpa}</span>
                <div className="text-slate-500">{edu.start_year} – {edu.end_year}</div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

/* =========================================================================
 * 5. Data & AI Template (Algorithms, metrics & benchmarks emphasized)
 * ========================================================================= */
export const DataAiTemplate: React.FC<TemplateProps> = ({
  content,
  styling,
  sectionsOrder,
  isEditing,
  onUpdateContent
}) => {
  const { contact, summary, education, skills, experience, projects } = content;
  const accent = styling.accent_color || '#7c3aed';

  return (
    <div
      className={`min-h-[297mm] text-slate-800 bg-white ${getFontFamilyClass(
        styling.font_family
      )} ${getFontSizeClass(styling.font_size)} ${getMarginsClass(styling.margins)}`}
    >
      <header className="border-b pb-3 flex justify-between items-center" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            <EditableText
              value={contact.full_name}
              onChange={(val) =>
                onUpdateContent({ ...content, contact: { ...contact, full_name: val } })
              }
              isEditing={isEditing}
            />
          </h1>
          <div className="text-xs font-semibold" style={{ color: accent }}>
            Data Science, Machine Learning & Systems
          </div>
        </div>
        <div className="text-right text-xs text-slate-600 font-mono">
          <div>{contact.email}</div>
          <div>{contact.github}</div>
          <div>{contact.location}</div>
        </div>
      </header>

      <main className="space-y-4 mt-4">
        {summary && (
          <section className="p-3 bg-purple-50/50 rounded border border-purple-100 text-slate-700">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-1">
              Applied Machine Learning Focus
            </h2>
            <p className="text-xs leading-relaxed">{summary}</p>
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b pb-1">
            Data & Modeling Methodologies
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {skills.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="font-bold text-slate-900">{s.category}:</span>
                <span className="text-slate-600">{s.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b pb-1">
            Empirical AI & Quantitative Projects
          </h2>
          {projects.map((p, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{p.title}</span>
                <span className="text-xs font-mono text-purple-700">
                  {p.tech_stack.join(' • ')}
                </span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                {p.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b pb-1">
            Academic Background & Mathematics
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline text-xs">
              <div>
                <span className="font-bold text-slate-900">{edu.institution}</span> — {edu.degree}
              </div>
              <div className="font-mono text-slate-700 font-semibold">{edu.score_or_cgpa}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

/* =========================================================================
 * 6. Creative Professional Template (Restrained hierarchy for Design & Product)
 * ========================================================================= */
export const CreativeProfessionalTemplate: React.FC<TemplateProps> = ({
  content,
  styling,
  sectionsOrder,
  isEditing,
  onUpdateContent
}) => {
  const { contact, summary, education, skills, experience, projects } = content;
  const accent = styling.accent_color || '#ea580c';

  return (
    <div
      className={`min-h-[297mm] text-slate-800 bg-white ${getFontFamilyClass(
        styling.font_family
      )} ${getFontSizeClass(styling.font_size)} flex`}
    >
      {/* Left Sidebar Column (32%) */}
      <aside className="w-[34%] bg-slate-50 p-6 border-r border-slate-200 space-y-5">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            <EditableText
              value={contact.full_name}
              onChange={(val) =>
                onUpdateContent({ ...content, contact: { ...contact, full_name: val } })
              }
              isEditing={isEditing}
            />
          </h1>
          <div className="text-xs font-bold mt-1" style={{ color: accent }}>
            UI/UX & Product Design
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
            Contact
          </div>
          <div>{contact.email}</div>
          <div>{contact.phone}</div>
          <div>{contact.location}</div>
          {contact.portfolio && <div className="text-brand-600 truncate">{contact.portfolio}</div>}
        </div>

        <div className="space-y-2">
          <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
            Core Competencies
          </div>
          {skills.map((s, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="font-semibold text-xs text-slate-800">{s.category}</div>
              <div className="text-xs text-slate-500">{s.items.join(', ')}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
            Education
          </div>
          {education.map((edu, idx) => (
            <div key={idx} className="text-xs">
              <div className="font-bold text-slate-900">{edu.institution}</div>
              <div className="text-slate-600">{edu.degree}</div>
              <div className="text-slate-400 font-mono mt-0.5">
                {edu.score_or_cgpa} ({edu.end_year})
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Body Column (66%) */}
      <main className="w-[66%] p-6 space-y-5">
        {summary && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overview
            </h2>
            <p className="text-slate-700 leading-relaxed text-xs">{summary}</p>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Selected Design Projects
          </h2>
          {projects.map((p, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{p.title}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {p.tech_stack.join(', ')}
                </span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-600">
                {p.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {experience.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Work Experience
            </h2>
            {experience.map((e, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{e.role} @ {e.company}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    {e.start_date} – {e.current ? 'Present' : e.end_date}
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-600">
                  {e.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};
