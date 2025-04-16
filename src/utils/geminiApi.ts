import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
}

export interface Place {
  name: string;
  type: string;
  distance: number;
  latitude: number;
  longitude: number;
  vicinity?: string;
  phone?: string;
}

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
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a list of 10 nearby emergency places for the location at latitude ${latitude} and longitude ${longitude} in JSON format. Include a mix of hospitals, police stations, and pharmacies. Each place should have:
    - name (realistic name for the type of place)
    - type (hospital, police, or pharmacy)
    - distance (in meters, between 100 and 5000)
    - latitude (realistic nearby coordinate)
    - longitude (realistic nearby coordinate)
    - vicinity (realistic street address)

    Make the locations appear realistically distributed around the given coordinates (within 5km).
    Return ONLY the JSON array of places, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Parse the JSON response
      const places: Place[] = JSON.parse(text);

      // Sort places by distance
      return places.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      throw new Error("Failed to parse nearby places data");
    }
  } catch (error) {
    console.error("Error fetching nearby places from Gemini:", error);
    throw new Error("Failed to get nearby places");
  }
}
