"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteGenre } from "@/actions/genre";
import { GenreWithCount } from "@/lib/models/genre";
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
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteGenreButtonProps {
  genre: GenreWithCount;
  onDeleted?: () => void;
}

export function DeleteGenreButton({
  genre,
  onDeleted,
}: DeleteGenreButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteGenre(genre.id);

      if (result.success) {
        setIsOpen(false);
        toast.success("Genre berhasil dihapus", {
          description: `Genre "${genre.name}" telah dihapus dari sistem.`,
        });
        onDeleted?.();
        router.refresh(); // Refresh the page to update the list
      } else {
        toast.error("Gagal menghapus genre", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error deleting genre:", error);
      toast.error("Terjadi kesalahan", {
        description: "Gagal menghapus genre. Silakan coba lagi.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = genre._count.animes === 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          disabled={!canDelete}
          title={
            !canDelete
              ? `Cannot delete genre. It is being used by ${genre._count.animes} anime(s)`
              : "Delete genre"
          }
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            Hapus Genre
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
            Apakah Anda yakin ingin menghapus genre{" "}
            <strong className="text-slate-900 dark:text-white">
              "{genre.name}"
            </strong>
            ?
            <br />
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-slate-200 dark:border-slate-700"
            disabled={isDeleting}
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Genre
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
