import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Locate } from "lucide-react";
import { toast } from "sonner";

interface Position {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [previousPosition, setPreviousPosition] = useState<Position | null>(
    null
  );
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const watchId = useRef<number | null>(null);

  // Calculate distance between two points in meters
  const calculateDistance = (pos1: Position, pos2: Position) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (pos1.latitude * Math.PI) / 180;
    const φ2 = (pos2.latitude * Math.PI) / 180;
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Calculate speed in km/h
  const calculateSpeed = (distance: number, timeDiff: number) => {
    return (distance / timeDiff) * 3.6; // Convert m/s to km/h
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsUpdating(true);
    setDistance(0);
    setSpeed(0);

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        };

        setCurrentPosition(newPosition);

        if (previousPosition) {
          const dist = calculateDistance(previousPosition, newPosition);
          const timeDiff =
            (newPosition.timestamp - previousPosition.timestamp) / 1000; // Convert to seconds
          const currentSpeed = calculateSpeed(dist, timeDiff);

          setDistance((prev) => prev + dist);
          setSpeed(currentSpeed);
        }

        setPreviousPosition(newPosition);
      },
      (error) => {
        setError(error.message);
        toast.error("Error getting location: " + error.message);
        setIsUpdating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const stopLocationTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsUpdating(false);
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">
            Device Location
          </h2>
          <p className="text-gray-400">
            {currentPosition
              ? `Last updated: ${new Date(
                  currentPosition.timestamp
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Location not available"}
          </p>
        </div>
        <Button
          onClick={isUpdating ? stopLocationTracking : startLocationTracking}
          disabled={isUpdating}
          className="bg-navi-600 hover:bg-navi-700"
        >
          <Locate className="mr-2 h-4 w-4" />
          {isUpdating ? "Stop Tracking" : "Start Tracking"}
        </Button>
      </div>

      {error && (
        <Card className="border border-red-500/20 bg-red-500/10 backdrop-blur-sm">
          <CardContent className="p-4 text-red-400">{error}</CardContent>
        </Card>
      )}

      <Card className="border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="aspect-video w-full bg-gradient-to-b from-gray-800 to-gray-900 relative">
          {/* Mock map visualization */}
          <div className="absolute inset-0 opacity-30 bg-gradient-hex"></div>
          <div className="grid grid-cols-6 grid-rows-6 h-full w-full opacity-20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-gray-700"></div>
            ))}
          </div>

          {/* Position marker */}
          {currentPosition && (
            <div
              className="absolute h-6 w-6 bg-navi-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"
              style={{
                left: `${((currentPosition.longitude + 180) / 360) * 100}%`,
                top: `${((90 - currentPosition.latitude) / 180) * 100}%`,
              }}
            >
              <div className="h-full w-full animate-pulse-slow bg-navi-400 rounded-full opacity-70"></div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Latitude</p>
              <p className="font-mono text-lg">
                {currentPosition ? currentPosition.latitude.toFixed(6) : "---"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Longitude</p>
              <p className="font-mono text-lg">
                {currentPosition ? currentPosition.longitude.toFixed(6) : "---"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Current Speed</p>
              <p className="font-mono text-lg">{speed.toFixed(1)} km/h</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Location Statistics</CardTitle>
          <CardDescription>Real-time tracking information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Distance Traveled</p>
              <p className="text-lg font-medium">
                {(distance / 1000).toFixed(2)} km
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Tracking Status</p>
              <p className="text-lg font-medium text-navi-400">
                {isUpdating ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Map;
