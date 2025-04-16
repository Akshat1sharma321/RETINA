import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Navigation, X } from "lucide-react";
import { toast } from "sonner";
import {
  loadGoogleMaps,
  getCurrentLocation,
  getDirections,
} from "@/utils/googleMaps";

interface NavigationDirectionsProps {
  destination: {
    lat: number;
    lng: number;
    name: string;
  };
  onClose: () => void;
}

const NavigationDirections = ({
  destination,
  onClose,
}: NavigationDirectionsProps) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );

  const initializeMap = async () => {
    if (!mapRef.current || !userLocation) return;

    await loadGoogleMaps();

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: userLocation.latitude, lng: userLocation.longitude },
      zoom: 15,
      styles: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: "#ffffff" }],
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "all",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: "#000000" }, { lightness: 20 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#000000" }, { lightness: 17 }, { weight: 1.2 }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 20 }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 21 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: "#000000" }, { lightness: 17 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#000000" }, { lightness: 29 }, { weight: 0.2 }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 18 }],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 16 }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 19 }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#000000" }, { lightness: 17 }],
        },
      ],
    });

    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#4F46E5",
        strokeWeight: 5,
      },
    });

    directionsRendererRef.current = directionsRenderer;
  };

  const updateDirections = async () => {
    if (!userLocation || !directionsRendererRef.current) return;

    try {
      const result = await getDirections(
        { lat: userLocation.latitude, lng: userLocation.longitude },
        { lat: destination.lat, lng: destination.lng }
      );

      setDirections(result);
      directionsRendererRef.current.setDirections(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get directions");
      toast.error("Error getting directions");
    }
  };

  const fetchLocationAndDirections = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      await initializeMap();
      await updateDirections();
      toast.success("Directions updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch location");
      toast.error("Error updating location");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationAndDirections();
  }, []);

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-navi-400" />
            Directions to {destination.name}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLocationAndDirections}
              disabled={isLoading}
              className="text-navi-400 hover:text-navi-300"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-red-400 hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        <div className="h-[400px] w-full rounded-lg overflow-hidden mb-4">
          <div ref={mapRef} className="h-full w-full" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 text-navi-400 animate-spin" />
          </div>
        ) : directions ? (
          <div className="space-y-4">
            <h3 className="font-medium">Turn-by-Turn Directions</h3>
            <div className="space-y-2">
              {directions.routes[0].legs[0].steps.map((step, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-800/50 rounded-lg border border-white/10"
                >
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: step.instructions }}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {step.distance?.text} • {step.duration?.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400">No directions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NavigationDirections;
