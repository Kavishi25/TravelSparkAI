// src/service/AIModel.jsx
import { GoogleGenAI } from '@google/genai';

// Set up the Gemini API key from Vite environment variables
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
});

const tools = [
  {
    googleSearch: {},
  },
];

const config = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  tools,
  responseMimeType: 'text/plain',
};

const model = 'gemini-2.5-flash';

// The base system prompt and example conversation
const baseContents = [
  {
    role: 'user',
    parts: [
      {
        text: `Generate Travel Plan for Location : Las Vegas, for 3 Days for Couple with a Cheap budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.`,
      },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: `**Constructing a Budget Itinerary** ...`, // (You can keep or trim this for brevity)
      },
      {
        text: `Here is a 3-day travel plan for a couple in Las Vegas on a cheap budget, presented in JSON format. ...`, // (You can keep or trim this for brevity)
      },
    ],
  },
];

// The function to generate a trip plan
export async function generateTripPlan(prompt) {
  // Clone the base contents and set the last user prompt
  const contents = JSON.parse(JSON.stringify(baseContents));
  contents.push({
    role: 'user',
    parts: [
      {
        text: `${prompt} Return ONLY a valid JSON object with no additional text or explanations, using the following structure: 
        {
          "location": "string",
          "budget": "string",
          "travel_duration": "string",
          "traveler_type": "string",
          "best_time_to_visit": "string",
          "hotel_options": [
            {
              "hotel_name": "string",
              "hotel_address": "string",
              "price_per_night_usd": "string",
              "hotel_image_url": "string",
              "geo_coordinates": { "latitude": "number", "longitude": "number" },
              "rating": "string",
              "description": "string"
            }
          ],
          "itinerary": [
            {
              "day": "number",
              "plan": [
                {
                  "place_name": "string",
                  "place_details": "string",
                  "best_time_to_visit": "string",
                  "time_spent": "string",
                  "rating": "string",
                  "ticket_pricing_usd": "string",
                  "place_image_url": "string",
                  "geo_coordinates": { "latitude": "number", "longitude": "number" }
                }
              ]
            }
          ]
        }`,
      },
    ],
  });

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let result = '';
    for await (const chunk of response) {
      result += chunk.text;
    }

    // Try to extract JSON from the result
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    let aiData;
    if (jsonMatch) {
      try {
        aiData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid JSON response from AI');
      }
    } else {
      console.error('No valid JSON found in response:', result);
      throw new Error('No valid JSON found in AI response');
    }

    // Standardize the tripData structure
    const tripData = {
      location: aiData.location || 'Unknown',
      budget: aiData.budget || 'Unknown',
      travel_duration: aiData.travel_duration || 'Unknown',
      traveler_type: aiData.traveler_type || 'Unknown',
      best_time_to_visit: aiData.best_time_to_visit || 'Anytime',
      hotel_options: Array.isArray(aiData.hotel_options)
        ? aiData.hotel_options.map(hotel => ({
            hotel_name: hotel.hotel_name || 'Unknown Hotel',
            hotel_address: hotel.hotel_address || 'Unknown Address',
            price_per_night_usd: hotel.price_per_night_usd || 'N/A',
            hotel_image_url: hotel.hotel_image_url || '/placeholder.jpg',
            geo_coordinates: hotel.geo_coordinates || { latitude: 0, longitude: 0 },
            rating: hotel.rating || 'N/A',
            description: hotel.description || 'No description available'
          }))
        : [],
      itinerary: Array.isArray(aiData.itinerary)
        ? aiData.itinerary.map(day => ({
            day: day.day || 0,
            plan: Array.isArray(day.plan)
              ? day.plan.map(place => ({
                  place_name: place.place_name || 'Unknown Place',
                  place_details: place.place_details || 'No details available',
                  best_time_to_visit: place.best_time_to_visit || 'Anytime',
                  time_spent: place.time_spent || 'N/A',
                  rating: place.rating || 'N/A',
                  ticket_pricing_usd: place.ticket_pricing_usd || 'Free',
                  place_image_url: place.place_image_url || '/placeholder.jpg',
                  geo_coordinates: place.geo_coordinates || { latitude: 0, longitude: 0 }
                }))
              : []
          }))
        : []
    };

    return tripData;
  } catch (error) {
    console.error('Failed to generate or parse response:', error);
    throw error;
  }
}