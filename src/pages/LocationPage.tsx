
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Map from "@/components/Map";
import ChatBot from "@/components/ChatBot";

const LocationPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="lg:ml-64 pt-16 lg:pt-6 min-h-screen">
        <div className="container px-4 py-6">
          <Map />
        </div>
      </main>
      
      <ChatBot />
    </div>
  );
};

export default LocationPage;
