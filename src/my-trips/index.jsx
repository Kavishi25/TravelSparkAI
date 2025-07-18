import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import { toast } from 'sonner';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      navigate('/');
      return;
    }

    try {
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
      const querySnapshot = await getDocs(q);
      setUserTrips([]);

      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        setUserTrips((prevVal) => [...prevVal, { ...doc.data(), id: doc.id }]);
      });
    } catch (error) {
      console.error("Error fetching user trips:", error);
      toast("Failed to load trips. Please try again.");
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-8">
      <h2 className="font-bold text-xl transition-all duration-300 hover:text-[#f56551] hover:text-shadow-sm mt-20">
        My Trips
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 mb-5">
        {userTrips?.length > 0 ? (
          userTrips.map((trip, index) => (
            <UserTripCardItem trip={trip} key={index} />
          ))
        ) : (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div
              key={index}
              className="h-[300px] w-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-xl shadow-md"
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTrips;