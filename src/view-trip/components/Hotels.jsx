// hotels
import React from 'react';
import { Link } from 'react-router-dom';
import HotelCard from './HotelCard';

function Hotels({ trip }) {
  return (
    <div className="mt-6">
      <h2 className="font-bold text-xl transition-all duration-300 hover:text-[#f56551] hover:text-shadow-sm">
        Hotel Recommendation
      </h2>
      {trip?.tripData?.hotel_options && Array.isArray(trip.tripData.hotel_options) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-20 mt-6">
          {trip.tripData.hotel_options.map((hotel, index) => (
            <HotelCard key={index} hotel={hotel} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No hotel recommendations available.</p>
      )}
    </div>
  );
}

export default Hotels;
