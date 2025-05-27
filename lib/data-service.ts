import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";
import { Bookings, Cabin, CreateGuest, Guest, Settings } from "@/types";
import { notFound } from "next/navigation";
import { auth } from "./auth";

/////////////
// GET

export async function getCabin<T>(id: T): Promise<Cabin> {
  try {
    const { data, error } = await supabase
      .from("cabins")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching cabin:", error);
      throw new Error("Failed to fetch cabin data");
    }

    if (!data) {
      notFound();
    }

    return data;
  } catch (error) {
    console.error("Error in getCabin:", error);
    throw new Error("Failed to fetch cabin data");
  }
}

export async function getCabinPrice(
  id: string
): Promise<{ regularPrice: number; discount: number }> {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function (): Promise<Cabin[]> {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string): Promise<Guest> {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id: number): Promise<Bookings> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(
  guestId: string | undefined
): Promise<Bookings[]> {
  try {
    if (!guestId) {
      throw new Error("Guest ID is required");
    }

    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
      )
      .eq("guestId", guestId)
      .order("startDate");

    if (error) {
      console.error("Error fetching bookings:", error);
      throw new Error("Failed to fetch bookings data");
    }

    return data || [];
  } catch (error) {
    console.error("Error in getBookings:", error);
    throw new Error("Failed to fetch bookings data");
  }
}

export async function getBookedDatesByCabinId(
  cabinId: number
): Promise<Date[]> {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString() as any;

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking: Bookings) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag",
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const countries = await res.json();
    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw new Error("Could not fetch countries");
  }
}

// CREATE

export async function createGuest(newGuest: CreateGuest) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function handleAuht(bookingId: number) {
  const session = (await auth()) as any;
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session?.user?.guestId);

  if (!guestBookings.some((booking) => booking.id === bookingId))
    throw new Error("You do not have permission to delete this booking");
}
