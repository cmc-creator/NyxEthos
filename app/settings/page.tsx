import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SettingsClient from "./SettingsClient";

function getOrgId(session: { user?: { orgId?: string } } | null) {
  return session?.user?.orgId ?? null;
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const orgId = getOrgId(session);
  if (!orgId) redirect("/sign-in");

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { id: true, name: true },
  });

  return <SettingsClient orgName={org?.name ?? ""} orgId={org?.id ?? ""} />;
}
