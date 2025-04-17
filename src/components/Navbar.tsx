import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  Camera,
  AlertCircle,
  Info,
  Menu,
  X,
  LogOut,
  Navigation2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { path: "/dashboard", name: "Home", icon: Home },
  { path: "/location", name: "Location", icon: MapPin },
  { path: "/navigation", name: "Navigation", icon: Navigation2 },
  { path: "/camera", name: "Camera", icon: Camera },
  { path: "/emergency", name: "Emergency", icon: AlertCircle },
  { path: "/about-device", name: "About Device", icon: Info },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile navbar */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-50">
        <div
          className={`flex justify-between items-center py-2 px-4 ${
            scrollPosition > 10
              ? "bg-black/80 backdrop-blur-lg border-b border-white/10"
              : "bg-transparent"
          } transition-all duration-300`}
        >
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient">
              R.E.T.I.N.A
            </span>
          </Link>
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md pt-16 flex flex-col animate-fade-in">
            <div className="flex flex-col space-y-2 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-lg rounded-md ${
                    isActive(item.path)
                      ? "bg-navi-500/20 text-navi-400"
                      : "hover:bg-white/5"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}

              <Button
                variant="ghost"
                className="flex items-center gap-3 px-4 py-3 text-lg rounded-md mt-auto text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-start font-normal"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-screen fixed left-0 top-0 w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 z-40">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient">
              R.E.T.I.N.A
            </span>
          </Link>
        </div>

        <div className="flex flex-col flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                isActive(item.path)
                  ? "bg-navi-500/20 text-navi-400"
                  : "hover:bg-white/5"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="flex items-center w-full gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-start"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
