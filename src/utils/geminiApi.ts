import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyD2Oym-8ONbSfCczKFGv5yJvP18axKB6D0";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
}

export interface Place {
  name: string;
  type: "hospital" | "police" | "pharmacy";
  distance: number;
  latitude: number;
  longitude: number;
  vicinity?: string;
  phone?: string;
}

// Predefined list of emergency centers
const emergencyCenters: Place[] = [
  {
    name: "DTU Health Centre",
    type: "hospital",
    distance: 0.2,
    latitude: 28.749,
    longitude: 77.116,
    vicinity: "Delhi Technological University, Shahbad Daulatpur",
    phone: "+91 11 27871018",
  },
  {
    name: "Ishan Hospital",
    type: "hospital",
    distance: 2.9,
    latitude: 28.765,
    longitude: 77.105,
    vicinity: "Sector-18, Rohini",
    phone: "+91 11 4567 8901",
  },
  {
    name: "Saroj Medical Institute",
    type: "hospital",
    distance: 2.8,
    latitude: 28.76,
    longitude: 77.1,
    vicinity: "Sector 14 Extension, Rohini",
    phone: "+91 11 49444444",
  },
  {
    name: "Rohini Sector 18 Police Station",
    type: "police",
    distance: 1.5,
    latitude: 28.755,
    longitude: 77.125,
    vicinity: "Sector 18, Rohini",
    phone: "+91 11 27045035",
  },
  {
    name: "Jahangirpuri Police Station",
    type: "police",
    distance: 3.5,
    latitude: 28.76,
    longitude: 77.135,
    vicinity: "Jahangirpuri",
    phone: "+91 11 27215641",
  },
  {
    name: "Apollo Pharmacy",
    type: "pharmacy",
    distance: 1.1,
    latitude: 28.745,
    longitude: 77.12,
    vicinity: "Near Sector 17 Market, Rohini",
    phone: "+91 11 27901234",
  },
  {
    name: "MediCare Pharmacy",
    type: "pharmacy",
    distance: 2.3,
    latitude: 28.758,
    longitude: 77.108,
    vicinity: "Sector 15, Rohini",
    phone: "+91 11 28890123",
  },
  {
    name: "Shivam Hospital",
    type: "hospital",
    distance: 2.1,
    latitude: 28.762,
    longitude: 77.118,
    vicinity: "Sector 16, Rohini",
    phone: "+91 11 26543210",
  },
  {
    name: "Sector 11 Rohini Police Chowki",
    type: "police",
    distance: 3.3,
    latitude: 28.74,
    longitude: 77.1,
    vicinity: "Sector 11, Rohini",
    phone: "+91 11 27056789",
  },
  {
    name: "HealthFirst Pharmacy",
    type: "pharmacy",
    distance: 0.7,
    latitude: 28.75,
    longitude: 77.11,
    vicinity: "Local Shopping Centre, Near DTU",
    phone: "+91 11 23450987",
  },
];

export async function getDeviceLocation(): Promise<LocationData> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a simulated GPS location data for a device in JSON format with the following properties:
    - latitude (between -90 and 90)
    - longitude (between -180 and 180)
    - timestamp (current Unix timestamp)
    - accuracy (in meters, between 1 and 20)
    - speed (in meters per second, between 0 and 5)
    
    Return ONLY the JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const locationData = JSON.parse(text);

    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timestamp: locationData.timestamp,
      accuracy: locationData.accuracy,
      speed: locationData.speed,
    };
  } catch (error) {
    console.error("Error fetching location from Gemini:", error);
    throw new Error("Failed to get location data from Gemini API");
  }
}

export async function getNearbyPlaces(
  latitude: number,
  longitude: number
): Promise<Place[]> {
  // Return the predefined list of emergency centers
  return Promise.resolve(emergencyCenters);
}
