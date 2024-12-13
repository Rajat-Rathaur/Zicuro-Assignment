import React from "react";

const SaveButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 10px",
        cursor: "pointer",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
      }}
    >
      Save
    </button>
  );
};

export default SaveButton;
