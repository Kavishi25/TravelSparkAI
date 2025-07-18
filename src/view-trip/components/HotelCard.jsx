import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";

function HotelCard({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel.hotel_name
    };
    const result = await GetPlaceDetails(data).then(resp => {
      console.log(resp.data.places[0].photos[4].name);
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
      setPhotoUrl(PhotoUrl);
    });
  };

  return (
    <div className="h-[300px] flex flex-col">
      <Link
        to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          hotel.hotel_name + "," + hotel.hotel_address
        )}`}
        target="_blank"
      >
        <div className="h-full flex flex-col p-4 border rounded-lg bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg group relative overflow-hidden">
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f56551]/30 rounded-lg transition-all duration-500"></div>
          <img
            src={photoUrl ? photoUrl : '/placeholder.png'}
            className="h-[200px] w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            alt={hotel.hotel_name}
          />
          <div className="my-2 flex flex-col gap-1.5 flex-grow">
            <h2 className="font-medium text-base transition-all duration-300 hover:text-[#f56551] hover:text-shadow-sm">
              {hotel.hotel_name || "Unknown Hotel"}
            </h2>
            <h2 className="text-xs text-gray-500 transition-all duration-300 group-hover:text-gray-600">
              📍 {hotel.hotel_address || "Unknown Address"}
            </h2>
            <h2 className="text-sm  transition-all duration-300 text-gray-600">
              💰 {hotel.price_per_night_usd || "N/A"}
            </h2>
            <h2 className="text-sm font-bold transition-all duration-300 text-[#f56551]">
              ⭐ {hotel.rating || "N/A"}
            </h2>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HotelCard;