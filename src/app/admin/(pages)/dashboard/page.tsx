"use client";

import React from "react";
import useSWR from "swr";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileCog, Calendar1, Ambulance } from "lucide-react";
import { PCRReportType } from "@/types";
import {
  getCurrentMonthCases,
  getTopLocation,
  getVehicleUsage,
} from "@/utils/dashboard/dataUtils";
import { computeAverageDiff } from "@/utils/dashboard/timeUtils";

const fetcher = (url: string): Promise<PCRReportType[]> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch PCR data");
    return res.json();
  });

const Dashboard = () => {
  const {
    data: pcrData,
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/pcr`, fetcher, {
    refreshInterval: 60000,
  });

  if (error) return <p className="text-red-500">Failed to fetch data</p>;
  if (isLoading || !pcrData) return <p>Loading dashboard data...</p>;

  const totalTransport = pcrData.filter(
    (record) => record.operationType === "TRANSPORT"
  ).length;
  const totalEmergency = pcrData.filter(
    (record) => record.operationType === "EMERGENCY"
  ).length;

  const vehicleUsage = getVehicleUsage(pcrData);
  // const topLocation = getTopLocation(pcrData);
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
            <CardTitle>Total PCR Cases for {moment().format("MMMM")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentMonthCases}</p>
          </CardContent>
        </Card>

        {/* Uncomment if you want to show top location */}
        {/* <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center flex-row">
            <MapPin className="text-2xl text-red-500 mr-2" />
            <CardTitle>Top Incident Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span>{topLocation.location}</span>
              <span className="font-bold text-xl">{topLocation.count} (cases)</span>
            </div>
          </CardContent>
        </Card> */}

        <Card className="shadow-lg rounded-lg">
          <CardHeader className="flex items-center flex-row">
            <FileCog className="text-2xl text-purple-500 mr-2" />
            <CardTitle>Total Transport & Emergency Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Transport</span>
                    <span className="font-bold text-3xl">{totalTransport}</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex justify-between items-center">
                  <span>Emergency</span>
                  <span className="font-bold text-3xl">{totalEmergency}</span>
                </div>
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
                <li key={vehicle} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{vehicle}</span>
                    <span className="font-bold text-3xl">{count}</span>
                  </div>
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
              <li className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Call Received to Arrival at Opcen:</span>
                  <span className="font-bold text-xl">
                    {averageCallToOpcenTransport}
                  </span>
                </div>
              </li>
              <li className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>ERT Dispatch to Arrival at Opcen:</span>
                  <span className="font-bold text-xl">
                    {averageERTDispatchToOpcenTransport}
                  </span>
                </div>
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
              <li className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Call Received to Arrival at Opcen:</span>
                  <span className="font-bold text-xl">
                    {averageCallToOpcenEmergency}
                  </span>
                </div>
              </li>
              <li className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>ERT Dispatch to Arrival at Opcen:</span>
                  <span className="font-bold text-xl">
                    {averageERTDispatchToOpcenEmergency}
                  </span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
