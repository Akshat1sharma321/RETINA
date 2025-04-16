import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Hospital,
  Shield,
  Stethoscope,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getNearbyPlaces, Place } from "@/utils/geminiApi";

const NearbyEmergencyLocations = () => {
  const [locations, setLocations] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const getNearbyLocations = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch real data using the Gemini API
      const places = await getNearbyPlaces(latitude, longitude);
      setLocations(places);
    } catch (err) {
      console.error("Error fetching nearby locations:", err);
      setError("Failed to fetch nearby locations");
      toast.error("Error loading emergency locations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      toast.error("Location services not available");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        getNearbyLocations(latitude, longitude);
        toast.success("Location found successfully");
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const getIcon = (type: Place["type"]) => {
    switch (type) {
      case "hospital":
        return <Hospital className="h-5 w-5 text-red-400" />;
      case "police":
        return <Shield className="h-5 w-5 text-blue-400" />;
      case "pharmacy":
        return <Stethoscope className="h-5 w-5 text-green-400" />;
    }
  };

  const getTypeLabel = (type: Place["type"]) => {
    switch (type) {
      case "hospital":
        return "Hospital";
      case "police":
        return "Police Station";
      case "pharmacy":
        return "Pharmacy";
    }
  };

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-navi-400" />
          Nearby Emergency Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUserLocation}
              className="text-navi-400 hover:text-navi-300"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-navi-400 animate-spin mb-2" />
            <p className="text-gray-400">Finding your location...</p>
          </div>
        ) : locations.length > 0 ? (
          <div className="space-y-4">
            {locations.map((location) => (
              <div
                key={location.name}
                className="p-4 bg-gray-800/50 rounded-lg border border-white/10 hover:border-navi-500/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center">
                    {getIcon(location.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{location.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-navi-400 bg-navi-400/10 px-2 py-0.5 rounded">
                            {getTypeLabel(location.type)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {location.distance.toFixed(1)} km away
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      {location.vicinity}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-blue-400 hover:text-blue-300 bg-blue-400/10"
                        onClick={() =>
                          (window.location.href = `tel:${location.phone}`)
                        }
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-navi-400 hover:text-navi-300 bg-navi-400/10"
                        onClick={() => {
                          if (userLocation) {
                            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${location.latitude},${location.longitude}`;
                            window.open(url, "_blank");
                          } else {
                            toast.error("Location not available");
                          }
                        }}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400">No emergency locations found nearby</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyEmergencyLocations;
