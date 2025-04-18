import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";
import {
  Eye,
  MapPin,
  AlertCircle,
  Battery,
  Signal,
  MessageCircle,
  History,
  Info,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const deviceStatus = {
    batteryLevel: 78,
    signalStrength: "Good",
    lastSync: "Today, 11:23 AM",
    firmware: "v2.4.1",
  };

  const recentActivities = [
    {
      id: "activity1",
      title: "Location Updated",
      time: "12:34 PM",
      description: "Device location refreshed",
      icon: <MapPin size={16} />,
    },
    {
      id: "activity2",
      title: "Camera Used",
      time: "11:05 AM",
      description: "Photo taken at Market Street",
      icon: <Eye size={16} />,
    },
    {
      id: "activity3",
      title: "Voice Assistant Used",
      time: "10:23 AM",
      description: "Navigation directions requested",
      icon: <MessageCircle size={16} />,
    },
    {
      id: "activity4",
      title: "Sync Complete",
      time: "09:15 AM",
      description: "All data synchronized with cloud",
      icon: <History size={16} />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="lg:ml-64 pt-16 lg:pt-6 min-h-screen">
        <div className="container px-4 py-6">
          <h1 className="text-3xl font-bold mb-6 text-[#6B5B95]">Dashboard</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border border-[#C4D9FF] bg-black/40 backdrop-blur-sm col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card
                  className="border border-[#C4D9FF] bg-navi-600/20 hover:bg-navi-600/40 hover:text-navi-600 text-navi-600/40 cursor-pointer   transition-colors"
                  onClick={() => navigate("/location")}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-[#C5BAFF]/20 flex items-center justify-center rounded-lg mb-2 text-white">
                      <MapPin size={20} />
                    </div>
                    <p className="font-medium hover:text-navi-600 text-white ">
                      Location
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="border border-[#C4D9FF]  bg-navi-600/20 hover:bg-navi-600/40 hover:text-navi-600 text-navi-600/40cursor-pointer transition-colors"
                  onClick={() => navigate("/camera")}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-[#C5BAFF]/20 flex items-center justify-center rounded-lg mb-2 text-white">
                      <Eye size={20} />
                    </div>
                    <p className="font-medium  hover:text-navi-600 text-white">
                      Camera
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="border border-[#C4D9FF]  bg-navi-600/20 hover:bg-navi-600/40 hover:text-navi-600 text-navi-600/40 cursor-pointer transition-colors"
                  onClick={() => navigate("/emergency")}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-[#C5BAFF]/20 flex items-center justify-center rounded-lg mb-2 text-white">
                      <AlertCircle size={20} />
                    </div>
                    <p className="font-medium  hover:text-navi-600 text-white">
                      Emergency
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card className="border border-[#C4D9FF] bg-black/40 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className=" text-blue-400">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#C5BAFF]/20 flex items-center justify-center text-[#6B5B95] mt-1">
                      {activity.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-navi-400">
                          {activity.title}
                        </p>
                        <span className="text-xs text-white">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-white">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Dashboard;
