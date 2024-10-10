/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

// Helper function to calculate distance using Haversine formula
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in meters
  return distance;
}

// Google AdSense Component
const GoogleAd = ({ adSlot }) => {
  useEffect(() => {
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, [adSlot]);

  return (
    <ins
      key={adSlot} // Ensure each ad instance is unique
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-5496878064132060" // Your AdSense Publisher ID
      data-ad-slot={adSlot} // Ad slot ID
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

function App() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [adSlot, setAdSlot] = useState(null);

  // Geofence settings
  const geofenceAreas = [
    {
      center: { lat: 30.687232, lng: 76.7524864 }, // Area 1
      radius: 5000, // 5 km radius
      adSlot: "7003967678", // Ad slot for Area 1
    },
    {
      center: { lat: 30.707232, lng: 76.7624864 }, // Area 2
      radius: 3000, // 3 km radius
      adSlot: "8540474268", // Ad slot for Area 2
    },
  ];

  useEffect(() => {
    // Get user location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        console.log(`User location: ${latitude}, ${longitude}`);
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
  }, []);

  // Check if the user is within any geofenced area
  const checkGeofence = () => {
    for (const area of geofenceAreas) {
      const distance = getDistanceFromLatLonInMeters(
        location.lat,
        location.lng,
        area.center.lat,
        area.center.lng
      );
      if (distance <= area.radius) {
        setAdSlot(area.adSlot);
        return true; // User is within a geofenced area
      }
    }
    setAdSlot(null); // User is outside all geofenced areas
    return false;
  };

  useEffect(() => {
    if (location.lat && location.lng) {
      checkGeofence();
    }
  }, [location]);

  return (
    <div>
      <h1>{`User's Location and Geofence Check`}</h1>
      {location.lat && location.lng ? (
        <div>
          <p>
            Latitude: {location.lat}, Longitude: {location.lng}
          </p>
          {adSlot ? (
            <div>
              <strong>You are inside a geofenced area!</strong>
              <GoogleAd adSlot={adSlot} />
            </div>
          ) : (
            <div>
              <strong>You are outside the geofenced area!</strong>
              <GoogleAd adSlot="defaultAdSlotID" />
            </div>
          )}
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}

export default App;
