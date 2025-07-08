import React, { useRef, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import LocationInput from "../LocationInput";
import OutputInfo from "../OutputInfo";
import MapDisplay from "../MapDisplay";

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

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

          setOutput(
            <div className="alert alert-info border-2 border-grey rounded-md p-2">
              <div>
                <strong>From:</strong> {leg.start_address}
              </div>
              <div>
                <strong>To:</strong> {leg.end_address}
              </div>
              <div>
                <strong>Distance:</strong> {leg.distance.text} &nbsp;&nbsp;
                <strong>Duration:</strong> {leg.duration.text}
              </div>
              {criteria.noTolls && (
                <div className="text-yellow-500 mt-2">
                  {hasTolls
                    ? "⚠️ Route includes tolls."
                    : "✅ Route avoids tolls."}
                </div>
              )}
            </div>
          );

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
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
      <div className="flex flex-col md:flex-row gap-6 p-4">
        <div className="w-full md:w-3/4">
          <h3 className="mb-4 text-xl font-bold text-gray-600">
            Distance Between Two Places
          </h3>
          <div className="rounded-xl overflow-hidden shadow-md bg-[#686868] p-6">
            <MapDisplay
              center={center}
              onClick={handleMapClick}
              directionsResponse={directionsResponse}
            />
          </div>
        </div>

        <div className="w-full md:w-1/4 space-y-10">
          <LocationInput
            label="Origin (Point A)"
            type="origin"
            inputRef={originRef}
            onUseLocation={handleUseCurrentLocation}
            onSelectOnMap={() => setSelectedPoint("origin")}
            selected={selectedPoint === "origin"}
          />
          <LocationInput
            label="Destination (Point B)"
            type="destination"
            inputRef={destinationRef}
            onSelectOnMap={() => setSelectedPoint("destination")}
            selected={selectedPoint === "destination"}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Optimization Criteria
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
