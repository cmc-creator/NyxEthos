"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export default function PtoActionButtons({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const act = async (status: "approved" | "rejected") => {
    setLoading(status);
    try {
      await fetch(`/api/pto/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => act("approved")}
        disabled={loading !== null}
        title="Approve"
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40"
        style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" }}
      >
        <CheckCircle size={13} style={{ color: loading === "approved" ? "#7a9fc0" : "#34d399" }} />
      </button>
      <button
        onClick={() => act("rejected")}
        disabled={loading !== null}
        title="Deny"
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <XCircle size={13} style={{ color: loading === "rejected" ? "#7a9fc0" : "#f87171" }} />
      </button>
    </div>
  );
}
