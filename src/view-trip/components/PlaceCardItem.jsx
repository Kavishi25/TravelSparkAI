import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    place && GetPlacePhoto();
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: place.place_name
    };
    const result = await GetPlaceDetails(data).then(resp => {
      console.log(resp.data.places[0].photos[3].name);
      const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[3].name);
      setPhotoUrl(PhotoUrl);
    });
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return 'No details available';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.place_name)}`}
      target="_blank"
    >
      <div className="border rounded-xl p-3 flex gap-5 bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg group relative overflow-hidden h-[240px]">
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f56551]/30 rounded-xl transition-all duration-500"></div>
        <img
          src={photoUrl ? photoUrl : '/placeholder.png'}
          className="h-[160px] w-[160px] rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
          alt={place.place_name || 'Unknown Place'}
        />
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg">
              {place.place_name || 'Unknown Place'}
            </h2>
            <p className="text-sm text-gray-400">{truncateText(place.place_details, 30)}</p>
            <h2 className="font-bold text-sm text-[#f56551]">
              ⭐{place.rating ? `${place.rating}` : "N/A"}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;