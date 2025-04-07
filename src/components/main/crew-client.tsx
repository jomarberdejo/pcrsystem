"use client";

import { StaffType } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { exportToExcelPersonnel } from "@/utils/pcr-cases/exportToExcelPersonnel";
import { staffColumns } from "@/components/shared/staff-columns";
import { toast } from "sonner";

interface CrewClientProps {
  ambulanceCrewData: StaffType[];
}

export function CrewClient({ ambulanceCrewData }: CrewClientProps) {
  const onRegister = async (type: "CREW" | "DRIVER", name: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/crews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add new crew");
      }

      const newCrew = await response.json();
      toast.success("Success!", {
        description: `New ambulance crew added: ${newCrew.name}`,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error registering crew:", error);
      toast.error("Failed to add crew.");
    }
  };

  return (
    <DataTable
      columns={staffColumns}
      filterableColumns={["name"]}
      data={ambulanceCrewData}
      onExport={exportToExcelPersonnel}
      exportTitle="AMBULANCE_CREWS"
      onRegister={onRegister}
    />
  );
}
