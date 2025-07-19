"use client";

import { AnimeTypeTable } from "./anime-type-table";
import { AnimeTypeFormModal } from "./anime-type-form-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AnimeTypeContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Tipe Anime
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Kelola jenis-jenis tipe anime yang tersedia
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Tipe Anime
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Daftar Tipe Anime
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Semua tipe anime yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimeTypeTable />
        </CardContent>
      </Card>

      <AnimeTypeFormModal
        mode="create"
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
