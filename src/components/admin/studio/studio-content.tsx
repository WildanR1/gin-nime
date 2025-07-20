"use client";

import { useState } from "react";
import { StudioTable } from "./studio-table";
import { StudioFormModal } from "./studio-form-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building } from "lucide-react";

export function StudioContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-primary-foreground" />
            </div>
            Kelola Studio
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Kelola studio anime yang tersedia dalam sistem
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Studio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Daftar Studio
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Semua studio anime yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudioTable />
        </CardContent>
      </Card>

      {/* Create Modal */}
      <StudioFormModal
        mode="create"
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
