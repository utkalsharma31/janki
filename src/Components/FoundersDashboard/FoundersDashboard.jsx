import React from "react";


const FoundersDashboard = () => {
  const totalOrders = 1234;
  const totalAmount = 98765;
  const aov = totalAmount / totalOrders;


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Founder's Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="flex flex-col">
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
          </div>
          <h2 className="text-center mt-2 text-xl font-semibold text-gray-700 mb-2">
            Total Orders
          </h2>
        </div>

        <div className="flex flex-col">
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {totalAmount.toFixed(2)}
            </p>
          </div>
          <h2 className="text-center mt-2 text-xl font-semibold text-gray-700 mb-2">
            Total Amount
          </h2>
        </div>

        <div className="flex flex-col">
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">{aov.toFixed(2)}</p>
          </div>
          <h2 className="text-center mt-2 text-xl font-semibold text-gray-700 mb-2">
            AOV
          </h2>
        </div>
      </div>
    </div>
  );
};

export default FoundersDashboard;
