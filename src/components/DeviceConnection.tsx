import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Bluetooth, Camera, MapPin } from "lucide-react";
import { toast } from "sonner";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DeviceData {
  gps: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  };
  camera: {
    imageData: string;
    timestamp: number;
  };
}

interface DeviceConnectionProps {
  onData?: (data: DeviceData) => void;
  onConnectionChange?: (connected: boolean) => void;
}

const DeviceConnection = ({
  onData,
  onConnectionChange,
}: DeviceConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Replace with your Pi Zero's IP address
  const PI_ZERO_IP = "your-pi-zero-ip";
  const GPS_URL = `http://${PI_ZERO_IP}:5000/gps`;
  const CAMERA_URL = `http://${PI_ZERO_IP}:8000/stream.mjpg`;

  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([0, 0]).addTo(map);
    markerRef.current = marker;
    mapInstance.current = map;
  };

  const updateGPS = async () => {
    try {
      const response = await fetch(GPS_URL);
      const data = await response.json();

      if (data.latitude && data.longitude) {
        const gpsData = {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy || 0,
          timestamp: Date.now(),
        };

        const newDeviceData: DeviceData = {
          gps: gpsData,
          camera: deviceData?.camera || { imageData: "", timestamp: 0 },
        };

        setDeviceData(newDeviceData);
        onData?.(newDeviceData);

        if (markerRef.current && mapInstance.current) {
          markerRef.current.setLatLng([gpsData.latitude, gpsData.longitude]);
          mapInstance.current.setView(
            [gpsData.latitude, gpsData.longitude],
            16
          );
        }
      }
    } catch (err) {
      console.error("Error fetching GPS:", err);
      setError("Failed to fetch GPS data");
    }
  };

  const connectToDevice = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Initialize map
      initializeMap();

      // Start GPS updates
      updateGPS();
      const gpsInterval = setInterval(updateGPS, 1000);

      // Set up camera feed
      if (videoRef.current) {
        videoRef.current.src = CAMERA_URL;
      }

      setIsConnected(true);
      setIsConnecting(false);
      onConnectionChange?.(true);
      toast.success("Connected to device");

      return () => {
        clearInterval(gpsInterval);
        if (mapInstance.current) {
          mapInstance.current.remove();
        }
      };
    } catch (err) {
      setError(
        "Failed to connect: " +
          (err instanceof Error ? err.message : String(err))
      );
      setIsConnecting(false);
      onConnectionChange?.(false);
      toast.error("Failed to connect to device");
    }
  };

  const disconnectFromDevice = () => {
    setIsConnected(false);
    setDeviceData(null);
    onConnectionChange?.(false);
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
    if (videoRef.current) {
      videoRef.current.src = "";
    }
  };

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5 text-navi-400" />
            Device Connection
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={isConnected ? disconnectFromDevice : connectToDevice}
            disabled={isConnecting}
            className="text-navi-400 hover:text-navi-300"
          >
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bluetooth className="h-4 w-4" />
            )}
            <span className="ml-2">
              {isConnected
                ? "Disconnect"
                : isConnecting
                ? "Connecting..."
                : "Connect"}
            </span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

        {isConnected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Camera Feed */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-navi-400" />
                  <h3 className="font-medium">Camera Feed</h3>
                </div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                {deviceData?.camera && (
                  <p className="text-xs text-gray-400">
                    Last update:{" "}
                    {new Date(deviceData.camera.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>

              {/* GPS Data */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-navi-400" />
                  <h3 className="font-medium">GPS Location</h3>
                </div>
                {deviceData?.gps ? (
                  <div className="space-y-1">
                    <p className="text-sm">
                      Latitude: {deviceData.gps.latitude.toFixed(6)}
                    </p>
                    <p className="text-sm">
                      Longitude: {deviceData.gps.longitude.toFixed(6)}
                    </p>
                    <p className="text-sm">
                      Accuracy: {deviceData.gps.accuracy.toFixed(2)} meters
                    </p>
                    <p className="text-xs text-gray-400">
                      Last update:{" "}
                      {new Date(deviceData.gps.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No GPS data available</p>
                )}
                <div
                  ref={mapRef}
                  className="h-[300px] w-full rounded-lg overflow-hidden"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400">
              {isConnecting
                ? "Connecting to device..."
                : "Connect to your device to view camera feed and GPS data"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceConnection;
