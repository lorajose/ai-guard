import { ViajaRDSteps } from "@/components/ViajaRDSteps";
import { ViajaRDETicketForm } from "@/components/ViajaRDETicket";

export default function ViajaRDScreen() {
  return (
    <div className="space-y-12">
      <ViajaRDSteps />
      <ViajaRDETicketForm />
    </div>
  );
}
