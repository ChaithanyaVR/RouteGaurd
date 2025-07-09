import React, { useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import LocationInput from "../LocationInput";
import OutputInfo from "../OutputInfo";
import MapDisplay from "../MapDisplay";
import Loader from "../Loader";
import LightModeImg from "../../assets/light-mode.png";
import NightModeImg from "../../assets/night-mode.png";

const center = { lat: 12.9629, lng: 77.5775 };

const criteriaConfig = {
  shortest: {
    label: "🚗 Shortest Distance",
    score: (route) => route.legs[0].distance.value,
  },
  fastest: {
    label: "🕒 Fastest Travel Time",
    score: (route) => route.legs[0].duration.value,
  },
  noTolls: {
    label: "💰 Avoid Tolls",
    score: (route) =>
      route.warnings?.some((w) => w.toLowerCase().includes("toll"))
        ? 1_000_000
        : 0,
  },
  avoidHighways: {
    label: "🛣️ Avoid Highways",
    score: (route) =>
      route.summary.toLowerCase().includes("highway") ? 500_000 : 0,
  },
};

const MapRoute = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [criteria, setCriteria] = useState(
    Object.fromEntries(Object.keys(criteriaConfig).map((key) => [key, false]))
  );
  const [isNightMode, setIsNightMode] = useState(false);

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries: ["places"],
  });

  if (!isLoaded) return <Loader />;

  const scoreRoute = (route) => {
    return Object.entries(criteria)
      .filter(([, isSelected]) => isSelected)
      .reduce((total, [key]) => {
        const scorer = criteriaConfig[key]?.score;
        return scorer ? total + scorer(route) : total;
      }, 0);
  };

  const chooseOptimalRoute = (routes) => {
    return [...routes].sort((a, b) => scoreRoute(a) - scoreRoute(b))[0];
  };

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
        provideRouteAlternatives: true,
        avoidTolls: criteria.noTolls,
      },
      (result, status) => {
        if (status === "OK" && result.routes.length > 0) {
          console.log("All routes from API:", result.routes);
          console.log("Selected criteria:", criteria);

          const bestRoute = chooseOptimalRoute(result.routes);
          console.log("Best route chosen:", bestRoute);

          if (!bestRoute) {
            setError("No routes match the selected criteria.");
            setDirectionsResponse(null);
            setOutput(null);
            return;
          }

          const hasTolls = bestRoute.warnings?.some((w) =>
            w.toLowerCase().includes("toll")
          );

          const modifiedResult = { ...result, routes: [bestRoute] };
          setDirectionsResponse(modifiedResult);

          const leg = bestRoute.legs[0];
          console.log("From:", leg.start_address);
          console.log("To:", leg.end_address);
          console.log("Distance:", leg.distance.text);
          console.log("Duration:", leg.duration.text);
          console.log("Warnings:", bestRoute.warnings);
          setOutput({
            from: leg.start_address,
            to: leg.end_address,
            distance: leg.distance.text,
            duration: leg.duration.text,
            hasTolls,
            showTollWarning: criteria.noTolls,
          });          
          setError("");
        } else {
          setDirectionsResponse(null);
          setOutput(null);
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
      originRef.current.value = `Clicked (${clicked.lat.toFixed(
        4
      )}, ${clicked.lng.toFixed(4)})`;
    } else if (selectedPoint === "destination") {
      setDestinationCoords(clicked);
      destinationRef.current.value = `Clicked (${clicked.lat.toFixed(
        4
      )}, ${clicked.lng.toFixed(4)})`;
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row gap-6 p-4 min-h-screen transition-colors duration-300 ${
        isNightMode ? "bg-[#121212] text-gray-200" : "bg-white text-gray-900"
      }`}
    >
      <div className="w-full md:w-2/3 p-4">
        <h3
          className={`mb-4 text-xl font-bold ${
            isNightMode ? "text-white" : "text-gray-600"
          }`}
        >
          Distance Between Two Places
        </h3>

        <button
          className={`py-1 px-3 rounded-full mb-4 transition ${
            isNightMode
              ? "bg-gray-300 hover:bg-gray-400"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setIsNightMode((prev) => !prev)}
        >
          <img
            src={isNightMode ? LightModeImg : NightModeImg}
            alt={isNightMode ? "Switch to Day Mode" : "Switch to Night Mode"}
            className="w-8 h-8"
          />
        </button>

        <MapDisplay
          center={center}
          onClick={handleMapClick}
          directionsResponse={directionsResponse}
          isNightMode={isNightMode}
          originCoords={originCoords}
          destinationCoords={destinationCoords}
        />
      </div>

      <div className="hidden md:block w-1 h-140 bg-gray-300 mx-4 self-center"></div>

      <div className="w-full md:w-1/3 space-y-5 p-4">
        <LocationInput
          label="Origin (Point A)"
          type="origin"
          inputRef={originRef}
          onUseLocation={handleUseCurrentLocation}
          onSelectOnMap={() => setSelectedPoint("origin")}
          selected={selectedPoint === "origin"}
          isNightMode={isNightMode}
        />
        <LocationInput
          label="Destination (Point B)"
          type="destination"
          inputRef={destinationRef}
          onSelectOnMap={() => setSelectedPoint("destination")}
          selected={selectedPoint === "destination"}
          isNightMode={isNightMode}
        />

        <div className="pt-5 space-y-2">
          <label className="block text-md font-medium text-gray-400">
            Choose Optimization Criteria
          </label>
          <div className="flex flex-col gap-2">
            {Object.entries(criteriaConfig).map(([key, { label }]) => (
              <label key={key} className="text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={criteria[key]}
                  onChange={(e) =>
                    setCriteria((prev) => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <button
          className={`w-full py-2 rounded-md transition ${
            isNightMode
              ? "bg-green-700 hover:bg-green-600 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          onClick={handleCalculateRoute}
        >
          Get Route
        </button>

        <OutputInfo error={error} output={output} isNightMode={isNightMode} />

      </div>
    </div>
  );
};

export default MapRoute;
