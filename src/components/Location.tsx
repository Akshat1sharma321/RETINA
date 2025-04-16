import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Navigation, Phone } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import { getNearbyPlaces, Place } from "@/utils/geminiApi";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
}

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const Location = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
        };
        setLocation(locationData);
        setError(null);

        try {
          // Use Gemini API to fetch nearby places
          const places = await getNearbyPlaces(
            locationData.latitude,
            locationData.longitude
          );
          setNearbyPlaces(places);
        } catch (error) {
          console.error("Error fetching nearby places:", error);
          toast.error("Failed to fetch nearby places");
        }

        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Please allow location access to use this feature";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsTracking(true);
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
        };
        setLocation(locationData);
        setError(null);

        try {
          // Use Gemini API to fetch nearby places when location changes
          const places = await getNearbyPlaces(
            locationData.latitude,
            locationData.longitude
          );
          setNearbyPlaces(places);
        } catch (error) {
          console.error("Error fetching nearby places:", error);
        }
      },
      (error) => {
        console.error("Error tracking location:", error);
        setError(
          "Error tracking location. Please check your location settings."
        );
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    toast.success("Location tracking started");
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    toast.success("Location tracking stopped");
  };

  useEffect(() => {
    getCurrentLocation();
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const getTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "hospital":
        return "#EF4444"; // Red
      case "police":
        return "#3B82F6"; // Blue
      case "pharmacy":
        return "#10B981"; // Green
      default:
        return "#6B7280"; // Gray
    }
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${distance.toFixed(0)}m away`;
    } else {
      return `${(distance / 1000).toFixed(1)}km away`;
    }
  };

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-navi-400" />
            Emergency Locations Near You
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isTracking) {
                stopTracking();
              } else {
                startTracking();
              }
            }}
            className={`${
              isTracking ? "bg-navi-400 text-white" : "text-navi-400"
            } hover:text-navi-300`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isTracking ? (
              "Stop Tracking"
            ) : (
              "Start Tracking"
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 text-navi-400 animate-spin" />
          </div>
        ) : location ? (
          <div className="space-y-4">
            <div className="h-[400px] w-full rounded-lg overflow-hidden">
              <MapContainer
                center={[location.latitude, location.longitude]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CircleMarker
                  center={[location.latitude, location.longitude]}
                  radius={8}
                  pathOptions={{
                    fillColor: "#4F46E5",
                    fillOpacity: 1,
                    color: "white",
                    weight: 2,
                  }}
                >
                  <Popup>
                    Your current location
                    <br />
                    {location.accuracy &&
                      `Accuracy: ${location.accuracy.toFixed(0)}m`}
                  </Popup>
                </CircleMarker>
                <MapUpdater center={[location.latitude, location.longitude]} />
              </MapContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400">Location not available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Location;
