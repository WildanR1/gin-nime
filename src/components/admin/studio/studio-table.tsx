"use client";

import { useState } from "react";
import { useStudios } from "@/hooks/use-studios";
import { DeleteStudioButton } from "./delete-studio-button";
import { StudioFormModal } from "./studio-form-modal";
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
import { Loader2, Edit, Building } from "lucide-react";

export function StudioTable() {
  const { studios, isLoading, isError } = useStudios();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudioId, setSelectedStudioId] = useState<string>("");

  const handleEditClick = (studioId: string) => {
    setSelectedStudioId(studioId);
    setEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">
          Memuat data studio...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Gagal memuat data studio</p>
      </div>
    );
  }

  if (!studios || studios.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          Belum ada studio
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Belum ada studio yang ditambahkan.
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
              Nama Studio
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
          {studios.map((studio: any) => (
            <TableRow
              key={studio.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {studio.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ID: {studio.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                >
                  {studio._count?.animes || 0} anime
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(studio.id)}
                    className="border-primary/20 text-primary hover:bg-primary/10 dark:border-primary/30 dark:text-primary dark:hover:bg-primary/20"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <DeleteStudioButton
                    studioId={studio.id}
                    studioName={studio.name}
                    animeCount={studio._count?.animes || 0}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <StudioFormModal
        mode="edit"
        studioId={selectedStudioId}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </>
  );
}
