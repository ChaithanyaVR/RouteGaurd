import React from "react";
import DOMPurify from "dompurify";

const OutputInfo = ({ error, output }) => {
  const sanitizedOutput = DOMPurify.sanitize(output || "");

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      {output && (
        <div
          className="mb-3"
          dangerouslySetInnerHTML={{ __html: sanitizedOutput }}
        />
      )}
    </>
  );
};

export default OutputInfo;