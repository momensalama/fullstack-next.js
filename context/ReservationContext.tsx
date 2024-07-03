"use client";

import { createContext, useContext, useState } from "react";
const initialState = { from: undefined, to: undefined };

interface range {
  from: Date | undefined;
  to: Date | undefined;
}

interface ContextProps {
  range: range;
  setRange: (range: range) => void;
  resetRange: () => void;
}

const ReservationContext = createContext({
  range: initialState,
  setRange: (range: any) => {},
  resetRange: () => {},
});

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("Context was used outside provider");
  return context;
}

export { ReservationProvider, useReservation };
