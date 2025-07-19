import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AnimeTypeContent } from "@/components/admin/anime-type/anime-type-content";

export default async function AnimeTypeManagementPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return <AnimeTypeContent />;
}
