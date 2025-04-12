"use client";
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { formSchema } from "@/schemas";
import { Check, CloudUpload, Loader, Paperclip } from "lucide-react";

export function PCRFormClient() {
  const [operationType, setOperationType] = useState<
    "EMERGENCY" | "TRANSPORT" | ""
  >("");
  const router = useRouter();
  const { driverOptions, crewOptions, isLoading, isError } = useOptions();

  const filteredIncidentTypes = incidentTypeList.filter(({ type }) =>
    operationType ? type === operationType : undefined
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operationType: "",
      date: new Date(),
      timeCalled: new Date(),
      timeDispatched: new Date(),
      timeAtScene: new Date(),
      timeTransport: new Date(),
      timeEndorsed: new Date(),
      timeArrivedAt: new Date(),
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
    try {
      const formData = new FormData();
      formData.append("operationType", values.operationType);
      formData.append("date", values.date.toISOString());
      formData.append("timeCalled", values.timeCalled.toISOString());
      formData.append("timeDispatched", values.timeDispatched.toISOString());
      formData.append("timeAtScene", values.timeAtScene.toISOString());
      formData.append("timeTransport", values.timeTransport.toISOString());
      formData.append("timeEndorsed", values.timeEndorsed.toISOString());
      formData.append("timeArrivedAt", values.timeArrivedAt.toISOString());
      formData.append("typeOfIncident", values.typeOfIncident);
      formData.append("placeOfIncident", values.placeOfIncident);
      formData.append("receivingFacility", values.receivingFacility);
      formData.append("typeOfConduction", values.typeOfConduction);
      formData.append("chiefComplaint", values.chiefComplaint);
      formData.append("noOfCasualty", values.noOfCasualty);
      formData.append("remarks", values.remarks);
      formData.append("vehicleUsed", values.vehicleUsed);
      formData.append("ambulanceDriver", values.ambulanceDriver);

      if (values.vehiclesInvolved) {
        values.vehiclesInvolved.forEach((vehicle) =>
          formData.append("vehiclesInvolved", vehicle)
        );
      }

      values.ambulanceCrew.forEach((crew) =>
        formData.append("ambulanceCrew", crew)
      );
      values.documentation.forEach((file: File) =>
        formData.append("documentation", file)
      );

      await createPCRCaseRecord(formData);

      console.log(values);
      toast.success("Success!", {
        description: "A new PCR Case was recorded.",
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
        position: "top-right",
      });
      router.push("/admin/pcr-cases");
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
          <div className="h-full">Loading options...</div>
        ) : (
          <>
            <div className="grid grid-cols-16 gap-4">
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
            <div className="grid grid-cols-16 gap-4">
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
            <div className="grid grid-cols-16 gap-4">
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
              </div>
            </div>

            {/* Vehicles, Chief Complaint, Casualty, Remarks */}
            <div className="grid grid-cols-16 gap-4">
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
            <div className="grid grid-cols-16 gap-4">
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
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              <span>Submit</span>
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
