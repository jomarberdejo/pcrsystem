import momentPH from "@/lib/moment";
import { PersonnelType } from "@/types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const formatMonthYear = (dateString: string) => {
  return momentPH().format("MMMM YYYY");
};

export const exportToExcelPersonnel = async (
  filteredData: PersonnelType[],
  exportTitle: string
) => {
  const workbook = new ExcelJS.Workbook();

  const allStaffNames = new Set<string>();
  const allMonthYears = new Set<string>();

  const dataMap: Record<
    string,
    Record<string, {
      name: string;
      totalTransportCases: number;
      totalEmergencyCases: number;
      totalNumberOfOperations: number;
    }>
  > = {};

  filteredData.forEach((staff) => {
    allStaffNames.add(staff.name);

    if (!staff.records || !Array.isArray(staff.records)) return;

    staff.records.forEach((record) => {
      const monthYear = formatMonthYear(record.date);
      allMonthYears.add(monthYear);

      if (!dataMap[monthYear]) {
        dataMap[monthYear] = {};
      }

      if (!dataMap[monthYear][staff.name]) {
        dataMap[monthYear][staff.name] = {
          name: staff.name,
          totalTransportCases: 0,
          totalEmergencyCases: 0,
          totalNumberOfOperations: 0,
        };
      }

      if (record.operationType === "TRANSPORT") {
        dataMap[monthYear][staff.name].totalTransportCases += 1;
      } else if (record.operationType === "EMERGENCY") {
        dataMap[monthYear][staff.name].totalEmergencyCases += 1;
      }

      dataMap[monthYear][staff.name].totalNumberOfOperations += 1;
    });
  });

  allMonthYears.forEach((monthYear) => {
    if (!dataMap[monthYear]) {
      dataMap[monthYear] = {};
    }

    allStaffNames.forEach((name) => {
      if (!dataMap[monthYear][name]) {
        dataMap[monthYear][name] = {
          name,
          totalTransportCases: 0,
          totalEmergencyCases: 0,
          totalNumberOfOperations: 0,
        };
      }
    });
  });

  const sortedMonthKeys = Array.from(allMonthYears).sort(
    (a, b) =>
      momentPH(a, "MMMM YYYY").toDate().getTime() -
      momentPH(b, "MMMM YYYY").toDate().getTime()
  );

  sortedMonthKeys.forEach((monthYear) => {
    const staffData = dataMap[monthYear];
    const worksheet = workbook.addWorksheet(monthYear);

    worksheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Total Transport Cases", key: "totalTransportCases", width: 25 },
      { header: "Total Emergency Cases", key: "totalEmergencyCases", width: 25 },
      { header: "Total Number of Operations", key: "totalNumberOfOperations", width: 30 },
    ];

    worksheet.columns.forEach((column, colIndex) => {
      const cell = worksheet.getCell(1, colIndex + 1);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC0CB" },
      };
      cell.font = { bold: true, color: { argb: "000000" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    Object.values(staffData).forEach((data) => {
      worksheet.addRow(data);
    });

    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 4 },
    };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${exportTitle}_${momentPH().format("YYYY-MM-DD")}.xlsx`);
};

