import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
// axios import removed - using fetch instead
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/service/firebaseConfig";
import { Plus, MapPin, User, LogOut, Sparkles } from "lucide-react";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog, setOpenDialog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    console.log("User:", user);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => GetUserProfile(tokenInfo),
    onError: (error) => {
      console.log("Login Error:", error);
      toast("Google login failed");
    },
    scope: "email profile",
    prompt: "consent",
    flow: "implicit",
    redirect_uri: "http://localhost:5173",
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const credential = GoogleAuthProvider.credential(
        null,
        tokenInfo.access_token
      );
      await signInWithCredential(auth, credential);
      // Using fetch instead of axios
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo.access_token}`
      );
      const userData = await response.json();
      console.log("User Profile:", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error fetching user profile or signing in:", error);
      toast(`Failed to fetch user profile or sign in: ${error.message}`);
    }
  };

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white shadow-sm'
      }
    `}>
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo section with hover effect */}
        <div className="flex items-center group cursor-pointer">
          <a href="/" className="flex items-center group cursor-pointer">
  <div className="relative">
    <img
      src="/logo.svg"
      alt="Logo"
      className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute -inset-2 bg-gradient-to-r from-[#f56551]/10 to-orange-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
  </div>
</a>

        </div>

        {/* Right side navigation */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Create Trip Button */}
              <a href="/create-trip">
                <Button 
                  variant="outline" 
                  className="
                    relative overflow-hidden rounded-full px-6 py-2 font-medium
                    border-2 border-[#f56551]/20 text-[#f56551] 
                    hover:border-[#f56551] hover:text-white hover:shadow-lg
                    transition-all duration-300 group
                  "
                  onMouseEnter={() => setHoveredButton('create')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f56551] to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <Plus size={16} className="mr-2 relative z-10 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="relative z-10">Create Trip</span>
                  {hoveredButton === 'create' && (
                    <Sparkles size={14} className="absolute top-1 right-1 text-yellow-400 animate-pulse" />
                  )}
                </Button>
              </a>

              {/* My Trips Button */}
              <a href="/my-trips">
                <Button 
                  variant="outline" 
                  className="
                    relative overflow-hidden rounded-full px-6 py-2 font-medium
                    border-2 border-gray-200 text-gray-600 
                    hover:border-[#f56551] hover:text-[#f56551] hover:shadow-lg
                    transition-all duration-300 group
                  "
                  onMouseEnter={() => setHoveredButton('trips')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <MapPin size={16} className="mr-2 transition-transform duration-300 group-hover:scale-110" />
                  <span>My Trips</span>
                  {hoveredButton === 'trips' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f56551]/10 to-orange-500/10 rounded-full"></div>
                  )}
                </Button>
              </a>

              {/* User Profile Popover */}
              <Popover>
                <PopoverTrigger>
                  <div className="relative group cursor-pointer">
                    <img
                      src={user?.picture}
                      className="h-10 w-10 rounded-full border-2 border-transparent group-hover:border-[#f56551] transition-all duration-300 group-hover:shadow-lg"
                      alt="User Profile"
                    />
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#f56551] to-orange-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <img
                        src={user?.picture}
                        className="h-8 w-8 rounded-full"
                        alt="User Profile"
                      />
                      <div>
                        <p className="font-medium text-sm text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      className="
                        w-full flex items-center gap-2 p-2 rounded-lg 
                        text-red-600 hover:bg-red-50 hover:text-red-700
                        transition-all duration-200 cursor-pointer
                        group
                      "
                      onClick={() => {
                        googleLogout();
                        localStorage.clear();
                        window.location.reload();
                      }}
                    >
                      <LogOut size={16} className="group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">Log Out</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button 
              onClick={() => setOpenDialog(true)} 
              className="
                relative overflow-hidden rounded-full px-8 py-3 font-bold
                bg-gradient-to-r from-[#f56551] to-orange-500 
                hover:from-[#f56551]/90 hover:to-orange-500/90
                text-white border-none shadow-lg hover:shadow-xl
                transform hover:scale-105 transition-all duration-300
                group
              "
            >
              <User size={18} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
              <span>Sign In</span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Sign In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-0 shadow-2xl">
          <DialogHeader className="space-y-6">
            <DialogDescription className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <img src="/logo.svg" className="h-10 w-auto" />
                  <div className="absolute -inset-3 bg-gradient-to-r from-[#f56551]/20 to-orange-500/20 rounded-full blur-lg"></div>
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="font-bold text-2xl text-gray-900">Welcome Back!</h2>
                <p className="text-gray-600 leading-relaxed">
                  Sign in to unlock personalized trip planning and save your favorite destinations
                </p>
              </div>
              <Button
                onClick={() => login()}
                className="
                  w-full flex gap-4 items-center justify-center py-4 rounded-xl
                  bg-white border-2 border-gray-200 text-gray-700 font-medium
                  hover:border-[#f56551] hover:shadow-lg hover:scale-105
                  transition-all duration-300 group
                "
              >
                <FcGoogle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Continue with Google</span>
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;