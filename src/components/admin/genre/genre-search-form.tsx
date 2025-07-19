"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { genreFilterSchema } from "@/lib/validations/genre";
import type { GenreFilterInput } from "@/lib/validations/genre";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface GenreSearchFormProps {
  onSearch: (filters: GenreFilterInput) => void;
  initialFilters?: GenreFilterInput;
  isLoading?: boolean;
}

export function GenreSearchForm({
  onSearch,
  initialFilters = {},
  isLoading = false,
}: GenreSearchFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenreFilterInput>({
    resolver: zodResolver(genreFilterSchema),
    defaultValues: {
      search: initialFilters.search || "",
      sortBy: initialFilters.sortBy || "name",
      sortOrder: initialFilters.sortOrder || "asc",
    },
  });

  const watchedSortBy = watch("sortBy");
  const watchedSortOrder = watch("sortOrder");

  const onSubmit = (data: GenreFilterInput) => {
    onSearch(data);
  };

  const handleClearSearch = () => {
    reset({
      search: "",
      sortBy: "name",
      sortOrder: "asc",
    });
    onSearch({
      search: "",
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari genre..."
            className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            {...register("search")}
          />
        </div>

        {/* Sort By */}
        <Select
          value={watchedSortBy}
          onValueChange={(value) =>
            setValue("sortBy", value as "name" | "animes" | "createdAt")
          }
        >
          <SelectTrigger className="w-[140px] border-slate-200 dark:border-slate-700">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nama</SelectItem>
            <SelectItem value="animes">Jumlah Anime</SelectItem>
            <SelectItem value="createdAt">Tanggal</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select
          value={watchedSortOrder}
          onValueChange={(value) =>
            setValue("sortOrder", value as "asc" | "desc")
          }
        >
          <SelectTrigger className="w-[100px] border-slate-200 dark:border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A-Z</SelectItem>
            <SelectItem value="desc">Z-A</SelectItem>
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-sky-500 hover:bg-sky-600 text-white"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleClearSearch}
          className="border-slate-200 dark:border-slate-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-600 dark:text-red-400 text-sm">
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error?.message}</p>
          ))}
        </div>
      )}
    </form>
  );
}
