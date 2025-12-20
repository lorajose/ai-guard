"use client";

import { useState } from "react";
import {
  ViajaRDSteps,
  ViajaRDFlightState,
  ViajaRDPassportEntry,
} from "@/components/ViajaRDSteps";
import { ViajaRDETicketForm } from "@/components/ViajaRDETicket";
import { ViajaRDFlightLinks } from "@/components/ViajaRDFlightLinks";
import { ViajaRDAssistant } from "@/components/ViajaRDAssistant";

export default function ViajaRDScreen() {
  const [flight, setFlight] = useState<ViajaRDFlightState>({
    flightNumber: "",
    flightDate: "",
    needsFlight: false,
  });
  const [passports, setPassports] = useState<ViajaRDPassportEntry[]>([
    {
      id: 1,
      name: "",
      mode: "manual",
      number: "",
      expiry: "",
      imageName: "",
    },
  ]);
  const [ticketPrefill, setTicketPrefill] = useState<Record<string, string>>({});

  return (
    <div className="space-y-12">
      <ViajaRDAssistant
        flight={flight}
        onFlightChange={setFlight}
        passports={passports}
        onPassportsChange={setPassports}
        onTicketPrefill={(prefill) =>
          setTicketPrefill((prev) => ({ ...prev, ...prefill }))
        }
      />
      <ViajaRDSteps
        flight={flight}
        onFlightChange={setFlight}
        passports={passports}
        onPassportsChange={setPassports}
      />
      <ViajaRDETicketForm prefill={ticketPrefill} />
      <ViajaRDFlightLinks />
    </div>
  );
}
