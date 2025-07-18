import React, { useEffect, useState } from "react";
import { FaShare } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { GetPlaceDetails } from "@/service/GlobalApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_API_KEY_NEW

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.tripData?.location
    };
    const result = await GetPlaceDetails(data).then(resp => {
      console.log(resp.data.places[0].photos[3].name);
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
      setPhotoUrl(PhotoUrl);
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `Trip to ${trip?.tripData?.location || "Unknown Location"}`,
      text: `Check out my trip to ${trip?.tripData?.location || "Unknown Location"}! Duration: ${trip?.tripData?.travel_duration || "N/A"}, Budget: ${trip?.tripData?.budget || "N/A"}, Travelers: ${trip?.tripData?.traveler_type || "N/A"}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        
      } catch (error) {
        console.error("Error sharing trip:", error);
        toast("Failed to share trip.");
      }
    } else {
      try {
        await navigator.clipboard.write(shareData.url);
        toast("Trip link copied to clipboard!");
      } catch (error) {
        console.error("Error copying link to clipboard:", error);
        toast("Failed to copy link to clipboard.");
      }
    }
  };

  return (
    <div className="mt-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
      <div className="relative overflow-hidden rounded-xl group">
        <img
          src={photoUrl ? photoUrl : '/placeholder.png'}
          className="h-[340px] w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
          alt="Trip Location"
        />
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f56551]/30 rounded-xl transition-all duration-500"></div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-2xl transition-all duration-300 hover:text-[#f56551] hover:text-shadow-sm">
            {trip?.tripData?.location || "Unknown Location"}
          </h2>
          <div className="flex gap-3 flex-wrap">
            <span className="p-1 px-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-gray-600 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-sm hover:bg-gradient-to-r hover:from-[#f56551]/10 hover:to-orange-500/10">
              🗓️ {trip?.tripData?.travel_duration || "N/A"}
            </span>
            <span className="p-1 px-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-gray-600 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-sm hover:bg-gradient-to-r hover:from-[#f56551]/10 hover:to-orange-500/10">
              💰 {trip?.tripData?.budget || "N/A"} Budget
            </span>
            <span className="p-1 px-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-gray-600 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-sm hover:bg-gradient-to-r hover:from-[#f56551]/10 hover:to-orange-500/10">
              💗 No. Of Travelers: {trip?.tripData?.traveler_type || "N/A"}
            </span>
          </div>
        </div>
        <Button
          onClick={handleShare}
          className="
            relative overflow-hidden rounded-full p-2 bg-gradient-to-r from-[#f56551] to-orange-500 
            text-white border-none shadow-md hover:shadow-lg hover:scale-110 
            transition-all duration-300 group
          "
        >
          <FaShare className="group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></div>
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;