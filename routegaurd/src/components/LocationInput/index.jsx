import React from "react";
import { Autocomplete } from "@react-google-maps/api";

const LocationInput = ({
  label,
  inputRef,
  type,
  onUseLocation,
  onSelectOnMap,
  selected,
  isNightMode,
}) => (
  <div className="md:mt-10">
     <label
      className={`block mb-2 text-lg md:text-sm font-medium ${
        isNightMode ? "text-white" : "text-gray-700"
      }`}
    >{label}</label>

    <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 md:gap-6">
      <Autocomplete>
        <input
          type="text"
          ref={inputRef}
          placeholder={`Enter ${type}`}
          className={`w-full text-lg md:text-sm px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 ${
            isNightMode
              ? "bg-[#2a2a2a] text-white border border-gray-600 focus:ring-purple-500"
              : "bg-white text-black border border-gray-300 focus:ring-blue-500"
          }`}
        />
      </Autocomplete>

      <button
        type="button"
        onClick={onSelectOnMap}
        className={`w-full sm:w-auto text-lg md:text-sm px-3 py-1.5 rounded-full transition ${
          selected
            ? "bg-purple-700 text-white"
            : isNightMode
            ? "border border-purple-400 text-purple-300 hover:bg-purple-600 hover:text-white"
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
        className={`w-full mt-5 sm:w-auto text-lg md:text-sm px-4 py-2 rounded-full transition ${
          isNightMode
            ? "bg-blue-700 hover:bg-blue-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        Use Current Location
      </button>
    )}
  </div>
);

export default LocationInput;
