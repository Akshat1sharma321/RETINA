import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Download, Pause, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CameraFeed = () => {
  const [isLive, setIsLive] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      // Try different video constraints to avoid green screen
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: "environment",
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Add event listeners to handle video loading
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => {
            console.error("Error playing video:", e);
            setError("Error starting video playback");
          });
        };

        videoRef.current.onerror = () => {
          setError("Error with video element");
          stopCamera();
        };

        setHasPermission(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
      setIsLive(false);
      setError(err instanceof Error ? err.message : "Failed to access camera");

      // Try fallback constraints if initial attempt fails
      try {
        const fallbackConstraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 24 },
          },
          audio: false,
        };

        const fallbackStream = await navigator.mediaDevices.getUserMedia(
          fallbackConstraints
        );
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          streamRef.current = fallbackStream;
          setHasPermission(true);
          setError(null);
        }
      } catch (fallbackErr) {
        console.error("Fallback camera access failed:", fallbackErr);
        setError("Could not access camera with any settings");
      }
    }
  };

  useEffect(() => {
    if (isLive && !streamRef.current) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isLive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setError(null);
  };

  const toggleLive = () => {
    if (!isLive) {
      startCamera();
    } else {
      stopCamera();
    }
    setIsLive(!isLive);
  };

  const mockVideos = [
    {
      id: "video1",
      title: "Morning Walk",
      date: "2025-04-16",
      time: "08:32 AM",
      duration: "15:23",
      thumbnail: "bg-gradient-to-br from-gray-700 to-gray-900",
    },
    {
      id: "video2",
      title: "Grocery Store",
      date: "2025-04-15",
      time: "02:14 PM",
      duration: "23:56",
      thumbnail: "bg-gradient-to-br from-gray-800 to-gray-950",
    },
    {
      id: "video3",
      title: "Park Visit",
      date: "2025-04-14",
      time: "10:45 AM",
      duration: "32:17",
      thumbnail: "bg-gradient-to-br from-gray-700 to-gray-800",
    },
  ];

  const mockPhotos = [
    {
      id: "photo1",
      title: "Crosswalk",
      date: "2025-04-16",
      time: "09:15 AM",
      thumbnail: "bg-gradient-to-br from-gray-600 to-gray-800",
    },
    {
      id: "photo2",
      title: "Bus Stop",
      date: "2025-04-16",
      time: "09:42 AM",
      thumbnail: "bg-gradient-to-br from-gray-700 to-gray-900",
    },
    {
      id: "photo3",
      title: "Coffee Shop",
      date: "2025-04-15",
      time: "03:27 PM",
      thumbnail: "bg-gradient-to-br from-gray-600 to-gray-700",
    },
    {
      id: "photo4",
      title: "Street Corner",
      date: "2025-04-15",
      time: "05:12 PM",
      thumbnail: "bg-gradient-to-br from-gray-700 to-gray-800",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-1">Camera Feed</h2>
        <p className="text-gray-400">
          View the live feed from your device camera
        </p>
      </div>

      <Card className="border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="relative aspect-video w-full bg-gray-900">
          {isLive ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }} // Mirror the video for better UX
              />
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/75">
                  <p className="text-red-400 text-center p-4">{error}</p>
                </div>
              )}
              {!error && (
                <>
                  <div className="absolute top-4 left-4 flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-white font-medium">LIVE</span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-sm text-gray-300">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center justify-center h-full">
              <Camera size={48} className="mb-2 opacity-50" />
              <p>
                {error ||
                  (hasPermission ? "Feed paused" : "Camera access denied")}
              </p>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">
              {isLive
                ? "Streaming live from device camera"
                : error
                ? "Camera error"
                : hasPermission
                ? "Feed paused"
                : "Camera access required"}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleLive}
              className="bg-gray-800 hover:bg-gray-700"
            >
              {isLive ? (
                <>
                  <Pause className="mr-1 h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="mr-1 h-4 w-4" /> Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        defaultValue="videos"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4 bg-gray-900/50">
          <TabsTrigger value="videos">Recorded Videos</TabsTrigger>
          <TabsTrigger value="photos">Captured Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockVideos.map((video) => (
              <Card
                key={video.id}
                className="border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden hover:bg-black/60 transition-colors cursor-pointer"
              >
                <div className={`aspect-video relative ${video.thumbnail}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-12 h-12 opacity-80 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h4 className="font-medium">{video.title}</h4>
                  <p className="text-sm text-gray-400">
                    {video.date} • {video.time}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 w-full flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mockPhotos.map((photo) => (
              <Card
                key={photo.id}
                className="border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden hover:bg-black/60 transition-colors cursor-pointer"
              >
                <div
                  className={`aspect-square relative ${photo.thumbnail}`}
                ></div>
                <CardContent className="p-3">
                  <h4 className="font-medium">{photo.title}</h4>
                  <p className="text-sm text-gray-400">
                    {photo.date} • {photo.time}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 w-full flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CameraFeed;
