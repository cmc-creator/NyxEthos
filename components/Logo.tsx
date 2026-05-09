/**
 * NyxEthos Logo
 *
 * TO SWAP IN YOUR REAL LOGO:
 *   Replace the content inside the outer <div> with:
 *     <Image src="/logo.svg" alt="NyxEthos" width={120} height={32} priority />
 *   (drop your logo.svg into the /public folder)
 *
 * The `size` prop controls compact (navbar/footer) vs full display.
 */

interface LogoProps {
  size?: "sm" | "md";
}

export default function Logo({ size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2.5">
      {/* ── LOGO MARK ── swap this div for <Image> when your logo is ready */}
      <div
        className={`${iconSize} rounded-lg bg-nyx-blue flex items-center justify-center shadow-blue-glow flex-shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-4 h-4"
          aria-hidden="true"
        >
          {/* Stylised "NE" monogram  -  replace with your SVG paths */}
          <path
            d="M4 4h2.5l5.5 8V4H14v16h-2.5L6 12v8H4V4Z"
            fill="white"
            fillOpacity={0.95}
          />
          <path
            d="M16 4h4v2h-2v4h2v2h-2v6h2v2h-4V4Z"
            fill="white"
            fillOpacity={0.75}
          />
        </svg>
      </div>
      {/* ── WORDMARK ── */}
      <span
        className={`text-nyx-white font-semibold ${textSize} tracking-tight leading-none`}
      >
        Nyx<span className="text-nyx-blue-bright">Ethos</span>
      </span>
    </div>
  );
}
