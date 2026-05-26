import TeamSettingsPage from "./TeamSettingsPage";

export const metadata = { title: "Team - Settings - NyxEthos" };

export default function SettingsTeamPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading" style={{ color: "#eef5ff" }}>Settings</h1>
      </div>
      <TeamSettingsPage />
    </div>
  );
}