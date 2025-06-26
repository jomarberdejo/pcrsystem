"use client";

import { DataTable } from "@/components/shared/data-table";
import { exportToExcelAdvanced } from "@/utils/pcr-cases/exportToExcelCases";
import { columns as PCRColumns } from "./pcr-cases-column";
import useSWR from "swr";
import { PCRReportType } from "@/types";
import { DataTableSkeleton } from "@/components/skeletons/pcr-cases-skeleton";
import { useState } from "react";
import EditPCRModal from "../shared/edit-pcr-modal";
import { useUser } from "@/context/UserProvider";

const fetcher = async (url: string): Promise<PCRReportType[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetched pcr data");
  }
  return res.json();
};

export function PCRCaseClient() {
  const {
    data: pcrData,
    error,
    isLoading,
    mutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/pcr`, fetcher, {
    refreshInterval: 60000,
  });
  const [selectedPCR, setSelectedPCR] = useState<PCRReportType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useUser();

  if (error) return <p className="text-red-500">Failed to fetch data</p>;
  if (isLoading || !pcrData) return <DataTableSkeleton />;
  return (
    <>
      <DataTable
        columns={PCRColumns({
          setSelectedPCR,
          setModalOpen,
        })}
        data={pcrData}
        filterableColumns={["ambulanceDriver", "ambulanceCrews"]}
        onExport={exportToExcelAdvanced}
        exportTitle="PCR_CASES"
        hasDateRange={true}
        currentUserRole={user?.role}
      />

      <EditPCRModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPCR={selectedPCR}
        mutate={mutate}
      />
    </>
  );
}
