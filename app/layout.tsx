import type { Metadata } from "next";
import "./globals.css";
import { WaitlistProvider } from "@/context/WaitlistContext";
import WaitlistModal from "@/components/WaitlistModal";
import ThemeProvider from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "NyxEthos  -  Modular HR Software by NyxCollective",
  description:
    "NyxEthos delivers exactly the HR tools your team needs  -  nothing more, nothing less. Onboarding, payroll, time tracking, compliance, and more  -  all in one modular platform.",
  keywords: [
    "HR software",
    "human resources",
    "payroll",
    "employee onboarding",
    "time tracking",
    "HR SaaS",
    "NyxCollective",
    "NyxEthos",
  ],
  authors: [{ name: "NyxCollective LLC", url: "https://nyxcollectivellc.com" }],
  openGraph: {
    title: "NyxEthos  -  Modular HR Software",
    description: "HR tools that fit exactly what you need. No bloat, no compromises.",
    url: "https://nyxethos.com",
    siteName: "NyxEthos",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NyxEthos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NyxEthos  -  Modular HR Software",
    description: "HR tools that fit exactly what you need. No bloat, no compromises.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://nyxethos.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {/* Anti-flash: set theme+layout on html before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('nyx-theme')||'dark';var l=localStorage.getItem('nyx-layout')||'default';document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('data-layout',l);}catch(e){}})();` }} />
        <ThemeProvider>
          <WaitlistProvider>
            {children}
            <WaitlistModal />
          </WaitlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
