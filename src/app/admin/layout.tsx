import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

const AdminLayout = ({
    children
}: Readonly<{
    children: React.ReactNode
}>) => {
  return (
    <SidebarProvider>
    <AppSidebar/>
    <SidebarTrigger className="cursor-pointer sticky top-0 left-0" />
    {children}
  </SidebarProvider>
  )
}

export default AdminLayout