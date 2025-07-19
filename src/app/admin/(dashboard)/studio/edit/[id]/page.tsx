import { notFound } from "next/navigation";
import { getStudioById } from "@/actions/studio";
import { StudioForm } from "@/components/admin/studio/studio-form";

interface EditStudioPageProps {
  params: {
    id: string;
  };
}

export default async function EditStudioPage({ params }: EditStudioPageProps) {
  const { id } = params;

  const result = await getStudioById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <StudioForm studio={result.data} isEditing={true} />;
}
