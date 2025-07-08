import React from "react";

const OutputInfo = ({ error, output }) => (
  <>
    {error && <div className="alert alert-danger">{error}</div>}
    {output && (
      <div
        className="mb-3"
        dangerouslySetInnerHTML={{ __html: output }}
      />
    )}
  </>
);

export default OutputInfo;