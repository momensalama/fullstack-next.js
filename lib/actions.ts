"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings, handleAuht } from "./data-service";
import { redirect } from "next/navigation";

interface FormDataProps {
  get: (key: string) => any;
}

export async function updateGuestProfile(formData: FormDataProps) {
  // 1) Authentication
  const session = (await auth()) as any;
  if (!session) throw new Error("You must be logged in");

  // 2) Validation
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  // 3) Mutation
  const updateData = { nationality, countryFlag, nationalID };

  // 4) Error handling
  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session?.user?.guestId);

  if (error) throw new Error("Guest could not be updated");

  // 5) Revalidation
  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId: number) {
  // 1) Authentication & Authorization
  await handleAuht(bookingId);

  // 2) Mutation
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  // 3) Error handling
  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  // 4) Revalidation
  revalidatePath("/account/reservations");
}

export async function updateReservation(formData: FormDataProps) {
  const bookingId = Number(formData.get("bookingId"));

  // 1) Authentication & Authorization
  await handleAuht(bookingId);

  // 2) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 3) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 4) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 5) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  // 6) Redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
