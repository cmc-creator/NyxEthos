interface LogoProps {
  size?: "sm" | "md";
}

export default function Logo({ size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2.5">
      {/* Logo mark */}
      <div
        className={`${iconSize} rounded-lg flex items-center justify-center flex-shrink-0`}
        style={{
          background: "linear-gradient(135deg, #1e5fe8 0%, #7c3aed 100%)",
          boxShadow:
            "0 0 20px rgba(124,58,237,0.45), 0 0 8px rgba(30,95,232,0.30), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            d="M4 4h2.5l5.5 8V4H14v16h-2.5L6 12v8H4V4Z"
            fill="white"
            fillOpacity={0.97}
          />
          <path
            d="M16 4h4v2h-2v4h2v2h-2v6h2v2h-4V4Z"
            fill="white"
            fillOpacity={0.72}
          />
        </svg>
      </div>
      {/* Wordmark */}
      <span
        className={`text-nyx-white font-semibold ${textSize} tracking-tight leading-none`}
      >
        Nyx
        <span
          style={{
            background: "linear-gradient(135deg, #a855f7, #4d8fff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Ethos
        </span>
      </span>
    </div>
  );
}

