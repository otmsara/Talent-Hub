import React from "react";
import {
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  BookOpen,
  Code,
  Building,
  GraduationCap,
  Award,
  Languages,
  Info,
} from "lucide-react";

interface ResumeDisplayProps {
  resumeData: string;
  parsedSections: Record<string, string>;
}

export const ResumeDisplay = ({ resumeData, parsedSections }: ResumeDisplayProps) => {
  // Extract name and title from header section
  const headerLines = parsedSections.header?.split("\n") || [];
  const name = headerLines[0]?.trim() || "";
  const title = headerLines[1]?.trim() || "";

  // Extract contact info
  const contactLine = headerLines[2] || "";
  const email = contactLine.match(/📧\s*([^|]+)/) ? contactLine.match(/📧\s*([^|]+)/)?.[1].trim() : "";
  const phone = contactLine.match(/📞\s*([^|]+)/) ? contactLine.match(/📞\s*([^|]+)/)?.[1].trim() : "";

  // Extract links
  const linksLine = headerLines[3] || "";
  const website = linksLine.match(/🌐\s*([^|]+)/) ? linksLine.match(/🌐\s*([^|]+)/)?.[1].trim() : "";
  const github = linksLine.match(/GitHub:\s*([^|]+)/) ? linksLine.match(/GitHub:\s*([^|]+)/)?.[1].trim() : "";
  const linkedin = linksLine.match(/LinkedIn:\s*([^|]+)/) ? linksLine.match(/LinkedIn:\s*([^|]+)/)?.[1].trim() : "";

  // If we don't have parsed sections but have raw data, display it directly
  if (Object.keys(parsedSections).length === 0 && resumeData) {
    return (
      <div className="p-8 max-w-[850px] mx-auto">
        <pre className="whitespace-pre-wrap text-sm">{resumeData}</pre>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[850px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-1">{name}</h1>
        <h2 className="text-xl font-medium text-blue-700 mb-4">{title}</h2>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>{email}</span>
            </div>
          )}

          {phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{phone}</span>
            </div>
          )}

          {website && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                {website}
              </a>
            </div>
          )}

          {github && (
            <div className="flex items-center gap-1.5">
              <Github className="w-4 h-4 text-blue-600" />
              <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                {github}
              </a>
            </div>
          )}

          {linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-4 h-4 text-blue-600" />
              <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                {linkedin}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {parsedSections["professional summary"] && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-200">
            <div className="text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-blue-800">Professional Summary</h2>
          </div>
          <div className="pl-1">
            <p className="text-sm mb-2">{parsedSections["professional summary"]}</p>
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {parsedSections["technical skills"] && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-200">
            <div className="text-blue-600">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-blue-800">Technical Skills</h2>
          </div>
          <div className="pl-1">
            {parsedSections["technical skills"].split("\n").map((line, i) => {
              if (line.trim().startsWith("-")) {
                const skillLine = line.replace(/^-\s*/, "").trim();
                const category = skillLine.match(/\*\*(.*?):\*\*/);

                if (category) {
                  const categoryName = category[1];
                  const skills = skillLine.replace(/\*\*(.*?):\*\*\s*/, "").split(", ");

                  return (
                    <div key={i} className="mb-3">
                      <p className="text-sm font-semibold mb-1.5">{categoryName}:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, j) => (
                          <span key={j} className="px-2 py-1 bg-blue-50 text-blue-800 rounded-md text-xs font-medium">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={i} className="flex items-start gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                      <p className="text-sm">{skillLine}</p>
                    </div>
                  );
                }
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {parsedSections["professional experience"] && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-200">
            <div className="text-blue-600">
              <Building className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-blue-800">Professional Experience</h2>
          </div>
          <div className="space-y-4 pl-1">
            {parsedSections["professional experience"].split("\n\n").map((expBlock, i) => {
              const lines = expBlock.split("\n");
              const titleLine = lines[0] || "";
              const dateLine = lines[1] || "";
              const bullets = lines.slice(2).filter((line) => line.trim().startsWith("-"));

              const titleMatch = titleLine.match(/\*\*(.*?)\*\*\s*—\s*(.*)/);
              if (!titleMatch) return null;

              const company = titleMatch[1];
              const role = titleMatch[2];
              const date = dateLine.replace(/_/g, "").trim();

              return (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-sm font-bold">{role}</h3>
                      <p className="text-sm text-blue-700">{company}</p>
                    </div>
                    <p className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{date}</p>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                        <p className="text-sm">{bullet.replace(/^-\s*/, "")}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Projects */}
      {parsedSections["key projects"] && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-200">
            <div className="text-blue-600">
              <Code className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-blue-800">Key Projects</h2>
          </div>
          <div className="space-y-4 pl-1">
            {parsedSections["key projects"].split("\n\n").map((projectBlock, i) => {
              const lines = projectBlock.split("\n");
              const titleLine = lines[0] || "";
              const techLine = lines[1] || "";
              const bullets = lines.slice(2).filter((line) => line.trim().startsWith("-"));

              const projectName = titleLine.replace(/\*\*/g, "").trim();
              const tech = techLine
                .replace(/_Technologies:\s*/, "")
                .replace(/_/g, "")
                .trim();

              return (
                <div key={i} className="mb-4">
                  <div className="mb-1">
                    <h3 className="text-sm font-bold">{projectName}</h3>
                    <p className="text-xs text-blue-700 mb-1">{tech}</p>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                        <p className="text-sm">{bullet.replace(/^-\s*/, "")}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {parsedSections["education"] && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-200">
            <div className="text-blue-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-blue-800">Education</h2>
          </div>
          <div className="pl-1">
            {parsedSections["education"].split("\n").map((line, i) => (
              <p key={i} className="text-sm mb-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {parsedSections["certifications"] && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-200">
            <div className="text-blue-600">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-blue-800">Certifications</h2>
          </div>
          <div className="pl-1">
            {parsedSections["certifications"].split("\n").map((line, i) => {
              if (line.trim().startsWith("-")) {
                return (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                    <p className="text-sm">{line.replace(/^-\s*/, "")}</p>
                  </div>
                );
              }
              return (
                <p key={i} className="text-sm mb-2">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* Languages */}
      {parsedSections["languages"] && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-200">
            <div className="text-blue-600">
              <Languages className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-blue-800">Languages</h2>
          </div>
          <div className="pl-1">
            {parsedSections["languages"].split("\n").map((line, i) => {
              if (line.trim().startsWith("-")) {
                return (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                    <p className="text-sm">{line.replace(/^-\s*/, "")}</p>
                  </div>
                );
              }
              return (
                <p key={i} className="text-sm mb-2">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {parsedSections["additional information & development plan"] && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-200">
            <div className="text-blue-600">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-blue-800">Additional Information</h2>
          </div>
          <div className="pl-1">
            {parsedSections["additional information & development plan"].split("\n").map((line, i) => {
              if (line.trim().startsWith("-")) {
                return (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></div>
                    <p className="text-sm">{line.replace(/^-\s*/, "")}</p>
                  </div>
                );
              }
              return (
                <p key={i} className="text-sm mb-2">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {parsedSections["summary"] && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm italic text-gray-600">{parsedSections["summary"]}</p>
        </div>
      )}

      {/* Fallback for any unparsed content */}
      {Object.keys(parsedSections).length === 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            Unable to parse resume content. Please check the format of your resume data.
          </p>
          <pre className="mt-2 text-xs overflow-auto max-h-[200px] p-2 bg-gray-50 rounded border border-gray-200">
            {resumeData}
          </pre>
        </div>
      )}
    </div>
  );
};