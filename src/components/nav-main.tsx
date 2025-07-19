"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.items ? (
                <Collapsible
                  defaultOpen={pathname.startsWith(item.url)}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger asChild className="cursor-pointer">
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`
                        w-full transition-all duration-200 relative overflow-hidden
                        data-[state=open]:!bg-slate-700/60 data-[state=open]:!text-white data-[state=open]:hover:!bg-slate-700/80
                        data-[state=closed]:bg-transparent data-[state=closed]:hover:bg-slate-700/50
                        ${
                          pathname.startsWith(item.url)
                            ? "bg-sky-500/15 text-sky-200 shadow-sm hover:!bg-sky-500/25 data-[state=open]:!bg-sky-500/20 data-[state=open]:hover:!bg-sky-500/30 data-[state=closed]:!bg-sky-500/15 data-[state=closed]:hover:!bg-sky-500/25"
                            : "text-slate-300 hover:!bg-slate-700/60 hover:!text-white"
                        }
                      `}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />

                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-500/10 translate-x-[-100%] hover:translate-x-0 transition-transform duration-300 ease-out" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-6 border-l border-slate-600/30 pl-4 space-y-1">
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={`
                              transition-all duration-200 relative text-sm
                              ${
                                pathname === subItem.url
                                  ? "bg-sky-600/20 text-sky-100 font-medium hover:!bg-sky-600/30 border-l-2 border-sky-400 pl-3"
                                  : "text-slate-400 hover:!bg-slate-700/40 hover:!text-slate-200 pl-3"
                              }
                            `}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={`
                    transition-all duration-200 relative overflow-hidden
                    ${
                      pathname === item.url
                        ? "bg-sky-500/25 text-white shadow-md hover:!bg-sky-500/35 "
                        : "text-slate-300 hover:!bg-slate-700/60 hover:!text-white"
                    }
                  `}
                >
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>

                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-blue-500/10 translate-x-[-100%] hover:translate-x-0 transition-transform duration-300 ease-out" />
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
