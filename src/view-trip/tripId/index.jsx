import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { db } from '@/service/firebaseConfig';
import { Button } from '@/components/ui/button';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import { jsPDF } from 'jspdf';

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState({});

  useEffect(() => {
    if (tripId) GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tripData = docSnap.data();
        console.log("Trip Data:", JSON.stringify(tripData, null, 2));
        console.log("Hotel Options:", tripData.tripData?.hotel_options);
        console.log("Itinerary:", tripData.tripData?.itinerary);
        setTrip(tripData);
      } else {
        console.log("No Such Document");
        toast('No Trip Found');
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast('Failed to fetch trip data');
    }
  };

  const downloadTripAsPDF = () => {
    if (!trip?.userSelection || !trip?.tripData) {
      toast('No trip data available to download');
      return;
    }

    try {
      const doc = new jsPDF();
      let yOffset = 10;

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('TripCraft - Trip Plan', 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      yOffset += 20;

      // Trip Details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Trip Details', 10, yOffset);
      yOffset += 8;
      doc.setLineWidth(0.3);
      doc.line(10, yOffset, 200, yOffset);
      yOffset += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`• Destination: ${trip.userSelection?.location?.label || 'N/A'}`, 10, yOffset);
      yOffset += 8;
      doc.text(`• Duration: ${trip.userSelection?.noOfDays || 'N/A'} days`, 10, yOffset);
      yOffset += 8;
      doc.text(`• Budget: ${trip.userSelection?.budget || 'N/A'}`, 10, yOffset);
      yOffset += 8;
      doc.text(`• Travelers: ${trip.userSelection?.traveler || 'N/A'}`, 10, yOffset);
      yOffset += 15;

      // Hotel Options
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Hotel Options', 10, yOffset);
      yOffset += 8;
      doc.setLineWidth(0.3);
      doc.line(10, yOffset, 200, yOffset);
      yOffset += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      if (trip.tripData?.hotel_options && Array.isArray(trip.tripData.hotel_options)) {
        trip.tripData.hotel_options.forEach((hotel, index) => {
          doc.text(`${index + 1}. ${hotel.hotel_name || 'Unknown Hotel'}`, 10, yOffset);
          yOffset += 8;
          doc.text(`   Address: ${hotel.hotel_address || 'N/A'}`, 15, yOffset);
          yOffset += 8;
          doc.text(`   Price: ${hotel.price_per_night_usd || 'N/A'}`, 15, yOffset);
          yOffset += 8;
          doc.text(`   Rating: ${hotel.rating || 'N/A'}`, 15, yOffset);
          yOffset += 10;
          if (yOffset > 270) {
            doc.addPage();
            yOffset = 10;
          }
        });
      } else {
        doc.text('No hotel options available', 10, yOffset);
        yOffset += 8;
      }
      yOffset += 15;

      // Itinerary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Itinerary', 10, yOffset);
      yOffset += 8;
      doc.setLineWidth(0.3);
      doc.line(10, yOffset, 200, yOffset);
      yOffset += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      if (trip.tripData?.itinerary && Array.isArray(trip.tripData.itinerary)) {
        trip.tripData.itinerary.forEach((item, index) => {
          doc.setFont('helvetica', 'italic', 'bold');
          doc.text(`Day ${item.day || index + 1}`, 10, yOffset);
          yOffset += 8;
          doc.setFont('helvetica', 'normal');
          if (item.plan && Array.isArray(item.plan)) {
            item.plan.forEach((place, placeIndex) => {
              doc.text(`   ${placeIndex + 1}. ${place.place_name || 'Unknown Place'}`, 15, yOffset);
              yOffset += 8;
              doc.text(`      Time: ${place.time_spent || 'N/A'}`, 20, yOffset);
              yOffset += 8;
              doc.text(`      Description: ${place.place_details || 'N/A'}`, 20, yOffset);
              yOffset += 8;
              doc.text(`      Rating: ${place.rating || 'N/A'}`, 20, yOffset);
              yOffset += 10;
              if (yOffset > 270) {
                doc.addPage();
                yOffset = 10;
              }
            });
          } else {
            doc.text('   No activities planned', 15, yOffset);
            yOffset += 8;
          }
          yOffset += 10;
        });
      } else {
        doc.text('No itinerary available', 10, yOffset);
        yOffset += 8;
      }

      // Save the PDF
      doc.save(`TripSpark.pdf`);
      toast('Trip plan downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast('Failed to generate PDF');
    }
  };

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      
      {/* Information of Trip */}
      <InfoSection trip={trip} />
      {/* Hotels */}
      <Hotels trip={trip} />
      {/* Places */}
      <PlacesToVisit trip={trip} />
      {/* Download Button */}
      <div className='flex justify-end mb-6'>
        <Button onClick={downloadTripAsPDF} disabled={!trip?.tripData}>
          Download as PDF
        </Button>
      </div>
      {/* Footer */}
      <Footer trip={trip} />
    </div>
  );
}

export default ViewTrip;