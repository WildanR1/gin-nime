"use client";

import { usePathname } from "next/navigation";
import { Home, Film, Tags, Users, Settings } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Type untuk route config
type RouteConfig = {
  title: string;
  icon: React.ComponentType<any>;
  parent?: string;
};

// Mapping untuk route dan metadata
const routeConfig: Record<string, RouteConfig> = {
  "/admin/dashboard": {
    title: "Dashboard",
    icon: Home,
  },
  "/admin/anime": {
    title: "Kelola Anime",
    icon: Film,
    parent: "/admin/dashboard",
  },
  "/admin/anime/tambah": {
    title: "Tambah Anime",
    icon: Film,
    parent: "/admin/anime",
  },
  "/admin/anime/edit": {
    title: "Edit Anime",
    icon: Film,
    parent: "/admin/anime",
  },
  "/admin/genre": {
    title: "Kelola Genre",
    icon: Tags,
    parent: "/admin/dashboard",
  },
  "/admin/genre/tambah": {
    title: "Tambah Genre",
    icon: Tags,
    parent: "/admin/genre",
  },
  "/admin/genre/edit": {
    title: "Edit Genre",
    icon: Tags,
    parent: "/admin/genre",
  },
  "/admin/user": {
    title: "Kelola Users",
    icon: Users,
    parent: "/admin/dashboard",
  },
  "/admin/settings": {
    title: "Pengaturan",
    icon: Settings,
    parent: "/admin/dashboard",
  },
};

// Type untuk breadcrumb item
type BreadcrumbItemType = {
  href: string;
  title: string;
  isCurrentPage: boolean;
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Fungsi untuk generate breadcrumb items
  const generateBreadcrumbItems = (): BreadcrumbItemType[] => {
    const items: BreadcrumbItemType[] = [];

    // Selalu mulai dengan Dashboard
    items.push({
      href: "/admin/dashboard",
      title: "Dashboard",
      isCurrentPage: pathname === "/admin/dashboard",
    });

    // Jika bukan di dashboard, tambahkan item sesuai path
    if (pathname !== "/admin/dashboard") {
      // Cek apakah ini halaman edit atau tambah dengan ID
      let currentPath = pathname;
      let config = routeConfig[currentPath] as RouteConfig | undefined;

      // Handle dynamic routes seperti /admin/anime/edit/[id] atau /admin/genre/edit/[id]
      if (!config) {
        // Coba cari pattern yang cocok
        const pathSegments = pathname.split("/");
        if (pathSegments.length > 4) {
          // Kemungkinan ada ID di path
          if (pathSegments[4] && pathSegments[3] === "edit") {
            currentPath = pathSegments.slice(0, 4).join("/");
            config = routeConfig[currentPath] as RouteConfig | undefined;
          }
        }
      }

      if (config && config.parent && config.parent !== "/admin/dashboard") {
        // Tambahkan parent item
        const parentConfig = routeConfig[config.parent] as
          | RouteConfig
          | undefined;
        if (parentConfig) {
          items.push({
            href: config.parent,
            title: parentConfig.title,
            isCurrentPage: false,
          });
        }
      }

      // Tambahkan current page
      if (config) {
        items.push({
          href: pathname,
          title: config.title,
          isCurrentPage: true,
        });
      } else {
        // Fallback untuk path yang tidak terdaftar
        const segments = pathname.split("/").filter(Boolean);
        const lastSegment = segments[segments.length - 1];
        const title =
          lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

        items.push({
          href: pathname,
          title: title,
          isCurrentPage: true,
        });
      }
    }

    return items;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isCurrentPage ? (
                <BreadcrumbPage className="font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={item.href}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  {item.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block mx-2" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
