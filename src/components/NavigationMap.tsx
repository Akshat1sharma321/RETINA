import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation2, LocateFixed, Route } from "lucide-react";
import { toast } from "sonner";

interface Position {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const NavigationMap = () => {
  const [destination, setDestination] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [previousPosition, setPreviousPosition] = useState<Position | null>(
    null
  );
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const steps = [
    "Turn right on Market Street",
    "Walk 200 meters",
    "Cross at the pedestrian crossing",
    "Turn left on Main Avenue",
    "Destination will be on your right",
  ];

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

  useEffect(() => {
    if (isNavigating) {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

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
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [isNavigating, previousPosition]);

  const startNavigation = () => {
    if (!destination) {
      toast.error("Please enter a destination");
      return;
    }
    setIsNavigating(true);
    setDistance(0);
    setSpeed(0);
    toast.success("Navigation started");
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setCurrentStep(1);
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }
    toast.info("Navigation stopped");
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-1">
          GPS Navigation
        </h2>
        <p className="text-gray-400">
          Get turn-by-turn voice guidance to your destination
        </p>
      </div>

      <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter destination..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
            <Button
              onClick={isNavigating ? stopNavigation : startNavigation}
              className={
                isNavigating
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-navi-600 hover:bg-navi-700"
              }
            >
              {isNavigating ? (
                <>
                  <Route className="mr-2 h-4 w-4" />
                  Stop Navigation
                </>
              ) : (
                <>
                  <Navigation2 className="mr-2 h-4 w-4" />
                  Start Navigation
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border border-red-500/20 bg-red-500/10 backdrop-blur-sm">
          <CardContent className="p-4 text-red-400">{error}</CardContent>
        </Card>
      )}

      {isNavigating && (
        <>
          <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LocateFixed className="h-5 w-5 text-navi-400" />
                Current Direction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-navi-500/10 rounded-lg border border-navi-500/20">
                  <p className="text-xl font-medium text-navi-400">
                    Step {currentStep}: {steps[currentStep - 1]}
                  </p>
                </div>
                <Button
                  onClick={nextStep}
                  className="w-full bg-navi-600 hover:bg-navi-700"
                >
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-400">Distance Traveled</p>
                <p className="text-2xl font-bold text-white">
                  {(distance / 1000).toFixed(2)} km
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-400">Current Speed</p>
                <p className="text-2xl font-bold text-white">
                  {speed.toFixed(1)} km/h
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-400">Current Position</p>
                <p className="text-sm font-mono text-gray-300">
                  {currentPosition
                    ? `${currentPosition.latitude.toFixed(
                        6
                      )}, ${currentPosition.longitude.toFixed(6)}`
                    : "Getting location..."}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default NavigationMap;
