import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { StudioContent } from "@/components/admin/studio/studio-content";

export default async function StudioManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return <StudioContent />;
}
