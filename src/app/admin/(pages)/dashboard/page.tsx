import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileCog, Calendar1, Ambulance } from "lucide-react";
import { PCRReportType } from "@/types";
import {
  getCurrentMonthCases,
  getVehicleUsage,
} from "@/utils/dashboard/dataUtils";
import { computeAverageDiff } from "@/utils/dashboard/timeUtils";
import momentPH from "@/lib/moment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

const getPCRData = async (): Promise<PCRReportType[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pcr`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch PCR data");

  return res.json();
};

const Dashboard = async () => {
  let pcrData: PCRReportType[] = [];

  try {
    pcrData = await getPCRData();
  } catch (error) {
    return <p className="text-red-500">Failed to fetch data</p>;
  }

  const totalTransport = pcrData.filter(
    (record) => record.operationType === "TRANSPORT"
  ).length;

  const totalEmergency = pcrData.filter(
    (record) => record.operationType === "EMERGENCY"
  ).length;

  const vehicleUsage = getVehicleUsage(pcrData);
  const currentMonthCases = getCurrentMonthCases(pcrData);

  const averageCallToOpcenTransport = computeAverageDiff(
    pcrData,
    "timeCalled",
    "timeArrivedAt",
    "TRANSPORT"
  );

  const averageERTDispatchToOpcenTransport = computeAverageDiff(
    pcrData,
    "timeDispatched",
    "timeArrivedAt",
    "TRANSPORT"
  );

  const averageCallToOpcenEmergency = computeAverageDiff(
    pcrData,
    "timeCalled",
    "timeArrivedAt",
    "EMERGENCY"
  );

  const averageERTDispatchToOpcenEmergency = computeAverageDiff(
    pcrData,
    "timeDispatched",
    "timeArrivedAt",
    "EMERGENCY"
  );

  return (
    <div className="flex flex-col gap-10 w-full p-4">
      <h1 className="text-2xl font-bold text-primary-600">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center flex-row">
            <FileCog className="text-2xl text-primary-500 mr-2" />
            <CardTitle>Total PCR Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pcrData.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center flex-row">
            <Calendar1 className="text-2xl text-green-500 mr-2" />
            <CardTitle>
              Total PCR Cases for {momentPH().format("MMMM")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentMonthCases}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center flex-row">
            <FileCog className="text-2xl text-purple-500 mr-2" />
            <CardTitle>Total Transport & Emergency Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li className="space-y-4 flex justify-between items-center">
                <span>Transport</span>
                <span className="font-bold text-3xl">{totalTransport}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Emergency</span>
                <span className="font-bold text-3xl">{totalEmergency}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center flex-row">
            <Ambulance className="text-2xl text-yellow-500 mr-2" />
            <CardTitle>Vehicle Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {Object.entries(vehicleUsage).map(([vehicle, count]) => (
                <li
                  key={vehicle}
                  className="space-y-4 flex justify-between items-center"
                >
                  <span>{vehicle}</span>
                  <span className="font-bold text-3xl">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center flex-row">
            <Clock className="text-2xl text-orange-500 mr-2" />
            <CardTitle>TRANSPORT</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li className="flex justify-between items-center">
                <span>Call Received to Arrival at Opcen:</span>
                <span className="font-bold text-xl">
                  {averageCallToOpcenTransport}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>ERT Dispatch to Arrival at Opcen:</span>
                <span className="font-bold text-xl">
                  {averageERTDispatchToOpcenTransport}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center flex-row">
            <Clock className="text-2xl text-orange-500 mr-2" />
            <CardTitle>EMERGENCY</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li className="flex justify-between items-center">
                <span>Call Received to Arrival at Opcen:</span>
                <span className="font-bold text-xl">
                  {averageCallToOpcenEmergency}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>ERT Dispatch to Arrival at Opcen:</span>
                <span className="font-bold text-xl">
                  {averageERTDispatchToOpcenEmergency}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
