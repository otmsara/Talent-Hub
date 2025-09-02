import React from "react" // <-- Make sure React is imported for React.isValidElement
import ReactMarkdown from "react-markdown"

import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { Building2, Calendar, FileText, BarChart3, Globe, Users } from "lucide-react"

// Helper function to recursively extract plain text content from React children
const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children); // Convert numbers to string as well
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (React.isValidElement(children) && children.props.children !== undefined) {
    // Recursively call for children of a React element
    return extractTextFromChildren(children.props.children);
  }
  return ''; // Handle null, undefined, boolean, or other unrenderable types
};


interface MarkdownReportProps {
  content: string;
  className?: string;
  isDark?: boolean;
}

export function MarkdownReport({ content, className }: MarkdownReportProps) {
  const { theme } = useTheme()
  const isDark = true // Force dark mode

  // Function to get section icon based on heading content
  const getSectionIcon = (heading: string) => {
    const lowerHeading = heading.toLowerCase()
    if (lowerHeading.includes("executive") || lowerHeading.includes("summary")) return <FileText className="w-5 h-5" />
    if (lowerHeading.includes("leadership") || lowerHeading.includes("vision")) return <Users className="w-5 h-5" />
    if (lowerHeading.includes("product") || lowerHeading.includes("service")) return <Building2 className="w-5 h-5" />
    if (lowerHeading.includes("financial")) return <BarChart3 className="w-5 h-5" />
    if (lowerHeading.includes("development") || lowerHeading.includes("recent")) return <Calendar className="w-5 h-5" />
    if (lowerHeading.includes("competitive") || lowerHeading.includes("landscape")) return <Globe className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  return (
    <div className={cn("markdown-report text-gray-200", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Enable GFM plugin for table support
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className={cn(
                "text-2xl font-bold mb-4 pb-2 border-b border-gray-700 text-white",
              )}
              {...props}
            />
          ),
          h2: ({ node, children, ...props }) => {
            const headingText = extractTextFromChildren(children)
            return (
              <div className="mb-4">
                <div
                  className={cn(
                    "flex items-center gap-2 text-xl font-semibold mb-3 text-blue-400",
                  )}
                  {...props}
                >
                  <div className="p-1.5 rounded-full bg-blue-900/50">
                    {getSectionIcon(headingText)}
                  </div>
                  {children}
                </div>
                <Separator className="bg-gray-700" />
              </div>
            )
          },
          h3: ({ node, ...props }) => (
            <h3
              className="text-lg font-medium mt-6 mb-3 text-gray-100"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="my-4 leading-relaxed text-gray-300" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
          li: ({ node, ...props }) => (
            <li className="pl-1 text-gray-300" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="font-medium underline underline-offset-4 text-blue-400 hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // !!! THE MISPLACED LINE WAS HERE IN THE PREVIOUS ITERATION !!!
          // If you re-added it, or something similar, it would cause this error again.
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 pl-4 py-1 my-4 border-gray-600 text-gray-400"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-gray-700" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-white" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          code: ({ node, ...props }) => (
            <code
              className="px-1.5 py-0.5 rounded text-sm font-mono bg-gray-800 text-gray-200"
              {...props}
            />
          ),
          pre: ({ node, ...props }) => (
            <pre
              className="p-4 rounded-lg my-6 overflow-x-auto bg-gray-800 text-gray-200"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-800/70" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-700" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-gray-750/50" {...props} />,
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300 border-r border-gray-700 last:border-r-0"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 text-sm border-r border-gray-700 last:border-r-0 align-top" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}