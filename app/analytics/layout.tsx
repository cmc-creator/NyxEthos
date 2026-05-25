import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";

export const metadata = { title: "Analytics - NyxEthos" };

export default async function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");
  return (
    <div className="flex min-h-screen">
      <AppSidebar userName={session.user?.name} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
