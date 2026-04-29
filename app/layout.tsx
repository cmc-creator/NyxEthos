import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auto-Docs Mobile Mechanic | Arizona's Premier Mobile Auto Repair",
  description:
    "Auto-Docs brings the shop to you. Professional mobile mechanic services across Arizona — oil changes, brakes, diagnostics, and more. Book online today.",
  keywords:
    "mobile mechanic arizona, auto repair phoenix, mobile oil change, brake repair, car diagnostics arizona",
  openGraph: {
    title: "Auto-Docs Mobile Mechanic",
    description: "Arizona's premier mobile mechanic — we come to you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f1e3d",
              color: "#f0f4ff",
              border: "1px solid #1e3260",
            },
          }}
        />
      </body>
    </html>
  );
}
