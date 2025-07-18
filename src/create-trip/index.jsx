// src/create-trip/index.jsx
import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateTripPlan } from "@/service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/service/firebaseConfig"; // Import Firestore and Auth
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => GetUserProfile(tokenInfo),
    onError: (error) => {
      console.log("Login Error:", error);
      toast("Google login failed");
    },
    scope: "email profile",
    prompt: "consent",
    flow: "implicit",
    redirect_uri: "http://localhost:5173",
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      (formData?.noOfDays > 5 && !formData?.location) ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill all the fields correctly");
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label || "Unknown"
    )
      .replace("{totalDays}", formData?.noOfDays || "1")
      .replace("{traveler}", formData?.traveler || "Unknown")
      .replace("{budget}", formData?.budget || "Unknown")
      .replace("{totalDays}", formData?.noOfDays || "1");

    console.log("Final Prompt:", FINAL_PROMPT);

    try {
      const result = await generateTripPlan(FINAL_PROMPT);
      if (result) {
        console.log("Generated Trip Plan:", result);
        await SaveAiTrip(result); // Save trip to Firestore
      } else {
        toast("Failed to parse the trip plan response");
      }
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("Failed to generate trip plan");
    } finally {
      setLoading(false);
    }
  };

const SaveAiTrip = async (tripData) => {
  setLoading(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const docId = Date.now().toString();
  const tripDoc = {
    userSelection: formData,
    tripData: tripData,
    userEmail: user?.email,
    id: docId,
  };
  console.log("Saving Trip Data:", JSON.stringify(tripDoc, null, 2)); // Pretty-print the data
  await setDoc(doc(db, "AITrips", docId), tripDoc);
  toast("Trip saved successfully!");
  setLoading(false);
  navigate('/view-trip/' + docId);
};

  const GetUserProfile = async (tokenInfo) => {
    try {
      // Sign in to Firebase with Google access token
      const credential = GoogleAuthProvider.credential(
        null,
        tokenInfo.access_token
      );
      await signInWithCredential(auth, credential);

      // Fetch user profile from Google
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenInfo.access_token}`
      );
      console.log("User Profile:", response.data); // Display user details in console
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
      OnGenerateTrip(); // Generate trip after successful login
    } catch (error) {
      console.error("Error fetching user profile or signing in:", error);
      toast(`Failed to fetch user profile or sign in: ${error.message}`);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl mt-20">Tell Us About Your Trip ⛺🏝️</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just a few details and we’ll start shaping your perfect travel
        experience. The more you share, the better we plan!
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder="Ex: 3"
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2
                ${formData?.budget === item.title && "shadow-lg border-black"}`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">
          Who do you plan on traveling with?
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveler", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2
                ${
                  formData?.traveler === item.people && "shadow-lg border-black"
                }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 flex justify-end">
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate Trip"
          )}
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" className="h-7 w-auto" />
              <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
              <p>Sign in to the app with Google Authentication securely</p>
              <Button
                onClick={() => login()}
                className="mt-5 w-full flex gap-4 items-center"
              >
                <FcGoogle className="h-8 w-8" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
