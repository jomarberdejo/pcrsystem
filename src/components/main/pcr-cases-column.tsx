import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PCRReportType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, PenIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { deletePCRCaseRecord } from "@/actions";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  setSelectedPCR: (pcr: PCRReportType) => void;
  setModalOpen: (value: boolean) => void;
};

export const columns = ({
  setSelectedPCR,
  setModalOpen,
}: Props): ColumnDef<PCRReportType>[] => [
  // {
  //   accessorKey: "id",
  //   header: "PCR Case ID",
  //   size: 100,
  // },
  {
    accessorKey: "operationType",
    header: "Operation Type",
    cell: ({ row }) => {
      const type = row?.original.operationType;
      return (
        <span
          className={`px-2 py-1 text-sm font-semibold rounded-md ${
            type === "TRANSPORT"
              ? "bg-blue-200 text-blue-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {type?.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 100,
  },
  {
    accessorKey: "timeCalled",
    header: "Time Called",
    size: 100,
  },
  {
    accessorKey: "timeDispatched",
    header: "Time of ERT Dispatched",
    size: 100,
  },
  {
    accessorKey: "timeAtScene",
    header: "Time at Scene",
    size: 100,
  },
  {
    accessorKey: "timeTransport",
    header: "Time of Transport",
    size: 100,
  },
  {
    accessorKey: "timeEndorsed",
    header: "Time Endorsed",
  },
  {
    accessorKey: "timeArrivedAt",
    header: "Time Arrived At Opcen",
  },
  {
    accessorKey: "typeOfIncident",
    header: "Type of Incident",
  },
  {
    accessorKey: "placeOfIncident",
    header: "Place of Incident",
  },
  {
    accessorKey: "receivingFacility",
    header: "Receiving Facility",
  },
  {
    accessorKey: "typeOfConduction",
    header: "Type of Conduction",
  },
  {
    accessorKey: "vehiclesInvolved",
    header: "Vehicles Involved",
  },
  {
    accessorKey: "chiefComplaint",
    header: "Chief Complaint",
    size: 300,
  },
  {
    accessorKey: "noOfCasualty",
    header: "Number of Casualties",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    size: 300,
  },
  {
    accessorKey: "vehicleUsed",
    header: "Vehicle Used",
  },
  {
    accessorKey: "ambulanceDriver",
    header: "Ambulance Driver",
  },
  {
    accessorKey: "ambulanceCrews",
    header: "Ambulance Crews",
  },
  {
    accessorKey: "computationCallToOpcen",
    header: "Call Received to Arrival at Opcen",
  },
  {
    accessorKey: "computationERTDispatch",
    header: "ERT Dispatch to Arrival at Opcen",
  },
  {
    accessorKey: "documentation.url",
    header: "Documentation",
    cell: ({ row }) => {
      const documentation = row.original.documentation;

      if (!documentation || documentation.length === 0) {
        return <span>No documentation available</span>;
      }

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Image
              alt="image-identity"
              width={400}
              height={400}
              src={`${documentation[0]}`}
              loading="lazy"
              className="rounded-full h-[60px] w-[60px] object-cover cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="h-auto max-h-[80vh] max-w-3xl flex flex-col items-center justify-center py-6 px-4 gap-4">
            <DialogHeader className="text-center w-full">
              <DialogTitle>{`Documentation (${documentation.length} Files) - ${row.original.date}`}</DialogTitle>
            </DialogHeader>
            <Carousel className="w-full max-w-2xl mx-auto">
              <CarouselContent>
                {documentation.map((url, i) => (
                  <CarouselItem key={i} className="flex justify-center">
                    <div className="p-2 flex justify-center">
                      <Image
                        alt={`Documentation ${i + 1}`}
                        height={700}
                        width={400}
                        src={url}
                        loading="lazy"
                        className="w-full max-h-[65vh] object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const pcrCase = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setSelectedPCR(pcrCase);
                setModalOpen(true);
              }}
            >
              <PenIcon className="w-[16px] mr-2" />
              Edit
            </Button>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full">
                  <TrashIcon className="w-[16px] mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    this pcr case and all the information related to it.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={async () => {
                      try {
                        await deletePCRCaseRecord(row.original.id);
                        toast.success("Success!", {
                          description: "A PCR Case was successfully deleted.",
                          position: "top-right",
                        });
                        setDeleteDialogOpen(false);
                      } catch (error) {
                        toast.error("Failed to delete. Please try again.");
                      }
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
