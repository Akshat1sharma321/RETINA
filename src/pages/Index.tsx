import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import LoginForm from "@/components/LoginForm";
import {
  ArrowRight,
  Eye,
  MapPin,
  AlertCircle,
  MessageCircle,
  Brain,
  Glasses,
  VolumeX,
  MousePointerClick,
  Cpu,
} from "lucide-react";

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full py-4 px-6 flex justify-between items-center backdrop-blur-lg bg-black/30 z-10 sticky top-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-navi-600 text-white h-8 w-8 rounded-md flex items-center justify-center">
            <Glasses size={20} />
          </div>
          <span className="text-2xl font-bold text-gradient">R.E.T.I.N.A</span>
        </Link>

        <Button
          onClick={handleLoginClick}
          className="bg-navi-600 hover:bg-navi-700 text-white"
        >
          Sign In
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </header>

      <main className="min-h-screen">
        <section className="px-6 py-16 md:py-24">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl text-gradient mb-4">
                Smart Glasses for the Visually Impaired
              </h1>

              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
                R.E.T.I.N.A's cutting-edge technology transforms visual
                information into audio descriptions, helping visually impaired
                individuals navigate and experience the world with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleLoginClick}
                  className="bg-navi-600 hover:bg-navi-700 text-white px-8 py-6 text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  onClick={scrollToAbout}
                  variant="outline"
                  className="border-white/20 hover:bg-white/5 px-8 py-6 text-lg"
                >
                  About
                  <MousePointerClick className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="w-full max-w-lg mx-auto">
              <AspectRatio
                ratio={4 / 3}
                className="bg-black/20 rounded-2xl overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800"
                  alt="A person wearing smart glasses with AR visual assistance overlay"
                  className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                />
              </AspectRatio>
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="glass p-4 rounded-2xl overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <img
                  src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800"
                  alt="Advanced AI technology helping visually impaired users navigate"
                  className="object-cover w-full h-full rounded-xl"
                />
              </AspectRatio>
            </div>
            <div className="glass p-4 rounded-2xl overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <img
                  src="https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=800"
                  alt="Real-time object detection and environment description"
                  className="object-cover w-full h-full rounded-xl"
                />
              </AspectRatio>
            </div>
          </div>
        </section>

        <section
          ref={aboutSectionRef}
          className="px-6 py-16 md:py-24 bg-gradient-to-b from-black/20 to-black/40 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] h-[300px] bg-navi-500/30 rounded-full filter blur-[100px] -z-10"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-navi-500/30 rounded-full filter blur-[100px] -z-10"></div>

          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-navi-400 to-navi-600">
                About the Device
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                R.E.T.I.N.A Smart Glasses is an innovative assistive technology
                designed to enhance independence and safety for visually
                impaired individuals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-8">
                <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-navi-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] min-h-[300px] flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-navi-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Eye className="h-6 w-6 text-navi-400" />
                    </div>
                    <h3 className="text-2xl font-semibold">Core Features</h3>
                  </div>
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-start gap-4 group/item hover:text-white transition-colors">
                      <div className="h-6 w-6 rounded-full bg-navi-600/20 flex items-center justify-center mt-1 group-hover/item:bg-navi-600/40 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-navi-400"></div>
                      </div>
                      <span>
                        Real-time object detection and environment description
                      </span>
                    </li>
                    <li className="flex items-start gap-4 group/item hover:text-white transition-colors">
                      <div className="h-6 w-6 rounded-full bg-navi-600/20 flex items-center justify-center mt-1 group-hover/item:bg-navi-600/40 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-navi-400"></div>
                      </div>
                      <span>
                        Precise location tracking and navigation assistance
                      </span>
                    </li>
                    <li className="flex items-start gap-4 group/item hover:text-white transition-colors">
                      <div className="h-6 w-6 rounded-full bg-navi-600/20 flex items-center justify-center mt-1 group-hover/item:bg-navi-600/40 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-navi-400"></div>
                      </div>
                      <span>Emergency assistance with location sharing</span>
                    </li>
                  </ul>
                </div>

                <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-navi-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] min-h-[300px] flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-navi-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Brain className="h-6 w-6 text-navi-400" />
                    </div>
                    <h3 className="text-2xl font-semibold">How It Works</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    R.E.T.I.N.A uses advanced computer vision and AI to analyze
                    the surrounding environment, providing audio feedback about
                    objects, people, and obstacles in real-time. The device
                    integrates with navigation systems to offer turn-by-turn
                    directions and can quickly connect to emergency services
                    when needed.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-navi-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] min-h-[300px] flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-navi-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl font-bold text-navi-400">✓</div>
                    </div>
                    <h3 className="text-2xl font-semibold">Key Benefits</h3>
                  </div>
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-start gap-4 group/item hover:text-white transition-colors">
                      <div className="h-6 w-6 rounded-full bg-navi-600/20 flex items-center justify-center mt-1 group-hover/item:bg-navi-600/40 transition-colors">
                        <span className="text-sm font-medium text-navi-400">
                          1
                        </span>
                      </div>
                      <span>Enhanced independence in daily activities</span>
                    </li>
                    <li className="flex items-start gap-4 group/item hover:text-white transition-colors">
                      <div className="h-6 w-6 rounded-full bg-navi-600/20 flex items-center justify-center mt-1 group-hover/item:bg-navi-600/40 transition-colors">
                        <span className="text-sm font-medium text-navi-400">
                          2
                        </span>
                      </div>
                      <span>
                        Improved safety with real-time obstacle detection
                      </span>
                    </li>
                    <li className="flex items-start gap-4 group/item hover:text-white transition-colors">
                      <div className="h-6 w-6 rounded-full bg-navi-600/20 flex items-center justify-center mt-1 group-hover/item:bg-navi-600/40 transition-colors">
                        <span className="text-sm font-medium text-navi-400">
                          3
                        </span>
                      </div>
                      <span>Seamless integration with emergency services</span>
                    </li>
                    <li className="flex items-start gap-4 group/item hover:text-white transition-colors">
                      <div className="h-6 w-6 rounded-full bg-navi-600/20 flex items-center justify-center mt-1 group-hover/item:bg-navi-600/40 transition-colors">
                        <span className="text-sm font-medium text-navi-400">
                          4
                        </span>
                      </div>
                      <span>User-friendly interface with voice commands</span>
                    </li>
                  </ul>
                </div>

                <div className="group p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-navi-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] min-h-[300px] flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-navi-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Cpu className="h-6 w-6 text-navi-400" />
                    </div>
                    <h3 className="text-2xl font-semibold">Technology</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Built with cutting-edge AI and machine learning algorithms,
                    R.E.T.I.N.A continuously learns and adapts to provide
                    personalized assistance. The device features high-resolution
                    cameras, advanced sensors, and powerful processing
                    capabilities to deliver accurate and timely information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:py-24 mt-auto">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[300px] h-[300px] bg-navi-500/30 rounded-full filter blur-[100px] -z-10"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience R.E.T.I.N.A?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl">
              Join thousands of users who are discovering a new level of
              independence with R.E.T.I.N.A smart glasses.
            </p>

            <Button
              onClick={handleLoginClick}
              className="bg-navi-600 hover:bg-navi-700 text-white px-8 py-6 text-lg"
            >
              Sign In to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        <footer className="px-6 py-12 border-t border-white/10 mt-auto bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-navi-600 text-white h-10 w-10 rounded-md flex items-center justify-center">
                    <Glasses size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gradient">
                    R.E.T.I.N.A
                  </span>
                </div>
                <p className="text-gray-400 text-center md:text-left max-w-xs">
                  Empowering visually impaired individuals with cutting-edge
                  assistive technology.
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-end">
                <div className="flex gap-6">
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about-device"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Device
                  </Link>
                  <Link
                    to="/emergency"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Emergency
                  </Link>
                  <Link
                    to="/location"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Location
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="text-gray-500 text-sm text-center">
                &copy; 2025 R.E.T.I.N.A Technology. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </main>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="bg-gray-900 border border-white/10">
          <LoginForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
