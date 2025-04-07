import { StaffType } from "@/types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment-timezone";

// Format a date to "Month YYYY" using Asia/Manila timezone
const formatMonthYear = (dateString: string) => {
  return moment.tz(dateString, "Asia/Manila").format("MMMM YYYY");
};

export const exportToExcelPersonnel = async (
  filteredData: StaffType[],
  exportTitle: string
) => {
  const workbook = new ExcelJS.Workbook();

  const groups: Record<
    string,
    Record<
      string,
      {
        name: string;
        totalTransportCases: number;
        totalEmergencyCases: number;
        totalNumberOfOperations: number;
      }
    >
  > = {};

  filteredData.forEach((staff) => {
    if (!staff.records || !Array.isArray(staff.records)) return;

    staff.records.forEach((record) => {
      const monthYear = formatMonthYear(record.date);

      if (!groups[monthYear]) {
        groups[monthYear] = {};
      }

      if (!groups[monthYear][staff.name]) {
        groups[monthYear][staff.name] = {
          name: staff.name,
          totalTransportCases: 0,
          totalEmergencyCases: 0,
          totalNumberOfOperations: 0,
        };
      }

      if (record.operationType === "TRANSPORT") {
        groups[monthYear][staff.name].totalTransportCases += 1;
      } else if (record.operationType === "EMERGENCY") {
        groups[monthYear][staff.name].totalEmergencyCases += 1;
      }

      groups[monthYear][staff.name].totalNumberOfOperations += 1;
    });
  });

  const sortedMonthKeys = Object.keys(groups).sort(
    (a, b) =>
      moment(a, "MMMM YYYY").toDate().getTime() -
      moment(b, "MMMM YYYY").toDate().getTime()
  );

  sortedMonthKeys.forEach((monthYear) => {
    const staffData = groups[monthYear];
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
        fgColor: { argb: "FFC0CB" }, // Light pink
      };
      cell.font = { bold: true, color: { argb: "000000" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    Object.values(staffData).forEach((data) => {
      worksheet.addRow({
        name: data.name,
        totalTransportCases: data.totalTransportCases,
        totalEmergencyCases: data.totalEmergencyCases,
        totalNumberOfOperations: data.totalNumberOfOperations,
      });
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
  saveAs(blob, `${exportTitle}_${moment().tz("Asia/Manila").format("YYYY-MM-DD")}.xlsx`);
};
