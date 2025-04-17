import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// Custom icons
const currentLocationIcon = new L.Icon({
  iconUrl: "/current-location.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const dtuIcon = new L.Icon({
  iconUrl: "/university-marker.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// DTU Location
const DTU_LOCATION = {
  latitude: 28.7499,
  longitude: 77.1183,
  name: "Delhi Technological University",
  address:
    "P4X9+X2J, Bawana Rd, Delhi Technological University, Shahbad Daulatpur Village, Rohini, New Delhi, Delhi, 110042",
};

interface CurrentLocationMapProps {
  currentLocation: { latitude: number; longitude: number } | null;
  className?: string;
}

const CurrentLocationMap = ({
  currentLocation,
  className = "",
}: CurrentLocationMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerId = "current-location-map";

  useEffect(() => {
    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerId).setView(
        [DTU_LOCATION.latitude, DTU_LOCATION.longitude],
        15 // Closer zoom for current location
      );

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add DTU marker
      L.marker([DTU_LOCATION.latitude, DTU_LOCATION.longitude], {
        icon: dtuIcon,
      })
        .addTo(mapRef.current)
        .bindPopup(`<b>${DTU_LOCATION.name}</b><br>${DTU_LOCATION.address}`)
        .openPopup();
    }

    const map = mapRef.current;

    // Clear existing current location marker
    map.eachLayer((layer) => {
      if (
        layer instanceof L.Marker &&
        layer.getIcon() === currentLocationIcon
      ) {
        map.removeLayer(layer);
      }
    });

    if (currentLocation) {
      // Add current location marker with custom icon and accuracy circle
      L.marker([currentLocation.latitude, currentLocation.longitude], {
        icon: currentLocationIcon,
      })
        .addTo(map)
        .bindPopup("Your Current Location");

      // Add a circle to show approximate area
      L.circle([currentLocation.latitude, currentLocation.longitude], {
        radius: 500, // 500 meters radius
        color: "#4338ca",
        fillColor: "#4338ca",
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(map);

      // Fit bounds to show both locations
      const bounds = L.latLngBounds([
        [currentLocation.latitude, currentLocation.longitude],
        [DTU_LOCATION.latitude, DTU_LOCATION.longitude],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup map on component unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [currentLocation]);

  return (
    <div
      id={mapContainerId}
      className={`w-full h-[400px] rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm ${className}`}
    />
  );
};

export default CurrentLocationMap;
