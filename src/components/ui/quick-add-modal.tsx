"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import {
  quickAddGenre,
  quickAddStudio,
  quickAddAnimeType,
  QuickAddResponse,
} from "@/actions/quickAdd";

interface QuickAddModalProps {
  type: "genre" | "studio" | "animeType";
  onSuccess?: (data: any) => void;
  children?: React.ReactNode;
}

const typeConfig = {
  genre: {
    title: "Tambah Genre Baru",
    description: "Tambahkan genre baru yang akan langsung tersedia di form",
    placeholder: "Contoh: Action, Romance, Comedy",
    action: quickAddGenre,
  },
  studio: {
    title: "Tambah Studio Baru",
    description:
      "Tambahkan studio anime baru yang akan langsung tersedia di form",
    placeholder: "Contoh: MAPPA, Studio Pierrot, Madhouse",
    action: quickAddStudio,
  },
  animeType: {
    title: "Tambah Tipe Anime Baru",
    description:
      "Tambahkan tipe anime baru yang akan langsung tersedia di form",
    placeholder: "Contoh: TV, Movie, ONA, OVA",
    action: quickAddAnimeType,
  },
};

export function QuickAddModal({
  type,
  onSuccess,
  children,
}: QuickAddModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const config = typeConfig[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama harus diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      const result: QuickAddResponse = await config.action({
        name: name.trim(),
      });

      if (result.success) {
        toast.success(result.message);
        setName("");
        setOpen(false);

        // Trigger refresh untuk parent component
        if (onSuccess && result.data) {
          onSuccess(result.data);
        }

        // Refresh halaman untuk memuat data terbaru
        window.location.reload();
      } else {
        if (result.errors?.name) {
          setError(result.errors.name);
        } else {
          setError(result.message);
        }
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Quick add error:", error);
      setError("Terjadi kesalahan yang tidak terduga");
      toast.error("Terjadi kesalahan yang tidak terduga");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setName("");
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500"
          >
            <Plus className="w-3 h-3 mr-1" />
            Tambah Baru
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">{config.title}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-200">
              Nama{" "}
              {type === "genre"
                ? "Genre"
                : type === "studio"
                ? "Studio"
                : "Tipe Anime"}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder={config.placeholder}
              className={`bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 ${
                error ? "border-red-500" : ""
              }`}
              disabled={isSubmitting}
              autoFocus
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menambahkan...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Tambah
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
