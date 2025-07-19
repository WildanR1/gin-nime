"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Home, Film, Tags, Users, Settings2, Tv, Building } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Kelola Anime",
      url: "/admin/anime",
      icon: Film,
      items: [
        {
          title: "Daftar Anime",
          url: "/admin/anime",
        },
        {
          title: "Tambah Anime",
          url: "/admin/anime/tambah",
        },
      ],
    },
    {
      title: "Kelola Genre",
      url: "/admin/genre",
      icon: Tags,
      items: [
        {
          title: "Daftar Genre",
          url: "/admin/genre",
        },
        {
          title: "Tambah Genre",
          url: "/admin/genre/tambah",
        },
      ],
    },
    {
      title: "Tipe Anime",
      url: "/admin/anime-type",
      icon: Tv,
      items: [
        {
          title: "Daftar Tipe",
          url: "/admin/anime-type",
        },
        {
          title: "Tambah Tipe",
          url: "/admin/anime-type/tambah",
        },
      ],
    },
    {
      title: "Studio",
      url: "/admin/studio",
      icon: Building,
      items: [
        {
          title: "Daftar Studio",
          url: "/admin/studio",
        },
        {
          title: "Tambah Studio",
          url: "/admin/studio/tambah",
        },
      ],
    },
    {
      title: "Kelola Users",
      url: "/admin/user",
      icon: Users,
    },
    {
      title: "Pengaturan",
      url: "/admin/settings",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  // Default user data dengan fallback jika session tidak ada
  const userData = {
    name: session?.user?.name || "Administrator",
    email: session?.user?.email || "admin@ginanime.com",
    avatar: session?.user?.image || "/avatars/admin.jpg",
  };

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="bg-slate-900 border-slate-700 transition-all duration-300 ease-in-out"
      {...props}
    >
      {/* Header dengan animasi */}
      <SidebarHeader className="bg-slate-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-slate-800/50 data-[state=open]:bg-slate-800/70 data-[state=open]:hover:bg-slate-800/80"
            >
              <Link href="/admin/dashboard">
                <Image
                  src="/image/logo.png"
                  alt="GinAnime Logo"
                  width={32}
                  height={32}
                  className="transition-transform duration-200 hover:scale-110"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">
                    Gin<span className="text-sky-400">Anime</span>
                  </span>
                  <span className="truncate text-xs text-slate-400">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content dengan animasi menggunakan NavMain */}
      <SidebarContent className="bg-slate-900">
        <NavMain items={navigationData.navMain} />
      </SidebarContent>

      {/* Footer dengan user menu menggunakan NavUser */}
      <SidebarFooter className="bg-slate-900 border-t border-slate-700/50">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
