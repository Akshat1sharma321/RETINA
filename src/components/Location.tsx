import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Loader2,
  Navigation,
  Phone,
  UtensilsCrossed,
  Hotel,
  Train,
  Bus,
} from "lucide-react";
import { toast } from "sonner";
import { getNearbyPlaces, Place } from "@/utils/geminiApi";
import CurrentLocationMap from "./CurrentLocationMap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
}

// Place types configuration
const placeTypes = [
  { value: "restaurant", label: "Food Places", icon: UtensilsCrossed },
  { value: "hotel", label: "Stay", icon: Hotel },
  { value: "train_station", label: "Train Stations", icon: Train },
  { value: "bus_station", label: "Bus Stations", icon: Bus },
];

// DTU Location
const DTU_LOCATION = {
  latitude: 28.7499,
  longitude: 77.1183,
  name: "Delhi Technological University",
  address:
    "P4X9+X2J, Bawana Rd, Delhi Technological University, Shahbad Daulatpur Village, Rohini, New Delhi, Delhi, 110042",
};

// Calculate distance between two points in kilometers
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

const Location = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState<string>("restaurant");
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
            locationData.longitude,
            selectedType
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
            locationData.longitude,
            selectedType
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
  }, [selectedType]);

  const getTypeIcon = (type: string) => {
    const placeType = placeTypes.find((t) => t.value === type);
    if (placeType) {
      const Icon = placeType.icon;
      return <Icon className="h-5 w-5" />;
    }
    return <MapPin className="h-5 w-5" />;
  };

  const getTypeLabel = (type: string): string => {
    const placeType = placeTypes.find((t) => t.value === type);
    return placeType?.label || type;
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
            Navigation
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
            {/* Map Component */}
            <CurrentLocationMap currentLocation={location} />

            {/* Location Details */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Latitude</div>
                  <div className="font-medium">
                    {location.latitude.toFixed(6)}°
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Longitude</div>
                  <div className="font-medium">
                    {location.longitude.toFixed(6)}°
                  </div>
                </div>
                {location.accuracy && (
                  <div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                    <div className="font-medium">
                      {location.accuracy.toFixed(0)} meters
                    </div>
                  </div>
                )}
                {location.speed && location.speed > 0 && (
                  <div>
                    <div className="text-sm text-gray-400">Speed</div>
                    <div className="font-medium">
                      {(location.speed * 3.6).toFixed(1)} km/h
                    </div>
                  </div>
                )}
                <div className="col-span-2">
                  <div className="text-sm text-gray-400">Distance to DTU</div>
                  <div className="font-medium">
                    {calculateDistance(
                      location.latitude,
                      location.longitude,
                      DTU_LOCATION.latitude,
                      DTU_LOCATION.longitude
                    ).toFixed(2)}{" "}
                    km
                  </div>
                </div>
              </div>
            </div>

            {/* Place Type Selection */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-white/10">
              <label className="text-sm text-gray-400 mb-2 block">
                Search for nearby places
              </label>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select place type" />
                </SelectTrigger>
                <SelectContent>
                  {placeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(type.value)}
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nearby Places */}
            {nearbyPlaces.length > 0 && (
              <div className="space-y-4">
                {nearbyPlaces.map((place) => (
                  <div
                    key={place.name}
                    className="p-4 bg-gray-800/50 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center">
                        {getTypeIcon(place.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-lg">
                              {place.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-navi-400 bg-navi-400/10 px-2 py-0.5 rounded">
                                {getTypeLabel(place.type)}
                              </span>
                              <span className="text-sm text-gray-400">
                                {place.distance.toFixed(1)} km away
                              </span>
                            </div>
                          </div>
                        </div>
                        {place.vicinity && (
                          <p className="text-sm text-gray-400 mt-2">
                            {place.vicinity}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          {place.phone && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-3 text-blue-400 hover:text-blue-300 bg-blue-400/10"
                              onClick={() =>
                                (window.location.href = `tel:${place.phone}`)
                              }
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-navi-400 hover:text-navi-300 bg-navi-400/10"
                            onClick={() => {
                              const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${place.latitude},${place.longitude}`;
                              window.open(url, "_blank");
                            }}
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400">Location data not available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Location;
