"use client";

import { LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <SidebarMenuButton
              size="lg"
              className="transition-all duration-200 relative overflow-hidden rounded-lg hover:bg-slate-700/70 data-[state=open]:bg-slate-700/80 data-[state=open]:text-white data-[state=open]:hover:bg-slate-700/90"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-slate-400">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-500/10 translate-x-[-100%] hover:translate-x-0 transition-transform duration-300 ease-out" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-slate-700 border-slate-600"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem className="hover:bg-slate-600 text-slate-200 hover:text-white transition-colors duration-200 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Pengaturan Akun
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
