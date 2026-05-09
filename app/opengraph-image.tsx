import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NyxEthos — Modular HR Software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#040d1a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(29,111,232,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(29,111,232,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Blue glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(29,111,232,0.15)",
            filter: "blur(80px)",
          }}
        />
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#1d6fe8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 900,
              color: "white",
              marginBottom: "8px",
            }}
          >
            N
          </div>
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
            <span style={{ color: "#f0f6ff", fontSize: "72px", fontWeight: 900, letterSpacing: "-2px" }}>
              Nyx
            </span>
            <span style={{ color: "#3b8bff", fontSize: "72px", fontWeight: 900, letterSpacing: "-2px" }}>
              Ethos
            </span>
          </div>
          {/* Tagline */}
          <div
            style={{
              color: "#4a6490",
              fontSize: "28px",
              fontWeight: 500,
              letterSpacing: "-0.5px",
              textAlign: "center",
            }}
          >
            Modular HR Software — Pure HR, Zero Bloat
          </div>
          {/* Badge row */}
          <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
            {["Onboarding", "Payroll", "Time & Attendance", "Compliance"].map((m) => (
              <div
                key={m}
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  border: "1px solid rgba(29,111,232,0.4)",
                  color: "#c8d8f0",
                  fontSize: "18px",
                  background: "rgba(7,20,40,0.8)",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
        {/* Footer domain */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            color: "#2a4070",
            fontSize: "18px",
            letterSpacing: "1px",
          }}
        >
          nyxethos.com · by NyxCollective LLC
        </div>
      </div>
    ),
    { ...size }
  );
}
