import React from "react";
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { nightTheme, dayTheme } from "../maps/mapThemes";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const MapDisplay = ({
  center,
  onClick,
  directionsResponse,
  isNightMode,
  originCoords,
  destinationCoords,
}) => (
  <GoogleMap
    mapContainerStyle={containerStyle}
    zoom={10}
    center={center}
    onClick={onClick}
    options={{
      styles: isNightMode ? nightTheme : dayTheme,
      disableDefaultUI: true,
      zoomControl: true,
    }}
  >
    {originCoords && <Marker position={originCoords} label="A" />}
    {destinationCoords && <Marker position={destinationCoords} label="B" />}
    {directionsResponse && (
      <DirectionsRenderer directions={directionsResponse} />
    )}
  </GoogleMap>
);

export default MapDisplay;
