import { z } from "zod";

export const formSchema = z.object({
  operationType: z.string().min(1, "Operation type is required"),
  date: z.date(),
  timeCalled: z.date(),
  timeDispatched: z.date(),
  timeAtScene: z.date(),
  timeTransport: z.date(),
  timeEndorsed: z.date(),
  timeArrivedAt: z.date(),
  typeOfIncident: z.string().min(1, "Incident type is required"),
  placeOfIncident: z.string().min(1, "Place of incident is required"),
  receivingFacility: z.string().min(1, "Receiving facility is required"),
  typeOfConduction: z.string().min(1, "Type of conduction is required"),
  vehiclesInvolved: z.array(z.string()).optional(),
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  noOfCasualty: z.string().min(1, "No. of casualty is required"),
  remarks: z.string().min(1, "Remarks are required"),
  vehicleUsed: z.string().min(1, "Vehicle used is required"),
  ambulanceDriver: z.string().min(1, "Ambulance driver is required"),
  ambulanceCrew: z.array(z.string()).min(1, "At least one ambulance crew member is required"),
  documentation: z.array(z.instanceof(File)).min(1, "At least one document is required"),
});
