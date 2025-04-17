import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import {
  Info,
  RefreshCw,
  Settings,
  Download,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const AboutDevice = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const deviceInfo = {
    deviceName: "R.E.T.I.N.A Smart Glasses",
    model: "NS-2000",
    serialNumber: "NSG-2025-04152",
    firmware: "v2.4.1",
    batteryHealth: "Good",
    storageTotal: 32, // GB
    storageUsed: 14.5, // GB
    lastMaintenance: "2025-03-22",
  };

  const checkForUpdates = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Checking for updates...",
      success: "Your device is up to date!",
      error: "Failed to check for updates.",
    });
  };

  const resetDevice = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Resetting device settings...",
      success: "Device settings have been reset!",
      error: "Failed to reset settings.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="lg:ml-64 pt-16 lg:pt-6 min-h-screen">
        <div className="container px-4 py-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-1">
              About Device
            </h2>
            <p className="text-gray-400 text-sm">
              View information and manage your R.E.T.I.N.A smart glasses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>
                  Technical details about your R.E.T.I.N.A device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Device Name</span>
                    <span className="font-medium">{deviceInfo.deviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model</span>
                    <span className="font-medium">{deviceInfo.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Serial Number</span>
                    <span className="font-medium font-mono">
                      {deviceInfo.serialNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Firmware Version</span>
                    <span className="font-medium">{deviceInfo.firmware}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Battery Health</span>
                    <span className="font-medium text-green-400">
                      {deviceInfo.batteryHealth}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Maintenance</span>
                    <span className="font-medium">
                      {deviceInfo.lastMaintenance}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Storage</CardTitle>
                <CardDescription>Device storage usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Used Space</span>
                      <span className="font-medium">
                        {deviceInfo.storageUsed} GB of {deviceInfo.storageTotal}{" "}
                        GB
                      </span>
                    </div>
                    <Progress
                      value={
                        (deviceInfo.storageUsed / deviceInfo.storageTotal) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Videos</span>
                        <span className="font-medium">8.2 GB</span>
                      </div>
                      <Progress
                        value={(8.2 / deviceInfo.storageTotal) * 100}
                        className="h-1.5 bg-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Photos</span>
                        <span className="font-medium">3.6 GB</span>
                      </div>
                      <Progress
                        value={(3.6 / deviceInfo.storageTotal) * 100}
                        className="h-1.5 bg-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Voice Data</span>
                        <span className="font-medium">1.8 GB</span>
                      </div>
                      <Progress
                        value={(1.8 / deviceInfo.storageTotal) * 100}
                        className="h-1.5 bg-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">System</span>
                        <span className="font-medium">0.9 GB</span>
                      </div>
                      <Progress
                        value={(0.9 / deviceInfo.storageTotal) * 100}
                        className="h-1.5 bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-navi-600/40 flex items-center justify-center rounded-lg mb-4 text-navi-400">
                  <RefreshCw size={24} />
                </div>
                <h3 className="text-lg font-medium mb-3">Check for Updates</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Ensure your device has the latest features and security
                  updates
                </p>
                <Button
                  onClick={checkForUpdates}
                  className="w-full bg-navi-600 hover:bg-navi-700"
                >
                  Check Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-navi-600/40 flex items-center justify-center rounded-lg mb-4 text-navi-400">
                  <Settings size={24} />
                </div>
                <h3 className="text-lg font-medium mb-3">
                  Reset Device Settings
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Restore default settings without deleting your data
                </p>
                <Button
                  onClick={resetDevice}
                  variant="outline"
                  className="w-full"
                >
                  Reset Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-500/20 flex items-center justify-center rounded-lg mb-4 text-red-400">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-medium mb-3">Factory Reset</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Erase all data and restore device to factory condition
                </p>
                <Button variant="destructive" className="w-full">
                  Factory Reset
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-white/10 bg-black/40 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Access guides and manuals for your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Info size={20} className="text-navi-400" />
                    <div>
                      <p className="font-medium">User Manual</p>
                      <p className="text-sm text-gray-400">
                        Complete guide to using R.E.T.I.N.A smart glasses
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download size={16} /> Download
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Info size={20} className="text-navi-400" />
                    <div>
                      <p className="font-medium">Quick Start Guide</p>
                      <p className="text-sm text-gray-400">
                        Get started with your device in minutes
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download size={16} /> Download
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Info size={20} className="text-navi-400" />
                    <div>
                      <p className="font-medium">Troubleshooting Guide</p>
                      <p className="text-sm text-gray-400">
                        Solutions to common issues
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download size={16} /> Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default AboutDevice;
