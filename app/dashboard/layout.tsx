import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Setup — NyxEthos",
  description: "Configure your NyxEthos workspace and choose your HR modules.",
  robots: { index: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
