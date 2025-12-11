import { ViajaRDSteps } from "@/components/ViajaRDSteps";
import { ViajaRDETicketForm } from "@/components/ViajaRDETicket";
import { ViajaRDFlightLinks } from "@/components/ViajaRDFlightLinks";

export default function ViajaRDScreen() {
  return (
    <div className="space-y-12">
      <ViajaRDSteps />
      <ViajaRDETicketForm />
      <ViajaRDFlightLinks />
    </div>
  );
}
