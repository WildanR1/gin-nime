"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Home,
  Film,
  Tags,
  Users,
  Settings,
  ChevronUp,
  User2,
  LogOut,
  PanelLeft,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

// Menu items.
const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Kelola Anime",
    url: "/admin/anime",
    icon: Film,
  },
  {
    title: "Kelola Genre",
    url: "/admin/genre",
    icon: Tags,
  },
  {
    title: "Kelola Users",
    url: "/admin/user",
    icon: Users,
  },
];

const settingsItems = [
  {
    title: "Pengaturan",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r-sky-500/20">
      <SidebarHeader className="border-b border-sky-500/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard" className="group">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 text-sidebar-primary-foreground ring-1 ring-sky-500/30">
                  <Image
                    src="/image/logo.png"
                    alt="GinAnime Logo"
                    width={24}
                    height={24}
                    className="rounded transition-all group-hover:scale-110"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
                    GinAnime
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sky-600 font-medium">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="group"
                  >
                    <Link
                      href={item.url}
                      className={`
                      transition-all duration-200 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-blue-500/10
                      ${
                        pathname === item.url
                          ? "bg-gradient-to-r from-sky-500/10 to-blue-500/10 border-r-2 border-sky-500"
                          : ""
                      }
                    `}
                    >
                      <item.icon
                        className={`transition-colors ${
                          pathname === item.url
                            ? "text-sky-500"
                            : "group-hover:text-sky-500"
                        }`}
                      />
                      <span
                        className={`transition-colors ${
                          pathname === item.url
                            ? "text-sky-600 font-medium"
                            : "group-hover:text-sky-600"
                        }`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-600 font-medium">
            Pengaturan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sky-500/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-gradient-to-r data-[state=open]:from-sky-500/10 data-[state=open]:to-blue-500/10 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-blue-500/10 group"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center ring-1 ring-sky-500/30">
                    <User2 className="h-4 w-4 text-sky-500" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sky-600">
                      Administrator
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      admin@ginanime.com
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-sky-500" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-sky-500/20"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="hover:bg-sky-500/10">
                  <Settings className="mr-2 h-4 w-4 text-sky-500" />
                  <span>Pengaturan Akun</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 hover:bg-red-500/10"
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
