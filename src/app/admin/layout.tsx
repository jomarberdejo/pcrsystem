import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { UserProvider } from "@/context/UserProvider";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className="cursor-pointer sticky top-0 left-0" />
        {children}
      </SidebarProvider>
    </UserProvider>
  );
};

export default AdminLayout;
