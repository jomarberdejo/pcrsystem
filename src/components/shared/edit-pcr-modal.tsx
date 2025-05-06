import { PCRReportType, PersonnelType } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { formSchema } from "@/schemas";
import { useOptions } from "@/hooks/use-options";
import {
  incidentTypeList,
  placeOfIncidentAndReceivingFacilities,
  typeOfConduction,
  vehiclesInvolvedList,
  vehicleUsedList,
} from "@/constants";
import { DatePicker } from "@/components/date-picker";
import { TimePickerDemo } from "@/components/timepicker";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Check, CloudUpload, Loader, Paperclip } from "lucide-react";
import momentPH from "@/lib/moment";
import { parseTimeStringToDate } from "@/lib/utils";
import { updatePCRCaseRecord } from "@/actions";
import { Input } from "../ui/input";

// const editFormSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   team: z.string().optional(),
//   role: z.string().min(1, "Role/Designation is required"),
//   status: z.enum(["ACTIVE", "ARCHIVED"]),
//   archivedAt: z.string().optional(),
// });

type EditPCRTypeProps = {
  open: boolean;
  onClose: () => void;
  selectedPCR: PCRReportType | null;
  mutate: () => void;
};

export default function EditPCRModal({
  open,
  onClose,
  selectedPCR,
  mutate,
}: EditPCRTypeProps) {
  const [operationType, setOperationType] = useState<
    "EMERGENCY" | "TRANSPORT" | ""
  >("");
  const { driverOptions, crewOptions, isError } = useOptions();
  const [customIncident, setCustomIncident] = useState<string>("");
  const [customVehicleUsed, setCustomVehicleUsed] = useState<string>("");
  const [customPlaceOfIncident, setCustomPlaceOfIncident] =
    useState<string>("");
  const [customReceivingFacility, setCustomReceivingFacility] =
    useState<string>("");
  const [customTypeOfConduction, setCustomTypeOfConduction] =
    useState<string>("");

  const filteredIncidentTypes = useMemo(() => {
    return operationType
      ? incidentTypeList.filter(({ type }) => type === operationType)
      : [];
  }, [operationType]);

  const incidentNames = incidentTypeList.map((i) => i.name);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operationType: "",
      date: new Date(),
      timeCalled: undefined,
      timeDispatched: undefined,
      timeAtScene: undefined,
      timeTransport: undefined,
      timeEndorsed: undefined,
      timeArrivedAt: undefined,
      typeOfIncident: "",
      placeOfIncident: "",
      receivingFacility: "",
      typeOfConduction: "",
      vehiclesInvolved: [],
      chiefComplaint: "",
      noOfCasualty: "",
      remarks: "",
      vehicleUsed: "",
      ambulanceDriver: "",
      ambulanceCrew: [],
      documentation: [],
    },
  });

  useEffect(() => {
    console.log("RENDERED ");
    if (selectedPCR) {
      // console.log("SELECTED PCR");
      setOperationType(selectedPCR.operationType);

      setCustomIncident(selectedPCR.typeOfIncident || "");
      setCustomPlaceOfIncident(selectedPCR.placeOfIncident || "");
      setCustomReceivingFacility(selectedPCR.receivingFacility || "");
      setCustomTypeOfConduction(selectedPCR.typeOfConduction || "");
      setCustomVehicleUsed(selectedPCR.vehicleUsed || "");

      // FIX THE EDIT FIELD FOR OTHERS BECAUSE IT SHOWS EVEN CUSTOM VALYES IS EMPTY AND SELECTED HAS EMPTY VALUES

      const selectedCrewNames =
        selectedPCR.ambulanceCrews?.split(",").map((name) => name.trim()) || [];

      const selectedCrewIds = crewOptions
        .filter((option) => selectedCrewNames.includes(option.name))
        .map((option) => option.id);
      const selectedDriver = driverOptions.find(
        (option) => option.name === selectedPCR.ambulanceDriver
      );

      const selectedVehicleNames =
        selectedPCR.vehiclesInvolved?.split(",").map((name) => name.trim()) ||
        [];

      const selectedVehiclesInvolved = vehiclesInvolvedList
        .filter((vehicle) => selectedVehicleNames.includes(vehicle.value))
        .map((vehicle) => vehicle.value);

      const selectedDriverId = selectedDriver ? selectedDriver.id : "";
      const format = "YYYY MMMM DD (dddd)";
      form.reset({
        operationType: selectedPCR.operationType,
        date: momentPH(selectedPCR.date, format).toDate(),
        timeCalled: parseTimeStringToDate(selectedPCR.timeCalled) || undefined,
        timeDispatched:
          parseTimeStringToDate(selectedPCR.timeDispatched) || undefined,
        timeAtScene:
          parseTimeStringToDate(selectedPCR.timeAtScene) || undefined,
        timeTransport:
          parseTimeStringToDate(selectedPCR.timeTransport) || undefined,
        timeEndorsed:
          parseTimeStringToDate(selectedPCR.timeEndorsed) || undefined,
        timeArrivedAt:
          parseTimeStringToDate(selectedPCR.timeArrivedAt) || undefined,
        typeOfIncident: !incidentNames.includes(selectedPCR.typeOfIncident)
          ? "Others"
          : selectedPCR.typeOfIncident,
        placeOfIncident: !placeOfIncidentAndReceivingFacilities.includes(
          selectedPCR.placeOfIncident
        )
          ? "Others"
          : selectedPCR.placeOfIncident,
        receivingFacility: !placeOfIncidentAndReceivingFacilities.includes(
          selectedPCR.receivingFacility
        )
          ? "Others"
          : selectedPCR.receivingFacility,
        typeOfConduction: !typeOfConduction.includes(
          selectedPCR.typeOfConduction
        )
          ? "Others"
          : selectedPCR.typeOfConduction,
        vehiclesInvolved: selectedVehiclesInvolved,
        chiefComplaint: selectedPCR.chiefComplaint,
        noOfCasualty: selectedPCR.noOfCasualty,
        remarks: selectedPCR.remarks,
        vehicleUsed: !vehicleUsedList.includes(selectedPCR.vehicleUsed)
          ? "Others"
          : selectedPCR.vehicleUsed,
        ambulanceDriver: selectedDriverId,
        ambulanceCrew: selectedCrewIds,
        documentation: [],
      });
    }
  }, [selectedPCR, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedPCR) return;
    try {
      const formData = new FormData();

      formData.append("operationType", values.operationType);
      formData.append("date", values.date.toISOString());

      if (values.timeCalled)
        formData.append("timeCalled", values.timeCalled.toISOString());
      if (values.timeDispatched)
        formData.append("timeDispatched", values.timeDispatched.toISOString());
      if (values.timeAtScene)
        formData.append("timeAtScene", values.timeAtScene.toISOString());
      if (values.timeTransport)
        formData.append("timeTransport", values.timeTransport.toISOString());
      if (values.timeEndorsed)
        formData.append("timeEndorsed", values.timeEndorsed.toISOString());
      if (values.timeArrivedAt)
        formData.append("timeArrivedAt", values.timeArrivedAt.toISOString());

      if (values.typeOfIncident)
        formData.append(
          "typeOfIncident",
          values.typeOfIncident === "Others"
            ? customIncident
            : values.typeOfIncident
        );
      if (values.placeOfIncident)
        formData.append(
          "placeOfIncident",
          values.placeOfIncident === "Others"
            ? customPlaceOfIncident
            : values.placeOfIncident
        );
      if (values.receivingFacility)
        formData.append(
          "receivingFacility",
          values.receivingFacility === "Others"
            ? customReceivingFacility
            : values.receivingFacility
        );
      if (values.typeOfConduction)
        formData.append(
          "typeOfConduction",
          values.typeOfConduction === "Others"
            ? customTypeOfConduction
            : values.typeOfConduction
        );
      if (values.chiefComplaint)
        formData.append("chiefComplaint", values.chiefComplaint);
      if (values.noOfCasualty)
        formData.append("noOfCasualty", values.noOfCasualty);
      if (values.remarks) formData.append("remarks", values.remarks);
      if (values.vehicleUsed)
        formData.append(
          "vehicleUsed",
          values.vehicleUsed === "Others"
            ? customVehicleUsed
            : values.vehicleUsed
        );
      if (values.ambulanceDriver)
        formData.append("ambulanceDriver", values.ambulanceDriver);

      if (values.vehiclesInvolved) {
        values.vehiclesInvolved.forEach((vehicle) =>
          formData.append("vehiclesInvolved", vehicle)
        );
      }

      if (values.ambulanceCrew && values.ambulanceCrew.length > 0) {
        values.ambulanceCrew.forEach((crew) =>
          formData.append("ambulanceCrew", crew)
        );
      }

      if (values.documentation && values.documentation.length > 0) {
        values.documentation.forEach((file: File) =>
          formData.append("documentation", file)
        );
      }

      await updatePCRCaseRecord(selectedPCR?.id, formData);

      toast.success("PCR case updated successfully!", {
        description: "The PCR case has been successfully updated.",
        position: "top-right",
      });

      mutate();
      onClose();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  if (isError) return <p>Error loading options.</p>;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="min-w-screen overflow-y-scroll max-h-screen"
        aria-describedby="dialog-content"
      >
        <DialogHeader>
          <DialogTitle>Edit PCR</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full mx-auto flex flex-col justify-center px-2 py-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-16 gap-4">
              {/* Operation Type */}
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="operationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operation Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setOperationType(
                              value as "EMERGENCY" | "TRANSPORT"
                            );
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select Operation Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EMERGENCY">Emergency</SelectItem>
                            <SelectItem value="TRANSPORT">Transport</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Date */}
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Time Called */}
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="timeCalled"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Call Received</FormLabel>
                      <FormControl>
                        <TimePickerDemo
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Time Dispatched */}
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="timeDispatched"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time ERT Dispatched</FormLabel>
                      <FormControl>
                        <TimePickerDemo
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional time fields */}
            <div className="grid grid-cols-1 lg:grid-cols-16 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="timeAtScene"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time at Scene</FormLabel>
                      <FormControl>
                        <TimePickerDemo
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="timeTransport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time of Transport</FormLabel>
                      <FormControl>
                        <TimePickerDemo
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="timeEndorsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Endorsed</FormLabel>
                      <FormControl>
                        <TimePickerDemo
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="timeArrivedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Arrived At Opcen</FormLabel>
                      <FormControl>
                        <TimePickerDemo
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Incident & Facility Details */}
            <div className="grid grid-cols-1 lg:grid-cols-16 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="typeOfIncident"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Incident</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select Type of Incident" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredIncidentTypes.map(({ name }) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("typeOfIncident") === "Others" && (
                  <Input
                    className="mt-1"
                    placeholder="Specify Other (leave blank if not applicable)"
                    value={customIncident}
                    onChange={(e) => setCustomIncident(e.target.value)}
                  />
                )}
              </div>

              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="placeOfIncident"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Incident</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select Place of Incident" />
                          </SelectTrigger>
                          <SelectContent className="h-[300px]">
                            {placeOfIncidentAndReceivingFacilities.map(
                              (value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("placeOfIncident") === "Others" && (
                  <Input
                    className="mt-1"
                    placeholder="Specify Other (leave blank if not applicable)"
                    value={customPlaceOfIncident}
                    onChange={(e) => setCustomPlaceOfIncident(e.target.value)}
                  />
                )}
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="receivingFacility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiving Facility</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select Receiving Facility" />
                          </SelectTrigger>
                          <SelectContent className="h-[300px]">
                            {placeOfIncidentAndReceivingFacilities.map(
                              (value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("receivingFacility") === "Others" && (
                  <Input
                    className="mt-1"
                    placeholder="Specify Other (leave blank if not applicable)"
                    value={customReceivingFacility}
                    onChange={(e) => setCustomReceivingFacility(e.target.value)}
                  />
                )}
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="typeOfConduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Conduction</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select Type of Conduction" />
                          </SelectTrigger>
                          <SelectContent className="h-[300px]">
                            {typeOfConduction.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("typeOfConduction") === "Others" && (
                  <Input
                    className="mt-1"
                    placeholder="Specify Other (leave blank if not applicable)"
                    value={customTypeOfConduction}
                    onChange={(e) => setCustomTypeOfConduction(e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Vehicles, Chief Complaint, Casualty, Remarks */}
            <div className="grid grid-cols-1 lg:grid-cols-16 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="vehiclesInvolved"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicles Involved</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={vehiclesInvolvedList}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select vehicles involved"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="chiefComplaint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chief Complaint</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Chief Complaint" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="noOfCasualty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. of Casualty</FormLabel>
                      <FormControl>
                        <Textarea placeholder="No. of Casualty" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Remarks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Vehicle Used, Ambulance Driver, Ambulance Crew, Documentation */}
            <div className="grid grid-cols-1 lg:grid-cols-16 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="vehicleUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Used</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select Vehicle Used" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicleUsedList.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("vehicleUsed") === "Others" && (
                  <Input
                    className="mt-1"
                    placeholder="Specify Other (leave blank if not applicable)"
                    value={customVehicleUsed}
                    onChange={(e) => setCustomVehicleUsed(e.target.value)}
                  />
                )}
              </div>

              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="ambulanceDriver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ambulance Driver</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select Driver" />
                          </SelectTrigger>
                          <SelectContent>
                            {driverOptions.map(
                              (driver: { id: string; name: string }) => (
                                <SelectItem key={driver.id} value={driver.id}>
                                  {driver.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="ambulanceCrew"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ambulance Crew(s)</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={crewOptions.map(
                            (crew: { id: string; name: string }) => ({
                              label: crew.name,
                              value: crew.id,
                            })
                          )}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select Ambulance Crew(s)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="documentation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documentation</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value ?? null}
                          onValueChange={field.onChange}
                          dropzoneOptions={dropZoneConfig}
                          className="relative bg-background rounded-lg p-2"
                        >
                          <FileInput
                            id="fileInput"
                            className="outline-dashed outline-1 outline-slate-500"
                          >
                            <div className="flex items-center justify-center flex-col p-8 w-full ">
                              <CloudUpload className="text-gray-500 w-10 h-10" />
                              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG
                              </p>
                            </div>
                          </FileInput>
                          <FileUploaderContent>
                            {field.value &&
                              Array.isArray(field.value) &&
                              field.value.map((file: File, i: number) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="h-4 w-4 stroke-current" />
                                  <span>{file.name}</span>
                                </FileUploaderItem>
                              ))}
                          </FileUploaderContent>
                        </FileUploader>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Update Now</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
