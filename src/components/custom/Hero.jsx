import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Sparkles, Plane, Mountain, Building2 } from 'lucide-react';

function Hero() {
  const [currentDestination, setCurrentDestination] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const destinations = [
    { text: 'City Escapes', icon: Building2, color: 'from-blue-500 to-purple-600' },
    { text: 'Mountain Adventures', icon: Mountain, color: 'from-green-500 to-teal-600' },
    { text: 'Beach Getaways', icon: Plane, color: 'from-orange-500 to-pink-600' },
    { text: 'Cultural Journeys', icon: MapPin, color: 'from-purple-500 to-indigo-600' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDestination((prev) => (prev + 1) % destinations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const FloatingIcon = ({ icon: Icon, delay, x, y }) => (
    <div
      className="absolute opacity-20 animate-bounce text-[#f56551]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: '3s',
      }}
    >
      <Icon size={24} />
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingIcon icon={Plane} delay={0} x={10} y={20} />
        <FloatingIcon icon={MapPin} delay={1} x={85} y={15} />
        <FloatingIcon icon={Mountain} delay={2} x={15} y={70} />
        <FloatingIcon icon={Building2} delay={0.5} x={80} y={75} />
        <FloatingIcon icon={Calendar} delay={1.5} x={5} y={45} />
        <FloatingIcon icon={Users} delay={2.5} x={90} y={50} />
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#f56551]/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-[#f56551]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx Gaul max-w-4xl mx-auto text-center space-y-8">
        {/* Main heading with interactive destination cycling */}
        <div className="space-y-6">
          <h1 className="font-extrabold text-3xl md:text-5xl lg:text-6xl leading-tight">
            <span className="block mb-6 ">From </span>
            <div className="relative inline-flex items-center justify-center min-w-fit h-auto overflow-visible">
              <span
                className={`inline-flex items-center gap-3 text-4xl text-transparent bg-clip-text bg-gradient-to-r ${destinations[currentDestination].color} animate-pulse transition-all duration-500 whitespace-nowrap font-extrabold`}
              >
                {React.createElement(destinations[currentDestination].icon, {
                  size: 50,
                  className: 'text-[#f56551] inline-block mr-2 flex-shrink-0',
                })}
                <span className="font-extrabold">{destinations[currentDestination].text}</span>
              </span>
            </div>
            <span className="block mt-6 ">
              we help you build your dream trip in
              <span className="text-[#f56551] ml-3 inline-flex items-center gap-2 text-4xl">
                minutes
                <Sparkles className="animate-spin" size={35} />
              </span>
            </span>
          </h1>

          {/* Animated subtitle */}
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-fade-in">
            Plan your next trip with ease. Choose your destination, set your dates, and we'll help you build the perfect journey — step by step
          </p>
        </div>

        {/* Interactive CTA section */}
        <div className="space-y-6">
          <div
            className="relative inline-block"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              className={`
                relative px-8 py-4 text-lg font-bold rounded-full
                bg-gradient-to-r from-[#f56551] to-orange-500 
                hover:from-[#f56551]/90 hover:to-orange-500/90
                transform hover:scale-105 transition-all duration-300
                shadow-2xl hover:shadow-[#f56551]/25
                text-white border-none cursor-pointer
                ${isHovered ? 'animate-pulse' : ''}
              `}
              onClick={() => (window.location.href = '/create-trip')}
            >
              <Sparkles className="mr-2 animate-spin inline-block" size={20} />
              Get Started, It's Free
              <Plane className="ml-2 transform group-hover:translate-x-1 transition-transform inline-block" size={20} />
            </button>

            {/* Ripple effect */}
            {isHovered && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
              </div>
            )}
          </div>

        </div>
      </div>


      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Hero;