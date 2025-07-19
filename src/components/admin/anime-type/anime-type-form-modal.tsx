"use client";

import { useState, useEffect } from "react";
import {
  useAnimeType,
  useCreateAnimeType,
  useUpdateAnimeType,
} from "@/hooks/use-anime-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Edit } from "lucide-react";
import { toast } from "sonner";

interface AnimeTypeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  animeTypeId?: string; // Required only for edit mode
}

export function AnimeTypeFormModal({
  open,
  onOpenChange,
  mode,
  animeTypeId,
}: AnimeTypeFormModalProps) {
  const [name, setName] = useState("");

  // Hooks for different operations
  const { animeType, isLoading: isFetching } = useAnimeType(animeTypeId || "");
  const { createAnimeType, isLoading: isCreating } = useCreateAnimeType();
  const { updateAnimeType, isLoading: isUpdating } = useUpdateAnimeType();

  // Update form when data is loaded (edit mode) or modal opens
  useEffect(() => {
    if (mode === "edit" && animeType && open) {
      setName(animeType.name);
    } else if (mode === "create" && open) {
      setName("");
    }
  }, [animeType, open, mode]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setName("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nama tipe anime tidak boleh kosong");
      return;
    }

    // Check if no changes in edit mode
    if (mode === "edit" && name.trim() === animeType?.name) {
      toast.error("Tidak ada perubahan untuk disimpan");
      return;
    }

    try {
      if (mode === "create") {
        await createAnimeType({ name: name.trim() });
        toast.success("Tipe anime berhasil ditambahkan");
      } else if (mode === "edit" && animeTypeId) {
        await updateAnimeType({ id: animeTypeId, name: name.trim() });
        toast.success("Tipe anime berhasil diperbarui");
      }

      onOpenChange(false);
    } catch (error) {
      const action = mode === "create" ? "menambahkan" : "memperbarui";
      toast.error(`Gagal ${action} tipe anime`);
      console.error(`${mode} anime type error:`, error);
    }
  };

  const isLoading = isFetching || isCreating || isUpdating;
  const isSubmitDisabled =
    isLoading ||
    !name.trim() ||
    (mode === "edit" && name.trim() === animeType?.name);

  // Modal config based on mode
  const modalConfig = {
    create: {
      title: "Tambah Tipe Anime Baru",
      description: "Masukkan nama tipe anime yang ingin ditambahkan",
      submitText: "Tambah",
      submitIcon: Plus,
      loadingText: "Menambahkan...",
    },
    edit: {
      title: "Edit Tipe Anime",
      description: "Ubah nama tipe anime sesuai kebutuhan",
      submitText: "Simpan Perubahan",
      submitIcon: Edit,
      loadingText: "Menyimpan...",
    },
  };

  const config = modalConfig[mode];
  const SubmitIcon = config.submitIcon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {mode === "edit" && isFetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-slate-600 dark:text-slate-400">
              Memuat data...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="anime-type-name"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Nama Tipe Anime
                </Label>
                <Input
                  id="anime-type-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: TV, Movie, OVA, ONA"
                  className="border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                  disabled={isLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="border-slate-200 dark:border-slate-600"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isCreating || isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {config.loadingText}
                  </>
                ) : (
                  <>
                    <SubmitIcon className="w-4 h-4 mr-2" />
                    {config.submitText}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
