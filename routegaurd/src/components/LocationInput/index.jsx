import React from "react";
import { Autocomplete } from "@react-google-maps/api";

const LocationInput = ({
  label,
  inputRef,
  type,
  onUseLocation,
  onSelectOnMap,
  selected,
}) => (
  <div className="mt-14">
    <label className="block mb-2 text-sm font-medium">{label}</label>

    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <Autocomplete>
        <input
          type="text"
          ref={inputRef}
          placeholder={`Enter ${type}`}
          className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </Autocomplete>

      <button
        type="button"
        onClick={onSelectOnMap}
        className={`w-full sm:w-auto text-sm px-3 py-1.5 rounded-md transition ${
          selected
            ? "bg-purple-700 text-white"
            : "border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
        }`}
      >
        Select on Map
      </button>
    </div>
    {type === "origin" && (
      <button
        type="button"
        onClick={onUseLocation}
        className="w-full mt-2 sm:w-auto text-sm px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
      >
        Use Current Location
      </button>
    )}
  </div>
);

export default LocationInput;
