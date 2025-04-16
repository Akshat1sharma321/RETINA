import { Place } from "./geminiApi";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export async function getNearbyPlacesFromGoogle(
  latitude: number,
  longitude: number
): Promise<Place[]> {
  try {
    // Search for hospitals
    const hospitalsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital&key=${GOOGLE_MAPS_API_KEY}`
    );
    if (!hospitalsResponse.ok) throw new Error("Failed to fetch hospitals");
    const hospitalsData = await hospitalsResponse.json();

    // Search for pharmacies
    const pharmaciesResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=pharmacy&key=${GOOGLE_MAPS_API_KEY}`
    );
    if (!pharmaciesResponse.ok) throw new Error("Failed to fetch pharmacies");
    const pharmaciesData = await pharmaciesResponse.json();

    // Search for police stations
    const policeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=police&key=${GOOGLE_MAPS_API_KEY}`
    );
    if (!policeResponse.ok) throw new Error("Failed to fetch police stations");
    const policeData = await policeResponse.json();

    // Combine and process results
    const places: Place[] = [];

    // Process hospitals (get up to 5)
    if (hospitalsData.results) {
      hospitalsData.results.slice(0, 5).forEach((place: any) => {
        if (place.geometry && place.name) {
          places.push({
            name: place.name,
            type: "hospital",
            distance: calculateDistance(
              latitude,
              longitude,
              place.geometry.location.lat,
              place.geometry.location.lng
            ),
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            vicinity: place.vicinity,
            phone: place.formatted_phone_number,
          });
        }
      });
    }

    // Process pharmacies (get up to 2)
    if (pharmaciesData.results) {
      pharmaciesData.results.slice(0, 2).forEach((place: any) => {
        if (place.geometry && place.name) {
          places.push({
            name: place.name,
            type: "pharmacy",
            distance: calculateDistance(
              latitude,
              longitude,
              place.geometry.location.lat,
              place.geometry.location.lng
            ),
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            vicinity: place.vicinity,
            phone: place.formatted_phone_number,
          });
        }
      });
    }

    // Process police stations (get up to 2)
    if (policeData.results) {
      policeData.results.slice(0, 2).forEach((place: any) => {
        if (place.geometry && place.name) {
          places.push({
            name: place.name,
            type: "police",
            distance: calculateDistance(
              latitude,
              longitude,
              place.geometry.location.lat,
              place.geometry.location.lng
            ),
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            vicinity: place.vicinity,
            phone: place.formatted_phone_number,
          });
        }
      });
    }

    // Sort by distance
    return places.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error("Error fetching places from Google:", error);
    throw error; // Propagate the error to be handled by the component
  }
}

// Calculate distance between two points in meters
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
