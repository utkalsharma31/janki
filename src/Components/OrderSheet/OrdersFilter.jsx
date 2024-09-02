import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    order_id: "",
    risk: "",
    payment_gateway_method: "",
    order_created_at_after: "",
    order_created_at_before: "",
    total_price_min: "",
    total_price_max: "",
    discount_code: "",
    shipment_status: "",
    full_name: "",
    contact_number: "",
    // address: "",
  });

  const [orders, setOrders] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const generateQueryString = (filters) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    return params.toString();
  };

  const handleFilterChange = () => {
    const queryString = generateQueryString(filters);
    onFilterChange(filters);
    fetchOrders(queryString);
  };

  const fetchOrders = async (queryString) => {
    try {
      const response = await fetch(`${backendUrl}/api/orders/?${queryString}`, {
        headers: {
          "content-type": "application/json",
        },
      });

      console.log("Response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setOrders(data);
    } catch (error) {
      console.error("Error feetching orders:", error);
    }
  };

  return (
    <div>
      <div className="flex">
        <input
          type="text"
          name="search"
          placeholder="Search Order ID, Name, or Contact Number"
          className="w-full border px-4 py-2 mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleFilterChange}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>

      <div className="pt-2 py-6 border-b">
        <input
          type="text"
          name="order_id"
          value={filters.order_id}
          onChange={handleChange}
          placeholder="Order ID"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="risk"
          value={filters.risk}
          onChange={handleChange}
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Risk</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="text"
          name="payment_gateway_method"
          value={filters.payment_gateway_method}
          onChange={handleChange}
          placeholder="Payment Method"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          name="order_created_at_after"
          value={filters.order_created_at_after}
          onChange={handleChange}
          placeholder="Order Created At (After)"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          name="order_created_at_before"
          value={filters.order_created_at_before}
          onChange={handleChange}
          placeholder="Order Created At (Before)"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="total_price_min"
          value={filters.total_price_min}
          onChange={handleChange}
          placeholder="Min Total Price"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="total_price_max"
          value={filters.total_price_max}
          onChange={handleChange}
          placeholder="Max Total Price"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="discount_code"
          value={filters.discount_code}
          onChange={handleChange}
          placeholder="Discount Code"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="shipment_status"
          value={filters.shipment_status}
          onChange={handleChange}
          placeholder="Shipment Status"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="full_name"
          value={filters.full_name}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="contact_number"
          value={filters.contact_number}
          onChange={handleChange}
          placeholder="Contact Number"
          className="p-2 border mr-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleFilterChange}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
