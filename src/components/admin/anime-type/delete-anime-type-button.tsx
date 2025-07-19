"use client";

import { useState } from "react";
import { useDeleteAnimeType } from "@/hooks/use-anime-types";
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
}

export function DeleteAnimeTypeButton({
  animeTypeId,
}: DeleteAnimeTypeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteAnimeType, isLoading } = useDeleteAnimeType();

  const handleDelete = async () => {
    try {
      await deleteAnimeType(animeTypeId);
      toast.success("Tipe anime berhasil dihapus");
      setIsOpen(false);
    } catch (error) {
      toast.error("Gagal menghapus tipe anime");
      console.error("Delete anime type error:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
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
            Apakah Anda yakin ingin menghapus tipe anime ini?
            <br />
            <span className="font-medium text-red-600 dark:text-red-400">
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="border-slate-200 dark:border-slate-600"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
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
