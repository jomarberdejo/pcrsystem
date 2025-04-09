"use client";

import React from "react";
import { toast } from "sonner";
import { StaffType } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { staffColumns } from "@/components/shared/staff-columns";
import { exportToExcelPersonnel } from "@/utils/pcr-cases/exportToExcelPersonnel";
import useSWR from "swr";

const fetcher = async (url: string): Promise<StaffType[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetched ambulance drivers data");
  }
  return res.json();
};

export function DriverClient() {
  const {
    data: ambulanceDriverData,
    error,
    isLoading,
    mutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/drivers`, fetcher, {
    refreshInterval: 60000,
  });

  if (error) {
    return <p className="text-red-500">Failed to fetch data</p>;
  }

  if (isLoading || !ambulanceDriverData) {
    return <p>Loading ambulance driver data...</p>;
  }

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
      mutate();
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
