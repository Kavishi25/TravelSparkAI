import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
  return (
    <div className="mt-8">
      <h2 className="font-bold text-xl transition-all duration-300 hover:text-[#f56551] hover:text-shadow-sm mt-40">Places to Visit</h2>
      <div className="mt-4">
        {trip?.tripData?.itinerary && Array.isArray(trip.tripData.itinerary) ? (
          trip.tripData.itinerary.map((item, index) => (
            <div key={`day-${index}`} className="mb-6 mt-5">
              <h2 className="font-medium text-lg text-[#f56551]">Day {item.day}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {item.plan.map((place, placeIndex) => (
                  <div key={`place-${index}-${placeIndex}`}>
                    <h2 className="font-medium text-sm text-[#f56551] mb-1">
                      🕖 {place.time_spent || 'N/A'}
                    </h2>
                    <PlaceCardItem place={place} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#f56551] mt-2">No places to visit available.</p>
        )}
      </div>
    </div>
  );
}

export default PlacesToVisit;