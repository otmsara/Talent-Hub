// --- EXPANDABLE PROJECTS TABLE ---
import React, { useState } from "react";
import { useAccount } from "../contexts/AccountContext";
import { projects } from "../data/dummyData";
import { Link } from "react-router-dom";
import { findUserById } from "../data/dummyData";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import ExaChatbot from "../components/projects/ExaChatbot";

const Projects = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { currentUser } = useAccount();
  const userId = currentUser?.id;
  const userProjects = projects().filter(
    (project) =>
      userId &&
      ((Array.isArray(project.collaborators) && project.collaborators.includes(userId)) ||
      project.userId === userId)
  );

  const getUserRole = (project: any) => {
    if (project.userId === userId) return "Owner";
    if (Array.isArray(project.collaborators) && project.collaborators.includes(userId)) return "Collaborator";
    return "Contributor";
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <ExaChatbot />
      <h1 className="text-2xl font-bold text-foreground mb-6">Projects You're Contributing To</h1>
      {userProjects.length === 0 ? (
        <div className="bg-white/5 border border-border rounded-2xl p-8 text-center text-muted-foreground shadow">
          You are not contributing to any projects yet.
        </div>
      ) : (
        <>
          {/* Mobile: Card/List layout */}
          <div className="flex flex-col gap-4 md:hidden">
            {userProjects.map((project) => {
              let owner;
              try {
                owner = findUserById(project.userId);
              } catch {
                owner = null;
              }
              const isExpanded = expandedId === project.id;
              return (
                <div
                  key={project.id}
                  className="bg-white/5 border border-border rounded-2xl shadow p-4"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                  >
                    <div>
                      <div className="font-semibold text-foreground">{project.name || project.text || "Untitled Project"}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-400/20 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.2)]">
                          Project
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">
                          {project.status || "In progress"}
                        </span>
                      </div>
                    </div>
                    <button className="text-cyan-300 underline text-xs font-medium">
                      {isExpanded ? "Hide" : "Details"}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {owner ? (
                      <>
                        <img
                          src={owner.avatar}
                          alt={owner.name}
                          className="w-6 h-6 rounded-full border border-border"
                        />
                        <span className="text-xs text-foreground font-medium">{owner.name}</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unknown Owner</span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.collaborators && project.collaborators.length > 0 ? (
                      project.collaborators.map((collabId: string) => {
                        let user;
                        try {
                          user = findUserById(collabId);
                        } catch {
                          user = null;
                        }
                        if (!user) return null;
                        return (
                          <div key={collabId} className="flex items-center gap-1">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-5 h-5 rounded-full border border-border"
                            />
                            <span className="text-xs text-foreground">{user.name}</span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground">No collaborators</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <Link
                      to={`/post/${project.id}`}
                      className="text-cyan-300 underline text-xs font-medium"
                      onClick={e => e.stopPropagation()}
                    >
                      View Project
                    </Link>
                  </div>
                  {isExpanded && (
                    <div className="mt-4 bg-cyan-900/10 rounded p-3">
                      <div className="mb-2">
                        <span className="font-semibold text-cyan-300">Next Steps:</span>{" "}
                        <span className="text-foreground">{project.nextSteps || "No next steps provided."}</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-cyan-300">Your Next Task:</span>{" "}
                        <span className="text-foreground">{project.userNextTask || "No task assigned."}</span>
                        <span className="ml-2 text-xs text-cyan-200 bg-cyan-700/30 px-2 py-0.5 rounded">
                          Role: {getUserRole(project)}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-cyan-300">Latest Collaborator Contributions:</span>
                        <ul className="list-disc ml-6 mt-1">
                          {project.collaborators
                            ?.filter((collabId: string) => collabId !== userId)
                            .map((collabId: string) => {
                              let user;
                              try {
                                user = findUserById(collabId);
                              } catch {
                                user = null;
                              }
                              if (!user) return null;
                              // Find latest contribution for this collaborator
                              const latest = Array.isArray(project.contributions)
                                ? project.contributions
                                    .filter((c: any) => c.userId === collabId)
                                    .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())[0]
                                : null;
                              return (
                                <li key={collabId} className="mb-1">
                                  <span className="font-medium text-foreground">{user.name}:</span>{" "}
                                  {latest ? (
                                    <span className="text-foreground">
                                      {latest.type === "code" && (
                                        <span>Code: <a href={latest.content} className="underline text-cyan-300" target="_blank" rel="noopener noreferrer">{latest.content}</a></span>
                                      )}
                                      {latest.type === "image" && (
                                        <span>Image: <a href={latest.content} className="underline text-cyan-300" target="_blank" rel="noopener noreferrer">{latest.content}</a></span>
                                      )}
                                      {latest.type === "text" && <span>{latest.content}</span>}
                                      {latest.type === "pdf" && (
                                        <span>PDF: <a href={latest.content} className="underline text-cyan-300" target="_blank" rel="noopener noreferrer">{latest.content}</a></span>
                                      )}
                                      {latest.type === "video" && (
                                        <span>Video: <a href={latest.content} className="underline text-cyan-300" target="_blank" rel="noopener noreferrer">{latest.content}</a></span>
                                      )}
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        ({latest.createdAt.toLocaleString()})
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">No recent contributions.</span>
                                  )}
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-cyan-300">Run EXAs, experience augmentation agents:</span>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {["Genesis.EXA", "Coordinator.EXA", "Guide.EXA", "Summarizer.EXA", "Seeker.EXA", "Record.EXA"].map((exa) => (
                            <button
                              key={exa}
                              className="flex flex-col items-center px-2 py-1 bg-cyan-800/40 rounded hover:bg-cyan-700/60 transition"
                              style={{ minWidth: 70 }}
                              onClick={() => window.dispatchEvent(new CustomEvent('open-exa-chat', { detail: { exa } }))}
                            >
                              <img
                                src="/exa-logo.png"
                                alt={exa + ' logo'}
                                style={{ width: 32, height: 32, objectFit: 'contain', marginBottom: 2 }}
                              />
                              <span className="text-xs text-cyan-100 mt-1">{exa}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Desktop: Table layout */}
          <div className="bg-white/5 border border-border rounded-2xl shadow p-0 overflow-x-auto hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4 text-white">Project Name</TableHead>
                  <TableHead className="w-1/6 text-white">Owner</TableHead>
                  <TableHead className="w-1/4 text-white">Collaborators</TableHead>
                  <TableHead className="w-1/6 text-white">Status</TableHead>
                  <TableHead className="w-1/6 text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProjects.map((project) => {
                  let owner;
                  try {
                    owner = findUserById(project.userId);
                  } catch {
                    owner = null;
                  }
                  const isExpanded = expandedId === project.id;
                  return (
                    <React.Fragment key={project.id}>
                      <TableRow
                        className="hover:bg-cyan-400/10 transition cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : project.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{project.name || project.text || "Untitled Project"}</span>
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-400/20 text-cyan-200 shadow-[0_0_8px_2px_rgba(34,211,238,0.2)]">
                              Project
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {owner ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={owner.avatar}
                                alt={owner.name}
                                className="w-6 h-6 rounded-full border border-border"
                              />
                              <span className="text-sm text-foreground font-medium">{owner.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Unknown</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {project.collaborators && project.collaborators.length > 0 ? (
                              project.collaborators.map((collabId: string) => {
                                let user;
                                try {
                                  user = findUserById(collabId);
                                } catch {
                                  user = null;
                                }
                                if (!user) return null;
                                return (
                                  <div key={collabId} className="flex items-center gap-1">
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-5 h-5 rounded-full border border-border"
                                    />
                                    <span className="text-xs text-foreground">{user.name}</span>
                                  </div>
                                );
                              })
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-foreground">
                            {project.status || "In progress"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/post/${project.id}`}
                            className="text-cyan-300 underline text-sm font-medium"
                            onClick={e => e.stopPropagation()}
                          >
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow className="bg-cyan-900/10">
                          <TableCell colSpan={5}>
                            <div className="py-4 px-2">
                              <div className="mb-2">
                                <span className="font-semibold text-cyan-300">Next Steps:</span>{" "}
                                <span className="text-foreground">{project.nextSteps || "No next steps provided."}</span>
                              </div>
                              <div className="mb-2">
                                <span className="font-semibold text-cyan-300">Your Next Task:</span>{" "}
                                <span className="text-foreground">{project.userNextTask || "No task assigned."}</span>
                                <span className="ml-2 text-xs text-cyan-200 bg-cyan-700/30 px-2 py-0.5 rounded">
                                  Role: {getUserRole(project)}
                                </span>
                              </div>
                              <div className="mb-2">
                                <span className="font-semibold text-cyan-300">Latest Collaborator Contributions:</span>
                                <ul className="list-disc ml-6 mt-1">
                                  {project.collaborators
                                    ?.filter((collabId: string) => collabId !== userId)
                                    .map((collabId: string) => {
                                      let user;
                                      try {
                                        user = findUserById(collabId);
                                      } catch {
                                        user = null;
                                      }
                                      if (!user) return null;
                                      // Find latest contribution for this collaborator
                                      const latest = Array.isArray(project.contributions)
                                        ? project.contributions
                                            .filter((c: any) => c.userId === collabId)
                                            .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())[0]
                                        : null;
                                      return (
                                        <li key={collabId} className="mb-1">
                                          <span className="font-medium text-foreground">{user.name}:</span>{" "}
                                          {latest ? (
                                            <span className="text-foreground">
                                              {latest.type === "code" && (
                                                <span>Code: <a href={latest.content} className="underline text-cyan-300" target="_blank" rel="noopener noreferrer">{latest.content}</a></span>
                                              )}
                                              {latest.type === "image" && (
                                                <span>Image: <a href={latest.content} className="underline text-cyan-300" target="_blank" rel="noopener noreferrer">{latest.content}</a></span>
                                              )}
                                              {latest.type === "text" && <span>{latest.content}</span>}
                                              {latest.type === "pdf" && (
                                                <span>PDF: <a href={latest.content} className="underline text-cyan-300" target="_blank" rel="noopener noreferrer">{latest.content}</a></span>
                                              )}
                                              {latest.type === "video" && (
                                                <span>Video: <a href={latest.content} className="underline text-cyan-300" target="_blank" rel="noopener noreferrer">{latest.content}</a></span>
                                              )}
                                              <span className="ml-2 text-xs text-muted-foreground">
                                                ({latest.createdAt.toLocaleString()})
                                              </span>
                                            </span>
                                          ) : (
                                            <span className="text-muted-foreground">No recent contributions.</span>
                                          )}
                                        </li>
                                      );
                                    })}
                                </ul>
                              </div>
                              <div className="mb-2">
                                <span className="font-semibold text-cyan-300">Run EXAs, experience augmentation agents:</span>
                                <div className="flex gap-3 mt-2">
                                  {["Genesis.EXA", "Coordinator.EXA", "Guide.EXA", "Summarizer.EXA", "Seeker.EXA", "Record.EXA"].map((exa) => (
                                    <button
                                      key={exa}
                                      className="flex flex-col items-center px-2 py-1 bg-cyan-800/40 rounded hover:bg-cyan-700/60 transition"
                                      style={{ minWidth: 70 }}
                                      onClick={() => window.dispatchEvent(new CustomEvent('open-exa-chat', { detail: { exa } }))}
                                    >
                                      <img
                                        src="/exa-logo.png"
                                        alt={exa + ' logo'}
                                        style={{ width: 32, height: 32, objectFit: 'contain', marginBottom: 2 }}
                                      />
                                      <span className="text-xs text-cyan-100 mt-1">{exa}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;
