import React from "react";
import { Autocomplete } from "@react-google-maps/api";

const LocationInput = ({ label, inputRef, type }) => (
  <div className="mb-3">
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <Autocomplete>
      <input
        type="text"
        className="form-control w-full rounded-md border border-gray-300 px-3 py-2"
        placeholder={`Enter ${type}`}
        ref={inputRef}
      />
    </Autocomplete>
  </div>
);

export default LocationInput;
