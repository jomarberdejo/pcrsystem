"use client";

import React from "react";
import { toast } from "sonner";
import { StaffType } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { staffColumns } from "@/components/shared/staff-columns";
import { exportToExcelPersonnel } from "@/utils/pcr-cases/exportToExcelPersonnel";

interface DriverClientProps {
  ambulanceDriverData: StaffType[];
}

export function DriverClient({ ambulanceDriverData }: DriverClientProps) {
  const onRegister = async (type: "CREW" | "DRIVER", name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/drivers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) throw new Error("Failed to add new driver");

      const newDriver = await response.json();
      toast.success("Success!", {
        description: `New ambulance driver added: ${newDriver.name}`,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error registering driver:", error);
      toast.error("Failed to add driver.");
    }
  };

  return (
    <DataTable
      columns={staffColumns}
      filterableColumns={["name"]}
      data={ambulanceDriverData}
      onExport={exportToExcelPersonnel}
      exportTitle="AMBULANCE_DRIVERS"
      onRegister={onRegister}
    />
  );
}
