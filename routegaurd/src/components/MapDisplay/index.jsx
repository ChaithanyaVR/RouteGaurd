import React from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const MapDisplay = ({ center, onClick, directionsResponse }) => (
  <GoogleMap
    mapContainerStyle={containerStyle}
    center={center}
    zoom={7}
    onClick={onClick}
  >
    {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
  </GoogleMap>
);

export default MapDisplay;
