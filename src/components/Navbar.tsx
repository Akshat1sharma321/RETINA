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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { path: "/dashboard", name: "Home", icon: Home },
  { path: "/location", name: "Location", icon: MapPin },
  { path: "/camera", name: "Camera", icon: Camera },
  { path: "/emergency", name: "Emergency", icon: AlertCircle },
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
              ? "dark:bg-black/80 dark:border-white/10 light:bg-[#4461F2]/80 light:border-[#E6D9FF] backdrop-blur-lg border-b"
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
            className="p-2 dark:text-white dark:hover:text-gray-300 light:text-[#FAF8FF] light:hover:text-[#E6D9FF]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="fixed inset-0 z-40 dark:bg-black/95 light:bg-[#4461F2]/95 backdrop-blur-md pt-16 flex flex-col animate-fade-in">
            <div className="flex flex-col space-y-2 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 text-lg rounded-md ${
                    isActive(item.path)
                      ? "dark:bg-navi-500/20 dark:text-navi-400 light:bg-[#9747FF]/20 light:text-[#FAF8FF]"
                      : "dark:hover:bg-white/5 dark:text-white light:text-[#E6D9FF] light:hover:bg-[#9747FF]/10 light:hover:text-[#FAF8FF]"
                  } ${
                    item.name === "Location" ||
                    item.name === "Camera" ||
                    item.name === "Emergency"
                      ? "dark:bg-navi-500/10 light:bg-[#9747FF]/10 dark:hover:bg-navi-500/20 light:hover:bg-[#9747FF]/20"
                      : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}

              <Button
                variant="ghost"
                className="flex items-center gap-4 px-4 py-3 text-lg rounded-md mt-auto text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-start font-normal"
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
      <div className="hidden lg:flex flex-col h-screen fixed left-0 top-0 w-64 dark:bg-black/60 dark:border-white/10 light:bg-[#4461F2]/90 light:border-[#E6D9FF] backdrop-blur-xl border-r z-40">
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
                  ? "dark:bg-navi-500/20 dark:text-navi-400 light:bg-[#9747FF]/20 light:text-[#FAF8FF]"
                  : "dark:hover:bg-white/5 dark:text-white light:text-[#E6D9FF] light:hover:bg-[#9747FF]/10 light:hover:text-[#FAF8FF]"
              } ${
                item.name === "Location" ||
                item.name === "Camera" ||
                item.name === "Emergency"
                  ? "dark:bg-navi-500/10 light:bg-[#9747FF]/10 dark:hover:bg-navi-500/20 light:hover:bg-[#9747FF]/20"
                  : ""
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-4 dark:border-white/10 light:border-[#E6D9FF] border-t">
          <Button
            variant="ghost"
            className="flex items-center w-full gap-4 px-6 text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-start"
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
