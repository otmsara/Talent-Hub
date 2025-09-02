import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface SubGoal {
  id: string;
  text: string;
  completed: boolean;
}

interface Goal {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  subGoals: SubGoal[];
}

function formatDate(date: Date) {
  return date.toLocaleString();
}

const initialGoals: Goal[] = [];

const CareerGoals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [newGoal, setNewGoal] = useState("");
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [newSubGoal, setNewSubGoal] = useState<{ [goalId: string]: string }>({});

  // Add a new goal
  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    const now = new Date();
    setGoals([
      {
        id: Math.random().toString(36).slice(2),
        text: newGoal,
        createdAt: now,
        updatedAt: now,
        subGoals: [],
      },
      ...goals,
    ]);
    setNewGoal("");
  };

  // Edit a goal
  const handleEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditingText(goal.text);
  };

  // Save edited goal
  const handleSaveEdit = (goal: Goal) => {
    setGoals(goals.map(g =>
      g.id === goal.id
        ? { ...g, text: editingText, updatedAt: new Date() }
        : g
    ));
    setEditingGoalId(null);
    setEditingText("");
  };

  // Add a sub-goal
  const handleAddSubGoal = (goalId: string) => {
    const text = newSubGoal[goalId]?.trim();
    if (!text) return;
    setGoals(goals.map(g =>
      g.id === goalId
        ? {
            ...g,
            subGoals: [
              ...g.subGoals,
              { id: Math.random().toString(36).slice(2), text, completed: false },
            ],
            updatedAt: new Date(),
          }
        : g
    ));
    setNewSubGoal({ ...newSubGoal, [goalId]: "" });
  };

  // Toggle sub-goal completion
  const handleToggleSubGoal = (goalId: string, subGoalId: string) => {
    setGoals(goals.map(g =>
      g.id === goalId
        ? {
            ...g,
            subGoals: g.subGoals.map(sg =>
              sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
            ),
            updatedAt: new Date(),
          }
        : g
    ));
  };

  // Refiner.EXA click handler
  const handleRefinerClick = (goal?: Goal) => {
    window.dispatchEvent(new CustomEvent("open-exa-chat", { detail: { exa: "Refiner.EXA", goal } }));
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mr-4">Career Goals</h1>
        <Button
          onClick={() => handleRefinerClick()}
          variant="default"
          size="sm"
          className="ml-2 flex items-center"
          title="Refine your goals with Refiner.EXA"
        >
          <img
            src="/exa-logo.png"
            alt="Refiner.EXA logo"
            style={{ width: 32, height: 32, objectFit: "contain", marginRight: 6 }}
          />
          <span className="text-xs text-cyan-100">Refiner.EXA</span>
        </Button>
      </div>
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded border border-border bg-white/10 text-foreground"
          placeholder="Add a new career goal..."
          value={newGoal}
          onChange={e => setNewGoal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAddGoal()}
        />
        <Button
          onClick={handleAddGoal}
          variant="default"
          size="default"
        >
          Add Goal
        </Button>
      </div>
      <div className="grid gap-6">
        {goals.length === 0 && (
          <div className="text-muted-foreground text-center py-8">
            No goals yet. Start by adding your first career goal!
          </div>
        )}
        {goals.map(goal => (
          <div
            key={goal.id}
            className="bg-white/5 border border-cyan-700/40 rounded-2xl shadow p-6 relative"
            style={{
              boxShadow: "0 4px 32px rgba(34,211,238,0.08)",
              transition: "box-shadow 0.2s",
            }}
          >
            <div className="flex items-center mb-2">
              {editingGoalId === goal.id ? (
                <>
                  <input
                    className="flex-1 px-2 py-1 rounded border border-border bg-white/10 text-foreground"
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSaveEdit(goal)}
                  />
                  <Button
                    onClick={() => handleSaveEdit(goal)}
                    variant="default"
                    size="sm"
                    className="ml-2"
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-lg font-semibold text-foreground flex-1">{goal.text}</span>
                  <Button
                    onClick={() => handleEditGoal(goal)}
                    variant="outline"
                    size="sm"
                    className="ml-2 text-xs"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleRefinerClick(goal)}
                    variant="default"
                    size="sm"
                    className="ml-2 flex items-center"
                    title="Refine this goal with Refiner.EXA"
                  >
                    <img
                      src="/exa-logo.png"
                      alt="Refiner.EXA logo"
                      style={{ width: 24, height: 24, objectFit: "contain", marginRight: 4 }}
                    />
                    <span className="text-xs text-cyan-100">Refiner.EXA</span>
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xs text-muted-foreground">
                Created: {formatDate(goal.createdAt)}
              </span>
              <span className="text-xs text-muted-foreground">
                Last edited: {formatDate(goal.updatedAt)}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-cyan-300 text-sm">Sub-goals:</span>
              <ul className="list-none mt-1">
                {goal.subGoals.map(subGoal => (
                  <li key={subGoal.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={subGoal.completed}
                      onChange={() => handleToggleSubGoal(goal.id, subGoal.id)}
                      className="accent-cyan-500"
                    />
                    <span
                      className={`text-foreground text-sm ${subGoal.completed ? "line-through opacity-60" : ""}`}
                    >
                      {subGoal.text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="flex-1 px-2 py-1 rounded border border-border bg-white/10 text-foreground"
                  placeholder="Add a sub-goal..."
                  value={newSubGoal[goal.id] || ""}
                  onChange={e => setNewSubGoal({ ...newSubGoal, [goal.id]: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleAddSubGoal(goal.id)}
                />
                <Button
                  onClick={() => handleAddSubGoal(goal.id)}
                  variant="default"
                  size="sm"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerGoals;
