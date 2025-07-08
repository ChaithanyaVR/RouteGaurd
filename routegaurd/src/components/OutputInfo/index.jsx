import React from 'react'

const OutputInfo = ({ error, output }) => {
    return (
      <div>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
  
        {output && (
          <div className="bg-gray-100 text-gray-600 font-semibold px-4 rounded-md text-sm mt-4">
            {output}
          </div>
        )}
      </div>
    );
  };
  
  export default OutputInfo;
  
