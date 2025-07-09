import React from "react";

const OutputInfo = ({ error, output, isNightMode }) => {
  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      {output && (
        <div
          className={`rounded-md p-4 border-2 text-sm font-semibold ${
            isNightMode
              ? "bg-[#1f1f1f] border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        >
          <div>
            <strong>From:</strong> {output.from}
          </div>
          <div>
            <strong>To:</strong> {output.to}
          </div>
          <div className="mt-2">
            <strong>Distance:</strong> {output.distance} &nbsp;&nbsp;
            <strong>Duration:</strong> {output.duration}
          </div>
          {output.showTollWarning && (
            <div className="text-yellow-500 mt-2">
              {output.hasTolls
                ? "⚠️ Route includes tolls."
                : "✅ Route avoids tolls."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OutputInfo;

  
