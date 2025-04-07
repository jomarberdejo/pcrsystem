"use client";

import { PCRReportType } from "@/types";
import { DataTable } from "@/components/shared/data-table";
import { exportToExcelAdvanced } from "@/utils/pcr-cases/exportToExcelCases";
import { columns } from "./pcr-cases-column";

interface PCRClientProps {
  pcrData: PCRReportType[];
}

export default function PCRClient({ pcrData }: PCRClientProps) {
  return (
    <DataTable
      columns={columns}
      data={pcrData}
      filterableColumns={["ambulanceDriver", "ambulanceCrews"]}
      onExport={exportToExcelAdvanced}
      exportTitle="PCR_CASES"
      hasDateRange={true}
    />
  );
}
