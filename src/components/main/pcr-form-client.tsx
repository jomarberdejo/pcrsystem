"use client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  vehicleUsedList,
  incidentTypeList,
  placeOfIncidentAndReceivingFacilities,
  typeOfConduction,
  vehiclesInvolvedList,
} from "@/constants";
import { createPCRCaseRecord } from "@/actions";
import { useOptions } from "@/hooks/use-options";
import { DatePicker } from "@/components/date-picker";
import { TimePickerDemo } from "@/components/timepicker";
// import { useRouter } from "next/navigation";
import { formSchema } from "@/schemas";
import { Check, CloudUpload, Loader, Paperclip } from "lucide-react";
import { FormsSkeleton } from "@/components/skeletons/forms-skeleton";
import { Input } from "@/components/ui/input";

export function PCRFormClient() {
  const [operationType, setOperationType] = useState<
    "EMERGENCY" | "TRANSPORT" | ""
  >("");
  // const router = useRouter();
  const [customIncident, setCustomIncident] = useState<string>("");
  const [customVehicleUsed, setCustomVehicleUsed] = useState<string>("");
  const [customPlaceOfIncident, setCustomPlaceOfIncident] =
    useState<string>("");
  const [customReceivingFacility, setCustomReceivingFacility] =
    useState<string>("");
  const [customTypeOfConduction, setCustomTypeOfConduction] =
    useState<string>("");
  const { driverOptions, crewOptions, isLoading, isError } = useOptions();

  const filteredIncidentTypes = useMemo(() => {
    return operationType
      ? incidentTypeList.filter(({ type }) => type === operationType)
      : [];
  }, [operationType]);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.typeOfIncident);
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
      if (values.documentation) {
        values.documentation.forEach((file: File) =>
          formData.append("documentation", file)
        );
      }
      await createPCRCaseRecord(formData);
      console.log(values);
      toast.success("Success!", {
        description: "A new PCR Case was recorded.",
        position: "top-right",
      });
      // router.push("/admin/pcr-cases");
      form.reset();
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full mx-auto flex flex-col justify-center px-2 py-4 overflow-hidden"
      >
        <h1 className="font-bold text-center text-3xl mb-10">
          Patient Care Report Form
        </h1>

        {isLoading ? (
          <FormsSkeleton />
        ) : (
          <>
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
                    placeholder="Specify Other"
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
                    placeholder="Specify Other"
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
                    placeholder="Specify Other"
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
                    placeholder="Specify Other"
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
                          defaultValue={field.value}
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
                    placeholder="Specify Other"
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
                          defaultValue={field.value}
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Save</span>
                </>
              )}
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
