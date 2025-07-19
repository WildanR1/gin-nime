"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAnimeType } from "@/actions/animeType";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteAnimeTypeButtonProps {
  animeTypeId: string;
  animeTypeName: string;
  animeCount: number;
}

export function DeleteAnimeTypeButton({
  animeTypeId,
  animeTypeName,
  animeCount,
}: DeleteAnimeTypeButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteAnimeType(animeTypeId);

      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan yang tidak diharapkan");
      console.error("Delete anime type error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Disable delete if anime type is being used
  const canDelete = animeCount === 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!canDelete}
          className={
            canDelete
              ? "border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
              : "opacity-50 cursor-not-allowed"
          }
          title={
            !canDelete
              ? `Tidak dapat menghapus karena masih digunakan oleh ${animeCount} anime`
              : "Hapus tipe anime"
          }
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-white">
            Hapus Tipe Anime
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
            Apakah Anda yakin ingin menghapus tipe anime &quot;{animeTypeName}
            &quot;?
            <br />
            <span className="font-medium text-red-600 dark:text-red-400">
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-slate-200 dark:border-slate-600"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
