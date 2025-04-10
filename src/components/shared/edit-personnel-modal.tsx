import { PersonnelType } from "@/types";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect } from "react";

const editFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  team: z.string().min(1, "Team is required"),
});

type EditPersonnelProps = {
  open: boolean;
  onClose: () => void;
  selectedPersonnel: PersonnelType | null;
  mutate: () => void;
  personnelType: string;
};

export default function EditPersonnel({
  open,
  onClose,
  selectedPersonnel,
  mutate,
  personnelType,
}: EditPersonnelProps) {
  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: "",
      team: "",
    },
  });

  useEffect(() => {
    if (selectedPersonnel) {
      form.reset({
        name: selectedPersonnel.name,
        team: selectedPersonnel.team || "",
      });
    }
  }, [selectedPersonnel, form]);

  const onSubmit = async (data: z.infer<typeof editFormSchema>) => {
    if (!selectedPersonnel) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${personnelType}/${selectedPersonnel.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update personnel");
      }

      toast.success("Personnel updated!");
      mutate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update personnel.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Personnel</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALPHA">ALPHA</SelectItem>
                        <SelectItem value="BRAVO">BRAVO</SelectItem>
                        <SelectItem value="CHARLIE">CHARLIE</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
