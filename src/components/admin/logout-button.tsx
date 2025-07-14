"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
