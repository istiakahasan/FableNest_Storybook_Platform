"use client";

import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Separator } from "./separator";
import Link from "next/link";
import {
  CBooks,
  CGrid,
  CPromo,
  CSetting,
  CShieldNote,
  CTodo,
  CUser,
} from "../icons/customIcons";

const navigationItems = [
  {
    title: "Overview",
    icon: CGrid,
    url: "/dashboard",
  },
  {
    title: "User Management",
    icon: CUser,
    url: "/dashboard/user-management",
  },
  {
    title: "Order Management",
    icon: CTodo,
    url: "/dashboard/order-management",
  },
  {
    title: "Books",
    icon: CBooks,
    url: "/dashboard/books",
  },
  {
    title: "Privacy Policy",
    icon: CShieldNote,
    url: "/dashboard/privacy-policy",
  },
  {
    title: "Terms & Condition",
    icon: CShieldNote,
    url: "/dashboard/terms-condition",
  },
  {
    title: "Promo Codes",
    icon: CPromo,
    url: "/dashboard/promo-codes",
  },
  {
    title: "Settings",
    icon: CSetting,
    url: "/dashboard/settings",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Remove locale prefix for comparison
  const getPathnameWithoutLocale = () => {
    // Remove locale prefix like /en/, /fr/, etc.
    // Matches /en/, /fr/, /de/, etc. (2-3 letter language codes)
    return pathname.replace(/^\/[a-z]{2,3}(\/|$)/, "/");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center px-1.5 py-4 group-data-[collapsible=icon]:py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 relative">
          <Image
            src="/images/dashboard/dash-face-logo.png"
            alt="Dashboard logo"
            width={100}
            height={100}
          />
        </div>

        <Separator />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                // Get pathname without locale
                const cleanPathname = getPathnameWithoutLocale();

                // Determine if the current item is active
                const isActive =
                  // For Overview (exact match only)
                  (item.url === "/dashboard" &&
                    cleanPathname === "/dashboard") ||
                  // For all other items (match exact or sub-routes)
                  (item.url !== "/dashboard" &&
                    (cleanPathname === item.url ||
                      cleanPathname.startsWith(item.url + "/")));

                // Debug log to check what's happening
                console.log({
                  item: item.title,
                  url: item.url,
                  pathname: pathname,
                  cleanPathname: cleanPathname,
                  isActive: isActive,
                });

                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} className="block">
                      <SidebarMenuButton
                        size={"lg"}
                        tooltip={item.title}
                        className={`
                        group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-12! group-data-[collapsible=icon]:h-12! group-data-[collapsible=icon]:p-0! px-4 group-data-[collapsible=icon]:mx-auto cursor-pointer gap-3 mb-1 transition

                        ${
                          isActive
                            ? "bg-[#00244A]!"
                            : "bg-transparent! hover:bg-[#00244A]/10!"
                        }
                        
                        `}>
                        <item.icon
                          className={`
                          size-6! group-data-[collapsible=icon]:size-6! ${
                            isActive ? "text-white" : "text-[#61758A]"
                          }
                          `}
                        />
                        <span
                          className={`
                          group-data-[collapsible=icon]:hidden text-base font-medium  ${
                            isActive ? "text-white" : "text-gray-800"
                          }
                          `}>
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
