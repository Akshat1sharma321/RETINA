import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Place } from "@/utils/geminiApi";

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// Custom icons for different types of places
const icons = {
  hospital: new L.Icon({
    iconUrl: "/hospital-marker.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  police: new L.Icon({
    iconUrl: "/police-marker.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  pharmacy: new L.Icon({
    iconUrl: "/pharmacy-marker.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  current: new L.Icon({
    iconUrl: "/current-location.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  }),
};

interface LocationMapProps {
  currentLocation: { latitude: number; longitude: number } | null;
  places: Place[];
}

const LocationMap = ({ currentLocation, places }: LocationMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerId = "location-map";

  useEffect(() => {
    if (!currentLocation) return;

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerId).setView(
        [currentLocation.latitude, currentLocation.longitude],
        14
      );

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add current location marker
    L.marker([currentLocation.latitude, currentLocation.longitude], {
      icon: icons.current,
    })
      .addTo(map)
      .bindPopup("Your Location")
      .openPopup();

    // Add markers for emergency places
    places.forEach((place) => {
      const icon = icons[place.type] || L.Icon.Default;
      L.marker([place.latitude, place.longitude], { icon })
        .addTo(map)
        .bindPopup(
          `<b>${place.name}</b><br>
           ${place.vicinity}<br>
           Distance: ${place.distance.toFixed(1)} km<br>
           <a href="tel:${place.phone}">${place.phone}</a>`
        );
    });

    // Update map view to fit all markers
    const bounds = L.latLngBounds(
      [[currentLocation.latitude, currentLocation.longitude]],
      [[currentLocation.latitude, currentLocation.longitude]]
    );
    places.forEach((place) => {
      bounds.extend([place.latitude, place.longitude]);
    });
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      // Cleanup map on component unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [currentLocation, places]);

  return (
    <div
      id={mapContainerId}
      className="w-full h-[400px] rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm"
    />
  );
};

export default LocationMap;
