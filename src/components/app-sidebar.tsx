"use client";

import {
  FileEdit,
  LayoutDashboard,
  ClipboardList,
  User,
  Users,
  Ambulance,
  ArrowLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavItemsType } from "@/types";
import Link from "next/link";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./toggle-mode";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const items: NavItemsType[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "PCR Form",
    url: "/admin/pcr-form",
    icon: FileEdit,
  },
  {
    title: "PCR Cases",
    url: "/admin/pcr-cases",
    icon: ClipboardList,
  },
  {
    title: "Ambulance Crews",
    url: "/admin/crews",
    icon: Users,
  },
  {
    title: "Ambulance Drivers",
    url: "/admin/drivers",
    icon: Ambulance,
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
        toast.success("Logged out successfully", {
          position: "top-right",
        });
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again."); // Optional error notification
    }
  };

  return (
    <Sidebar>
      <SidebarContent className="p-4">
        <SidebarHeader>
          <span className="text-lg pl-1 font-bold">PCR System</span>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">
            Navigation Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item: NavItemsType) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon size={60} />
                      <span className="text-md">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Popover>
          <div className="p-2 cursor-pointer flex justify-between items-center">
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2">
                <User className="text-xl" />
                <div>
                  <p className="text-sm font-semibold">MDRRMO Admin</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </PopoverTrigger>
            <ModeToggle />
          </div>

          <PopoverContent className="w-54 ml-1 mb-2 p-4 rounded-md">
            <div className="flex flex-col gap-2">
              <h4 className="font-medium">Are you sure you want to log out?</h4>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <ArrowLeft /> <span>Logout</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
};
