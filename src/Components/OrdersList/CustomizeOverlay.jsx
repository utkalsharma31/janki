import React, { useEffect } from 'react';
import './overlay.css';
import { Checkbox } from '@mui/material';

const CustomizeOverlay = ({ closeModal, columnsVisibility, setColumnsVisibility }) => {
  const handleToggle = (column) => {
    setColumnsVisibility((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalContent = document.querySelector('.modal-content');

      if (modalContent && !event.target.closest('.modal-content')) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  return (
    <div className="modal-overlay">
      <div className="modal-content relative rounded-xl bg-white lg:w-[50%] w-[85%] flex flex-col">
        <div className="flex w-[100%] justify-between items-center">
          <p className="text-2xl p-4 pl-8 font-bold text-primary">Customize</p>
        </div>
        <div className="flex w-[100%] justify-between flex-wrap px-8 py-4">
          {Object.keys(columnsVisibility).map((column) => (
            <div key={column} className="flex justify-between items-center w-[48%] px-4 box py-1 my-2">
              <p className="text-primary capitalize">{column.replace('_', ' ')}</p>
              <Checkbox
                checked={columnsVisibility[column]}
                onChange={() => handleToggle(column)}
                className=""
                color="default"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomizeOverlay;
