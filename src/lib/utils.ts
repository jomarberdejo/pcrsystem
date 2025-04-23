import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import momentPH from "@/lib/moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getManilaStartOfDay(): Date {
  return momentPH().startOf("day").toDate();
}

export function formatDateDisplay(date: string | Date): string {
  return momentPH(date).format("YYYY MMMM DD (dddd)");
}

export function formatTimeInManila(date?: string | Date): string {
  return momentPH(date).format("hh:mm A");
}

export const parseTimeStringToDate = (timeString: string) => {
  if (!timeString) return undefined;

  const today = momentPH().format("YYYY-MM-DD");
  const fullDateTimeString = `${today} ${timeString}`;
  const parsed = momentPH(fullDateTimeString, "YYYY-MM-DD hh:mm A");
  return parsed.isValid() ? parsed.toDate() : undefined;
};
