import EmployeeDashboard from "@/components/dashboard/employee";
import EmployerDashboard from "@/components/dashboard/employer";

export default async function ProjectDetailPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ role: string }>;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { role } = await searchParams;

  const projectName = id.replace(/-/g, " ");

  if (role === "employer") {
    return <EmployerDashboard projectName={projectName} />;
  }
  return <EmployeeDashboard projectName={projectName} />;
}
