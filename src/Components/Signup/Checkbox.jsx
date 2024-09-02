import React from "react";

const Checkbox = ({ label, checked, onChange }) => {
  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="form-checkbox h-5 w-5 text-blue-500"
      />
      <label className="ml-2">{label}</label>
    </div>
  );
};

export default Checkbox;
