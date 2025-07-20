"use client";

import { useState, useEffect } from "react";
import {
  useCreateStudio,
  useUpdateStudio,
  useStudio,
} from "@/hooks/use-studios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Building } from "lucide-react";
import { toast } from "sonner";

interface StudioFormModalProps {
  mode: "create" | "edit";
  studioId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudioFormModal({
  mode,
  studioId,
  open,
  onOpenChange,
}: StudioFormModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { createStudio, isLoading: isCreating } = useCreateStudio();
  const { updateStudio, isLoading: isUpdating } = useUpdateStudio();
  const { studio, isLoading: isLoadingStudio } = useStudio(studioId || "");

  // Configuration based on mode
  const config = {
    create: {
      title: "Tambah Studio Baru",
      description: "Tambahkan studio anime baru ke dalam sistem",
      submitText: "Tambah Studio",
      loadingText: "Menambahkan...",
    },
    edit: {
      title: "Edit Studio",
      description: "Perbarui informasi studio anime",
      submitText: "Update Studio",
      loadingText: "Mengupdate...",
    },
  };

  // Load studio data for edit mode
  useEffect(() => {
    if (mode === "edit" && studio) {
      setName(studio.name);
    }
  }, [mode, studio]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setName("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama studio diperlukan");
      return;
    }

    if (name.trim().length < 2) {
      setError("Nama studio minimal 2 karakter");
      return;
    }

    try {
      const data = {
        name: name.trim(),
      };

      if (mode === "create") {
        await createStudio(data);
        toast.success("Studio berhasil ditambahkan");
      } else if (mode === "edit" && studioId) {
        await updateStudio({ id: studioId, ...data });
        toast.success("Studio berhasil diperbarui");
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Studio form error:", error);
      toast.error("Gagal menyimpan studio");
    }
  };

  const isLoading =
    isCreating || isUpdating || (mode === "edit" && isLoadingStudio);
  const isSubmitDisabled = isLoading || !name.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-primary-foreground" />
            </div>
            {config[mode].title}
          </DialogTitle>
          <DialogDescription>{config[mode].description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loading state for edit mode */}
          {mode === "edit" && isLoadingStudio && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                Memuat data studio...
              </span>
            </div>
          )}

          {/* Form fields */}
          {(!isLoadingStudio || mode === "create") && (
            <>
              {/* Studio Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nama Studio <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: MAPPA, Studio Pierrot, Madhouse"
                  className={error ? "border-red-500" : ""}
                  disabled={isLoading}
                  maxLength={100}
                />
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nama studio anime seperti MAPPA, Toei Animation, Studio
                  Pierrot
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
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
                  {config[mode].loadingText}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {config[mode].submitText}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
