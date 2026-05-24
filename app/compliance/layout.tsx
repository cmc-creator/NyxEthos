import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AppSidebar from "@/components/AppSidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-nyx-bg">
      <AppSidebar userName={session.user?.name} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
