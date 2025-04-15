import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { StaffFormPropType } from "@/types";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  team: z.string().min(1, "Team is required"),
});

type StaffFormValues = z.infer<typeof staffSchema>;

const StaffForm = ({ children, type, onRegister }: StaffFormPropType) => {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      team: "",
    },
  });

  const onSubmit = (data: StaffFormValues) => {
    onRegister(type, data.name, data.team);
  };

  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Button variant="default">{children}</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>
            {type === "CREW"
              ? "Crew Personnel Registration"
              : "Driver Personnel Registration"}
          </SheetTitle>
          <SheetDescription>
            {type === "CREW"
              ? "Fill in the details to register a new crew."
              : "Fill in the details to register a new driver."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 px-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <FormControl>
                    <Input id="name" {...field} className="col-span-3" />
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
                  <Label htmlFor="team" className="text-right">
                    Team
                  </Label>
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

            <SheetFooter className="p-0">
              <SheetClose asChild>
                <Button type="submit" className="cursor-pointer">
                  <Check /> <span>Submit Registration</span>
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default StaffForm;
