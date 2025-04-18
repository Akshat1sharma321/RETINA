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
  type:
    | "hospital"
    | "police"
    | "pharmacy"
    | "restaurant"
    | "hotel"
    | "train_station"
    | "bus_station";
  distance: number;
  latitude: number;
  longitude: number;
  vicinity?: string;
  phone?: string;
}

// Predefined list of places
const places: Record<string, Place[]> = {
  hospital: [
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
  ],
  restaurant: [
    {
      name: "DTU Cafeteria",
      type: "restaurant",
      distance: 0.1,
      latitude: 28.7495,
      longitude: 77.1175,
      vicinity: "Delhi Technological University, Main Building",
      phone: "+91 11 27871000",
    },
    {
      name: "Food Court",
      type: "restaurant",
      distance: 1.2,
      latitude: 28.751,
      longitude: 77.119,
      vicinity: "Sector 16, Rohini",
      phone: "+91 11 27890123",
    },
    {
      name: "Spice Garden Restaurant",
      type: "restaurant",
      distance: 1.8,
      latitude: 28.753,
      longitude: 77.121,
      vicinity: "Sector 17, Rohini",
      phone: "+91 11 27893456",
    },
    {
      name: "The Coffee House",
      type: "restaurant",
      distance: 0.5,
      latitude: 28.748,
      longitude: 77.117,
      vicinity: "Near DTU Gate",
      phone: "+91 11 27871234",
    },
  ],
  hotel: [
    {
      name: "Hotel Grand",
      type: "hotel",
      distance: 2.5,
      latitude: 28.763,
      longitude: 77.125,
      vicinity: "Sector 15, Rohini",
      phone: "+91 11 27654321",
    },
    {
      name: "Stay Inn",
      type: "hotel",
      distance: 3.1,
      latitude: 28.758,
      longitude: 77.115,
      vicinity: "Sector 17, Rohini",
      phone: "+91 11 27123456",
    },
    {
      name: "Comfort Lodge",
      type: "hotel",
      distance: 2.8,
      latitude: 28.761,
      longitude: 77.122,
      vicinity: "Sector 16, Rohini",
      phone: "+91 11 27654789",
    },
    {
      name: "Royal Residency",
      type: "hotel",
      distance: 3.5,
      latitude: 28.757,
      longitude: 77.118,
      vicinity: "Sector 18, Rohini",
      phone: "+91 11 27129876",
    },
  ],
  train_station: [
    {
      name: "Samaypur Badli Metro Station",
      type: "train_station",
      distance: 4.2,
      latitude: 28.735,
      longitude: 77.118,
      vicinity: "Yellow Line, Delhi Metro",
      phone: "+91 11 23417910",
    },
    {
      name: "Rohini Sector 18 Metro Station",
      type: "train_station",
      distance: 3.8,
      latitude: 28.742,
      longitude: 77.112,
      vicinity: "Yellow Line, Delhi Metro",
      phone: "+91 11 23417911",
    },
    {
      name: "Rithala Metro Station",
      type: "train_station",
      distance: 5.1,
      latitude: 28.729,
      longitude: 77.108,
      vicinity: "Red Line, Delhi Metro",
      phone: "+91 11 23417912",
    },
    {
      name: "Rohini West Metro Station",
      type: "train_station",
      distance: 4.5,
      latitude: 28.738,
      longitude: 77.115,
      vicinity: "Red Line, Delhi Metro",
      phone: "+91 11 23417913",
    },
  ],
  bus_station: [
    {
      name: "DTU Bus Stop",
      type: "bus_station",
      distance: 0.3,
      latitude: 28.748,
      longitude: 77.117,
      vicinity: "Delhi Technological University",
      phone: null,
    },
    {
      name: "Shahbad Dairy Bus Terminal",
      type: "bus_station",
      distance: 2.1,
      latitude: 28.755,
      longitude: 77.108,
      vicinity: "Shahbad Dairy",
      phone: "+91 11 23819012",
    },
    {
      name: "Rohini Sector 16 Bus Stand",
      type: "bus_station",
      distance: 2.5,
      latitude: 28.752,
      longitude: 77.114,
      vicinity: "Sector 16, Rohini",
      phone: "+91 11 23819013",
    },
    {
      name: "Badli Bus Depot",
      type: "bus_station",
      distance: 3.2,
      latitude: 28.743,
      longitude: 77.109,
      vicinity: "Badli Industrial Area",
      phone: "+91 11 23819014",
    },
  ],
};

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
  longitude: number,
  type: string = "hospital"
): Promise<Place[]> {
  // Return the predefined list based on type
  return Promise.resolve(places[type] || []);
}
