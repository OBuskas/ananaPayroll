import EmployeeDashboard from "@/components/dashboard/employee";
import EmployerDashboard from "@/components/dashboard/employer";

export default async function ProjectDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ role: string }>;
}) {
  const { role } = await searchParams;
  if (role === "employer") {
    return <EmployerDashboard />;
  }
  return <EmployeeDashboard />;
}
