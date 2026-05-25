"use client";

import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

interface Props {
  taskId: string;
  completed: boolean;
  onToggle?: (id: string, done: boolean) => void;
}

export default function OnboardingToggle({ taskId, completed, onToggle }: Props) {
  const [done, setDone] = useState(completed);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const res = await fetch(`/api/onboarding/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !done }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(!done);
      onToggle?.(taskId, !done);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="flex-shrink-0 transition-opacity hover:opacity-80 disabled:opacity-40"
      title={done ? "Mark incomplete" : "Mark complete"}
    >
      {done ? (
        <CheckCircle size={18} className="text-emerald-400" />
      ) : (
        <Circle size={18} style={{ color: "rgba(160,184,216,0.5)" }} />
      )}
    </button>
  );
}
