import EmergencyContacts from "@/components/EmergencyContacts";
import NearbyEmergencyLocations from "@/components/NearbyEmergencyLocations";

export default function EmergencyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmergencyContacts />
        <NearbyEmergencyLocations />
      </div>
    </div>
  );
}
