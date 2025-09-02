import React from "react";
import { useParams, Link } from "react-router-dom";
import { projects, currentUser } from "../data/dummyData";

const fakeComments = [
  {
    id: "c1",
    user: { name: "Alice Johnson", username: "alicejohnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    text: "This project is awesome! How can I help?",
    createdAt: "1h ago"
  },
  {
    id: "c2",
    user: { name: "Michael Chen", username: "michaelchen", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    text: "Looking forward to collaborating on this.",
    createdAt: "45m ago"
  },
  {
    id: "c3",
    user: { name: "You", username: currentUser.username, avatar: currentUser.avatar },
    text: "Welcome to the project thread! Let's build something great.",
    createdAt: "just now"
  }
];

const ProjectThreadDemo = () => {
  // For demo, get projectId from URL and find the project
  const { projectId } = useParams();
  const project = projects.find((p) => String(p.id) === String(projectId));

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white/5 border border-border rounded-2xl p-8 text-center text-muted-foreground shadow">
          Project not found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white/5 border border-border rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">{project.text || "Untitled Project"}</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {project.contributorsNeeded && project.contributorsNeeded.map((c: string) => (
            <span
              key={c}
              className="bg-cyan-400/10 text-cyan-200 px-2 py-0.5 rounded text-xs"
            >
              {c}
            </span>
          ))}
        </div>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-cyan-300 underline text-sm break-all"
          >
            {project.link}
          </a>
        )}
        <div className="mt-4">
          <Link to="/projects" className="text-cyan-300 underline text-sm">
            ← Back to Projects
          </Link>
        </div>
      </div>
      <div className="bg-white/5 border border-border rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Thread</h3>
        <div className="space-y-4">
          {fakeComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
              <div>
                <div className="font-medium text-foreground">{comment.user.name}</div>
                <div className="text-xs text-muted-foreground mb-1">@{comment.user.username} • {comment.createdAt}</div>
                <div className="text-foreground">{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectThreadDemo;
