import React, { useEffect, useState } from 'react';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';

const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + import.meta.env.VITE_GOOGLE_PLACE_API_KEY_NEW;

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.tripData?.location,
    };
    try {
      const result = await GetPlaceDetails(data);
      console.log(result.data.places[0].photos[3].name);
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', result.data.places[0].photos[8].name);
      setPhotoUrl(PhotoUrl);
    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  };

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className="h-[300px] flex flex-col border rounded-xl bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg group relative overflow-hidden">
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f56551]/30 rounded-xl transition-all duration-500"></div>
        <img
          src={photoUrl ? photoUrl : '/placeholder.png'}
          className="h-[220px] w-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
          alt={trip?.tripData?.location || 'Unknown Location'}
        />
        <div className="p-3 flex flex-col gap-1 flex-grow">
          <h2 className="font-bold text-lg text-[#f56551] transition-all duration-300 hover:text-shadow-sm">
            {trip?.userSelection?.location?.label || 'Unknown Location'}
          </h2>
          <h2 className="text-sm text-gray-500 transition-all duration-300 group-hover:text-gray-600">
            {trip?.tripData?.travel_duration} trip with {trip?.tripData?.budget || "N/A"} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;