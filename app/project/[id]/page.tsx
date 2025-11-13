import ProjectDetailsClientPage from "@/components/project-details/client-page";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectDetailsClientPage companyContractId={id} />;
}
