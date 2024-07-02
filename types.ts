export interface Bookings {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabinId: number;
  cabinPrice: number;
  extrasPrice: number;
  status: string;
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
}

export interface Cabin {
  created_at: string;
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
}

export interface Guest {
  created_at: string;
  id: number;
  email: string;
  fullName: string;
  natinolity: string;
  nationalID: string;
  countryFlag: string;
}

export interface Settings {
  created_at: string;
  id: number;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsBookingPerBooking: number;
  breakfastPrice: number;
}
