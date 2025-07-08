import React, { useRef, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import LocationInput from "../LocationInput";
import OutputInfo from "../OutputInfo";
import MapDisplay from "../MapDisplay";


const center = { lat: 12.9629, lng: 77.5775 };

const MapRoute = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleCalculateRoute = () => {
    const origin = originCoords || originRef.current.value;
    const destination = destinationCoords || destinationRef.current.value;

    if (!origin || !destination) {
      setError("Please enter both origin and destination.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (result, status) => {
        if (status === "OK") {
          setDirectionsResponse(result);
          const leg = result.routes[0].legs[0];
          setOutput(`
            <div class="alert alert-info">
              <strong>From:</strong> ${leg.start_address}<br/>
              <strong>To:</strong> ${leg.end_address}<br/>
              <strong>Distance:</strong> ${leg.distance.text}<br/>
              <strong>Duration:</strong> ${leg.duration.text}
            </div>
          `);
          setError("");
        } else {
          setDirectionsResponse(null);
          setOutput("");
          setError("Could not calculate route. Try again.");
        }
      }
    );
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setOriginCoords(coords);
        originRef.current.value = "Current Location";
        setError("");
      },
      () => setError("Permission denied or location error.")
    );
  };

  const handleMapClick = (e) => {
    const clicked = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (selectedPoint === "origin") {
      setOriginCoords(clicked);
      originRef.current.value = `Clicked Location (${clicked.lat.toFixed(4)}, ${clicked.lng.toFixed(4)})`;
    } else if (selectedPoint === "destination") {
      setDestinationCoords(clicked);
      destinationRef.current.value = `Clicked Location (${clicked.lat.toFixed(4)}, ${clicked.lng.toFixed(4)})`;
    }
  };

  return (
  <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
  <div className="flex flex-col md:flex-row gap-6 p-4">
    {/* Map Section (left, wider) */}
    <div className="w-full md:w-3/4 ">
      <h3 className="mb-4 text-xl font-semibold">Distance Between Two Places</h3>
      <div className="rounded-xl overflow-hidden shadow-md bg-[#686868] p-6">
        <MapDisplay
          center={center}
          onClick={handleMapClick}
          directionsResponse={directionsResponse}
        />
      </div>
    </div>

    {/* Input Section (right, narrower) */}
    <div className="w-full md:w-1/4 space-y-4">
      <LocationInput
        label="Origin"
        type="origin"
        inputRef={originRef}
        onUseLocation={handleUseCurrentLocation}
        onSelectOnMap={() => setSelectedPoint("origin")}
        selected={selectedPoint === "origin"}
      />

      <LocationInput
        label="Destination"
        type="destination"
        inputRef={destinationRef}
        onSelectOnMap={() => setSelectedPoint("destination")}
        selected={selectedPoint === "destination"}
      />

      <button
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        onClick={handleCalculateRoute}
      >
        Calculate Distance
      </button>

      <OutputInfo error={error} output={output} />
    </div>
  </div>
</LoadScript>

  );
};

export default MapRoute;
