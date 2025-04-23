import { OperationType, PersonnelRole, Team } from "@prisma/client";
import { type LucideIcon } from "lucide-react";

type TimeProperties = {
  timeCalled?: string | null;
  timeDispatched?: string | null;
  timeAtScene?: string | null;
  timeTransport?: string | null;
  timeEndorsed?: string | null;
  timeArrivedAt?: string | null;
};

type Documentation = {
  documentation?: string[];
};

type IncidentProperties = {
  typeOfIncident?: string | null;
  placeOfIncident?: string | null;
  receivingFacility?: string | null;
  typeOfConduction?: string | null;
};

type OperationProperties = {
  operationType?: OperationType;
  date?: Date;
  chiefComplaint?: string;
  noOfCasualty?: string;
  remarks?: string;
  vehicleUsed?: string;
  vehiclesInvolved?: string;
  ambulanceDriverId?: string | null;
};

export interface PCRCaseRecordUpdateData
  extends TimeProperties,
  IncidentProperties,
  OperationProperties,
  Documentation { }

export type NavItemsType = {
  title: string;
  url: string;
  icon: LucideIcon;
}

export type PCRReportType = {
  id: string;
  operationType: "TRANSPORT" | "EMERGENCY";
  date: string;
  timeCalled: string;
  timeDispatched: string;
  timeAtScene: string;
  timeTransport: string;
  timeEndorsed: string;
  timeArrivedAt: string;
  typeOfIncident: string;
  placeOfIncident: string;
  receivingFacility: string;
  typeOfConduction: string;
  vehiclesInvolved: string;
  chiefComplaint: string;
  noOfCasualty: string;
  remarks: string;
  vehicleUsed: string;
  ambulanceDriver: string;
  ambulanceCrews: string;
  computationCallToOpcen: string;
  computationERTDispatch: string;
  documentation: string[];
}

export interface PersonnelType {
  id: string;
  name: string;
  team: Team;
  role: PersonnelRole;
  status: "ARCHIVED" | "ACTIVE";
  archivedAt: string;
  totalTransportCases: number;
  totalEmergencyCases: number;
  totalNumberOfOperations: number;
  records: {
    date: string;
    operationType: "EMERGENCY" | "TRANSPORT";
  }[];
}

export type StaffFormPropType = {
  children: React.ReactNode;
  type: "CREW" | "DRIVER";
  onRegister: (type: "CREW" | "DRIVER", name: string, team: string) => void;
};
