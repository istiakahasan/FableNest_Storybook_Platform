import DashboardPageHeaderTitle from "@/components/dashboard/DashboardPageHeaderTitle";
import RouteTabs from "@/components/dashboard/settings/RoutesTab";

export default function DashboardSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <DashboardPageHeaderTitle title="Settings" />
      <RouteTabs />
      <div className="min-h-[calc(80vh-7rem)]">{children}</div>
    </div>
  );
}
