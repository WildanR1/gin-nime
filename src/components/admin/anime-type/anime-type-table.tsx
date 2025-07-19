"use client";

import { useState } from "react";
import { useAnimeTypes } from "@/hooks/use-anime-types";
import { DeleteAnimeTypeButton } from "./delete-anime-type-button";
import { AnimeTypeFormModal } from "./anime-type-form-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Edit } from "lucide-react";

export function AnimeTypeTable() {
  const { animeTypes, isLoading, isError } = useAnimeTypes();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAnimeTypeId, setSelectedAnimeTypeId] = useState<string>("");

  const handleEditClick = (animeTypeId: string) => {
    setSelectedAnimeTypeId(animeTypeId);
    setEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">
          Memuat data tipe anime...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Gagal memuat data tipe anime</p>
      </div>
    );
  }

  if (!animeTypes || animeTypes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">
          Belum ada tipe anime yang ditambahkan.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800">
            <TableHead className="text-slate-600 dark:text-slate-300 font-medium">
              Nama Tipe
            </TableHead>
            <TableHead className="text-slate-600 dark:text-slate-300 font-medium">
              Jumlah Anime
            </TableHead>
            <TableHead className="text-slate-600 dark:text-slate-300 font-medium text-right">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {animeTypes.map((animeType: any) => (
            <TableRow
              key={animeType.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white">
                {animeType.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                >
                  {animeType._count?.animes || 0} anime
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(animeType.id)}
                    className="border-primary/20 text-primary hover:bg-primary/10 dark:border-primary/30 dark:text-primary dark:hover:bg-primary/20"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <DeleteAnimeTypeButton animeTypeId={animeType.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <AnimeTypeFormModal
        mode="edit"
        animeTypeId={selectedAnimeTypeId}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </>
  );
}
