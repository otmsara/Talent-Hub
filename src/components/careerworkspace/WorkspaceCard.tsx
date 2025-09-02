import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WorkspaceCardProps {
  title?: string;
  status?: "completed" | "in-progress" | "pending";
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const WorkspaceCard = ({
  title,
  status = "pending",
  className,
  children,
  onClick,
}: WorkspaceCardProps) => {
  return (
    <div
      className={cn(
        "relative p-6 rounded-2xl bg-muted/50 border hover:border-[#2a3349] transition-all duration-300 shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-workspace-accent">{title}</h3>
        <div className="flex items-center space-x-2">
          {status === "completed" && (
            <Badge
              variant="outline"
              className={cn(
                "px-2 py-0.5",
                "bg-green-900 text-green-300 border-green-700"
              )}
            >
              {status}
            </Badge>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};