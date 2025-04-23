import momentPH from "@/lib/moment";
import { PCRReportType } from "@/types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const aggregatePersonnelData = (filteredData: PCRReportType[]) => {
  const personnelStats = new Map<string, { totalOps: number; transportCases: number; emergencyCases: number }>();

  filteredData.forEach((report) => {
    if (report.ambulanceCrews) {
      const crews = report.ambulanceCrews.split(",").map((crew) => crew.trim());
      crews.forEach((crew) => {
        if (!personnelStats.has(crew)) {
          personnelStats.set(crew, { totalOps: 0, transportCases: 0, emergencyCases: 0 });
        }
        const stats = personnelStats.get(crew)!;
        stats.totalOps++;
        if (report.operationType?.toLowerCase() === "transport") stats.transportCases++;
        if (report.operationType?.toLowerCase() === "emergency") stats.emergencyCases++;
      });
    }

    if (report.ambulanceDriver) {
      const driver = report.ambulanceDriver.trim();
      if (!personnelStats.has(driver)) {
        personnelStats.set(driver, { totalOps: 0, transportCases: 0, emergencyCases: 0 });
      }
      const stats = personnelStats.get(driver)!;
      stats.totalOps++;
      if (report.operationType?.toLowerCase() === "transport") stats.transportCases++;
      if (report.operationType?.toLowerCase() === "emergency") stats.emergencyCases++;
    }
  });

  return personnelStats;
};

export const exportToExcelAdvanced = async (filteredData: PCRReportType[], exportTitle: string) => {
  const workbook = new ExcelJS.Workbook();

  const groupedByMonth = filteredData.reduce((acc, report) => {
    const date = momentPH(report.date, "YYYY MMMM DD (dddd)");
    const readableMonthYear = date.format("MMMM YYYY");

    if (!acc[readableMonthYear]) {
      acc[readableMonthYear] = [];
    }

    acc[readableMonthYear].push(report);
    return acc;
  }, {} as Record<string, PCRReportType[]>);

  const sortedMonthKeys = Object.keys(groupedByMonth).sort((a, b) =>
    momentPH(a, "MMMM YYYY").diff(momentPH(b, "MMMM YYYY"))
  );

  const headerStyle = {
    font: { bold: true, size: 12, name: "Calibri" },
    alignment: { vertical: "middle", horizontal: "center" },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF6C1C1" },
    },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };

  sortedMonthKeys.forEach((monthYear) => {
    const worksheet = workbook.addWorksheet(monthYear);

    worksheet.columns = [
      { header: "Operation Type", key: "operationType", width: 12 },
      { header: "Date", key: "date", width: 12 },
      { header: "Time Called", key: "timeCalled", width: 12 },
      { header: "Time Dispatched", key: "timeDispatched", width: 12 },
      { header: "Time at Scene", key: "timeAtScene", width: 12 },
      { header: "Time Transport", key: "timeTransport", width: 12 },
      { header: "Time Endorsed", key: "timeEndorsed", width: 12 },
      { header: "Time Arrived At", key: "timeArrivedAt", width: 12 },
      { header: "Type of Incident", key: "typeOfIncident", width: 15 },
      { header: "Place of Incident", key: "placeOfIncident", width: 15 },
      { header: "Receiving Facility", key: "receivingFacility", width: 15 },
      { header: "Type of Conduction", key: "typeOfConduction", width: 12 },
      { header: "Vehicles Involved", key: "vehiclesInvolved", width: 15 },
      { header: "Chief Complaint", key: "chiefComplaint", width: 15 },
      { header: "No. of Casualty", key: "noOfCasualty", width: 10 },
      { header: "Remarks", key: "remarks", width: 20 },
      { header: "Vehicle Used", key: "vehicleUsed", width: 15 },
      { header: "Ambulance Driver", key: "ambulanceDriver", width: 15 },
      { header: "Ambulance Crew(s)", key: "ambulanceCrews", width: 20 },
      { header: "Call Received to Arrival at Opcen", key: "computationCallToOpcen", width: 20 },
      { header: "ERT Dispatch to Arrival at Opcen", key: "computationERTDispatch", width: 20 },
      { header: "Documentation", key: "documentation", width: 40 },
    ];

    groupedByMonth[monthYear].forEach((report) => {
      const row = worksheet.addRow({
        ...report,
        ambulanceCrews: report.ambulanceCrews || "",
      });

      const docCell = row.getCell("documentation");
      if (Array.isArray(report.documentation) && report.documentation.length > 0) {
        const hyperlinks = report.documentation.map((doc, index) => ({
          text: `Link ${index + 1}`,
          hyperlink: doc,
        }));

        if (hyperlinks.length === 1) {
          docCell.value = { text: "View File", hyperlink: hyperlinks[0].hyperlink };
          docCell.font = { color: { argb: "FF0000FF" }, underline: true };
        } else {
          docCell.value = hyperlinks.map(link => `${link.text}: ${link.hyperlink}`).join("\n");
        }

        docCell.alignment = { wrapText: true };
      }
    });

    const headerRow = worksheet.getRow(1);
    headerRow.height = 20;
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    worksheet.autoFilter = "A1:U1";
  });

  const personnelStats = aggregatePersonnelData(filteredData);
  const firstMonth = sortedMonthKeys[0];
  const lastMonth = sortedMonthKeys[sortedMonthKeys.length - 1];
  const personnelSheetName = `Sum (${firstMonth}-${lastMonth})`;

  const personnelSummarySheet = workbook.addWorksheet(personnelSheetName);
  personnelSummarySheet.columns = [
    { header: "Personnel", key: "personnel", width: 25 },
    { header: "Total Operations", key: "totalOps", width: 20 },
    { header: "Transport Cases", key: "transportCases", width: 20 },
    { header: "Emergency Cases", key: "emergencyCases", width: 20 },
  ];

  personnelStats.forEach((stats, personnel) => {
    personnelSummarySheet.addRow({ personnel, ...stats });
  });

  const summaryHeader = personnelSummarySheet.getRow(1);
  summaryHeader.height = 20;
  summaryHeader.eachCell((cell) => Object.assign(cell, headerStyle));

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${exportTitle}_${new Date().toLocaleDateString()}.xlsx`);
};
