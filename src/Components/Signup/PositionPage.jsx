import React, { useState } from 'react';
import Checkbox from './Checkbox'; 

const PositionPage = () => {
  const [positions, setPositions] = useState({
    fullTime: false,
    partTime: false,
    internship: false,
    freelance: false,
    contractual: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    //console.log(name, checked);
    setPositions({ ...positions, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the submission of positions data
    console.log('Positions Applied:', positions);
  };

  return (
    <div className="max-w-md mx-auto mt-8 shadow-lg p-8 rounded">
      <h2 className="text-2xl font-bold mb-4">Position you are applying for:</h2>
      <form onSubmit={handleSubmit}>
        <Checkbox
          label="Full-time"
          name="fullTime"
          checked={positions.fullTime}
          onChange={handleCheckboxChange}
        />
        <Checkbox
          label="Part-time"
          name="partTime"
          checked={positions.partTime}
          onChange={handleCheckboxChange}
        />
        <Checkbox
          label="Internship"
          name="internship"
          checked={positions.internship}
          onChange={handleCheckboxChange}
        />
        <Checkbox
          label="Freelance"
          name="freelance"
          checked={positions.freelance}
          onChange={handleCheckboxChange}
        />
        <Checkbox
          label="Contractual"
          name="contractual"
          checked={positions.contractual}
          onChange={handleCheckboxChange}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PositionPage;
