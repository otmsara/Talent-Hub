import {
    Loader2,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    X,
  } from 'lucide-react';
  import { useState, useEffect, useMemo, useRef } from 'react';
  
  export interface AgentState {
    jobId: string;
    running: boolean;
    agentName: string;
    progress: number;
    status: 'idle' | 'running' | 'completed' | 'error';
    messages: Array<{ text: string; type: string }>;
  }
  
  interface MinimizedAgentIndicatorProps {
    currentJobAgentStates: Record<string, AgentState>;
    jobTitle: string;
    onClose: () => void;
    isExpanded: boolean; // Add this prop
    onToggleExpand: (expanded: boolean) => void; // Add this prop
  }
  
  const READABLE_AGENT_NAMES: Record<string, string> = {
    'deep-search': 'Deep Search',
    'company-search': 'Company Search',
    interview: 'Interview Preparation',
    resume: 'Resume Builder',
    'cover-letter': 'Cover Letter',
    analytics: 'Analytics',
    'career-intelligence': 'Career Intelligence',
  };
  
  const AGENT_ORDER = [
    'deep-search',
    'company-search',
    'interview',
    'resume',
    'cover-letter',
    'analytics',
    'career-intelligence',
  ];
  
  const MAX_ESTIMATED_SECONDS = 300;
  const ALTERNATE_INTERVAL_MS = 6000; // 6 seconds for alternation
  
  export const MinimizedAgentIndicator = ({
    currentJobAgentStates,
    jobTitle,
    onClose,
    isExpanded, // Destructure from props
    onToggleExpand, // Destructure from props
  }: MinimizedAgentIndicatorProps) => {
    // const [isExpanded, setIsExpanded] = useState(false); // Remove internal state
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [shouldRender, setShouldRender] = useState(true);
    const [showErrorMessageToggle, setShowErrorMessageToggle] = useState(false);
  
    const initialEstimateRef = useRef<number | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
    const agents = useMemo(
      () =>
        AGENT_ORDER.map(
          (name) =>
            currentJobAgentStates[name] || {
              jobId: '',
              running: false,
              agentName: name,
              progress: 0,
              status: 'idle',
              messages: [],
            }
        ),
      [currentJobAgentStates]
    );
  
    const runningAgents = agents.filter((a) => a.status === 'running');
    const otherAgents = agents.filter((a) => a.status !== 'running');
    const completedCount = agents.filter((a) => a.status === 'completed').length;
    const errorAgents = agents.filter((a) => a.status === 'error');
    const errorCount = errorAgents.length;
    const allCompleted =
      completedCount + errorCount === agents.length && runningAgents.length === 0;
  
    const formattedRemainingTime = useMemo(() => {
      if (remainingTime === null || remainingTime <= 0) return '';
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      return `~${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
    }, [remainingTime]);
  
    const getAgentDisplayName = (name: string) =>
      READABLE_AGENT_NAMES[name] || name.replace(/-/g, ' ');
  
    const getErrorAgentNames = useMemo(() => {
      if (errorAgents.length === 0) return '';
      const names = errorAgents.map((agent) => getAgentDisplayName(agent.agentName));
      if (names.length === 1) {
        return names[0];
      } else if (names.length === 2) {
        return `${names[0]} and ${names[1]}`;
      } else {
        return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
      }
    }, [errorAgents]);
  
    useEffect(() => {
      if (runningAgents.length > 0 && initialEstimateRef.current === null) {
        const totalEstimatedSeconds = runningAgents.length * 60;
        initialEstimateRef.current = Math.min(totalEstimatedSeconds, MAX_ESTIMATED_SECONDS);
        setRemainingTime(initialEstimateRef.current);
      } else if (runningAgents.length === 0 && initialEstimateRef.current !== null) {
        initialEstimateRef.current = null;
        setRemainingTime(null);
      }
    }, [runningAgents.length]);
  
    useEffect(() => {
      let timer: NodeJS.Timeout | undefined;
  
      if (remainingTime !== null && remainingTime > 0 && runningAgents.length > 0) {
        timer = setInterval(() => {
          setRemainingTime((prevTime) => (prevTime !== null ? prevTime - 1 : null));
        }, 1000);
      }
  
      return () => {
        if (timer) clearInterval(timer);
      };
    }, [remainingTime, runningAgents.length]);
  
    useEffect(() => {
      if (allCompleted) {
        // setIsExpanded(false); // Use onToggleExpand instead
        onToggleExpand(false);
        hideTimeoutRef.current = setTimeout(() => {
          setShouldRender(false);
          onClose();
        }, 10000);
      }
  
      return () => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      };
    }, [allCompleted, onClose, onToggleExpand]); // Add onToggleExpand to dependencies
  
    useEffect(() => {
      if (errorCount > 0 && !isExpanded) {
        intervalRef.current = setInterval(() => {
          setShowErrorMessageToggle((prev) => !prev);
        }, ALTERNATE_INTERVAL_MS);
      } else {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setShowErrorMessageToggle(false);
      }
  
      return () => {
        clearInterval(intervalRef.current!);
      };
    }, [errorCount, isExpanded]);
  
    const getStatusDisplay = () => {
      if (errorCount > 0 && !isExpanded) {
        if (showErrorMessageToggle) {
          return {
            icon: <XCircle className="h-5 w-5 text-red-400" />,
            text: `Some agents encountered errors: ${getErrorAgentNames}.`,
            colorClass: 'text-red-400',
          };
        }
      }
  
      if (allCompleted) {
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-400" />,
          text: 'All agents finished.',
          colorClass: 'text-green-400',
        };
      }
  
      return {
        icon: <Loader2 className="h-5 w-5 animate-spin text-blue-400" />,
        text: 'Agents are in progress...',
        colorClass: 'text-blue-400',
      };
    };
  
    const renderAgentItem = (agent: AgentState) => {
      const name = getAgentDisplayName(agent.agentName);
      const dotColor =
        agent.status === 'running'
          ? 'bg-purple-500'
          : agent.status === 'completed'
          ? 'bg-green-500'
          : agent.status === 'error'
          ? 'bg-red-500'
          : 'bg-gray-500';
      const statusText =
        agent.status === 'running'
          ? 'Running'
          : agent.status === 'completed'
          ? 'Done'
          : agent.status === 'error'
          ? 'Error'
          : 'Idle';
  
      return (
        <div key={agent.agentName} className="flex flex-col p-2 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 truncate">
              {agent.status === 'running' && (
                <Loader2 className="h-4 w-4 animate-spin text-purple-400" strokeWidth={3} />
              )}
              <span className={`block w-2 h-2 rounded-full ${dotColor}`} />
              <span className="text-sm truncate" title={name}>{name}</span>
            </div>
            <span className="text-xs font-semibold">{statusText}</span>
          </div>
          {agent.status === 'running' && (
            <div className="w-full bg-gray-700 rounded h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-purple-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${agent.progress}%` }}
              />
            </div>
          )}
        </div>
      );
    };
  
    const statusDisplay = getStatusDisplay();
  
    if (!shouldRender || (!runningAgents.length && !isExpanded && !allCompleted && errorCount === 0)) return null;
  
    return (
      <div
        className={`fixed bottom-4 right-4 text-white rounded-lg shadow-lg p-4 w-[320px] z-50 select-none  transition-all max-h-[80vh] overflow-y-auto`}
        style={{
          backgroundColor: 'rgb(10, 15, 41)',
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {statusDisplay.icon}
            <p className={`text-sm ${statusDisplay.colorClass} max-w-xs truncate`}>
              {statusDisplay.text}
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => {
              if (allCompleted) {
                setShouldRender(false);
                onClose();
              } else {
                onToggleExpand(!isExpanded); // Use onToggleExpand here
              }
            }}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
  
        {isExpanded && (
          <>
            <div className="text-xs text-gray-400 mb-2">
              Agents for: <span className="text-purple-400">{jobTitle}</span>
            </div>
            <div className="space-y-2">
              {agents.map((agent) => renderAgentItem(agent))}
            </div>
            {formattedRemainingTime && (
              <div className="text-xs text-gray-400 mt-3">
                Estimated time remaining: <span className="text-white">{formattedRemainingTime}</span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };