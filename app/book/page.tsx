import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/booking-url";

export const metadata = { title: "Book" };

export default function BookPage() {
  redirect(BOOKING_URL);
}
