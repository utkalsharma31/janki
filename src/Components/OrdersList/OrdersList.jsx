import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { styled } from "@mui/system";
import usePagination from "../Pagination/Pagination";
import CustomizeOverlay from "./CustomizeOverlay";

const OrdersList = () => {
  const [customize, setCustomize] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(50); // Assuming 50 entries per page

  const CustomPagination = styled(Pagination)(({ theme }) => ({
    "& .MuiPagination-ul": {
      justifyContent: "center", // Center align the pagination items
    },
    "& .MuiPaginationItem-root": {
      margin: theme.spacing(0.5),
      borderRadius: "0",
    },
  }));

  const getRiskColor = (complexity) => {
    switch (complexity) {
      case "N/A":
        return "var(--green-100, #DEF7EC)";
      case "Low Risk":
        return "var(--green-100, #DEF7EC)"; // Light green for low complexity
      case "Medium Risk":
        return "var(--yellow-100, #FFFAA0)"; // Yellow for medium complexity
      case "High Risk":
        return "var(--red-100, #FDE8E8)"; // Light red for high complexity
    }
  };

  const getTextColor = (complexity) => {
    switch (complexity) {
      case "N/A":
        return "#018B00";
      case "Low Risk":
        return "#018B00"; // Light green for low complexity
      case "Medium Risk":
        return "var(--yellow-800,#DAA520)"; // Yellow for medium complexity
      case "High Risk":
        return "var(--red-800, #9B1C1C)"; // Light red for high complexity
    }
  };

  const [columnsVisibility, setColumnsVisibility] = useState({
    id: true,
    customer_id: true,
    phone_number: true,
    fulfillment_status: true,
    financial_status: true,
    payment_gateway_method: true,
    discount_code: true,
    discount_amount: true,
    total_price: true,
    shipment_status: true,
    risk: true,
  });

  const fetchData = async (page) => {
    try {
      const response = await fetch(
        `http://192.168.1.34:8000/apicalls/customers_info/?page=${page}`
      );
      const responseJ = await response.json();
      setOrders(responseJ.results); // Assuming the response contains a 'results' array
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  console.log(orders);

  const closeModal = () => {
    setCustomize(false);
  };

  const totalData = orders?.length;
  const count = Math.ceil(totalData / postPerPage);

  const handleChange = (value) => {
    setCurrentPage(value);
  };

  return (
    <div className="w-full px-[5%]">
      <p className="text-2xl font-semibold py-4 border-b">Orders List</p>
      <button
        onClick={() => setCustomize(true)}
        className="py-2 px-4 rounded-3xl text-xl font-semibold border-2 border-[#2e2e2e] hover:text-white hover:bg-[#2e2e2e] mt-4"
      >
        Customize table
      </button>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse rounded-md mt-6">
          <thead>
            <tr className="bg-gray-400">
              {columnsVisibility.id && (
                <th className="p-3 text-left font-semibold">ID</th>
              )}
              {columnsVisibility.customer_id && (
                <th className="p-3 text-left font-semibold">Customer ID</th>
              )}
              {columnsVisibility.phone_number && (
                <th className="p-3 text-left font-semibold">Phone Number</th>
              )}
              {columnsVisibility.phone_number && (
                <th className="p-3 text-left font-semibold">Items</th>
              )}

              {columnsVisibility.fulfillment_status && (
                <th className="p-3 text-left font-semibold">
                  Fulfillment Status
                </th>
              )}
              {columnsVisibility.financial_status && (
                <th className="p-3 text-left font-semibold">
                  Financial Status
                </th>
              )}
              {columnsVisibility.payment_gateway_method && (
                <th className="p-3 text-left font-semibold">Payment Method</th>
              )}
              {columnsVisibility.discount_code && (
                <th className="p-3 text-left font-semibold">Discount Code</th>
              )}
              {columnsVisibility.discount_amount && (
                <th className="p-3 text-left font-semibold">Discount Amount</th>
              )}
              {columnsVisibility.total_price && (
                <th className="p-3 text-left font-semibold">Total Price</th>
              )}
              {columnsVisibility.shipment_status && (
                <th className="p-3 text-left font-semibold">Shipment Status</th>
              )}
              {columnsVisibility.risk && (
                <th className="p-3 text-left font-semibold">Risk</th>
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              // const numberOfOrders = order.line_item_set.length();

              <>
                {order.orders_set.map((item, i) => (
                  <tr
                    key={order.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                  >
                    {columnsVisibility.id && (
                      <td className="p-3 border-t">{item.order_id}</td>
                    )}
                    {columnsVisibility.customer_id && (
                      <td className="p-3 border-t">{order.customer_id}</td>
                    )}
                    {columnsVisibility.phone_number && (
                      <td className="p-3 border-t">{order.phone_number}</td>
                    )}
                    {columnsVisibility.phone_number && (
                      <td className="p-3 border-t">
                        {order.orders_set.length}
                      </td>
                    )}
                    {columnsVisibility.fulfillment_status && (
                      <td className="p-3 border-t">
                        {item.fulfillment_status}
                      </td>
                    )}
                    {columnsVisibility.financial_status && (
                      <td className="p-3 border-t">{item.financial_status}</td>
                    )}
                    {columnsVisibility.payment_gateway_method && (
                      <td className="p-3 border-t">
                        {item.payment_gateway_method}
                      </td>
                    )}
                    {columnsVisibility.discount_code && (
                      <td className="p-3 border-t">{item.discount_code}</td>
                    )}
                    {columnsVisibility.discount_amount && (
                      <td className="p-3 border-t">{item.discount_amount}</td>
                    )}
                    {columnsVisibility.total_price && (
                      <td className="p-3 border-t">{item.total_price}</td>
                    )}
                    {columnsVisibility.shipment_status && (
                      <td className="p-3 border-t">{item.shipment_status}</td>
                    )}
                    {columnsVisibility.risk && (
                      <td
                        className="p-3 border-t"
                        style={{
                          background: getRiskColor(order.risk),
                          color: getTextColor(order.risk),
                        }}
                      >
                        {order.risk === "N/A"
                          ? "Low"
                          : order.risk === "High Risk"
                          ? "High"
                          : order.risk === "Medium Risk"
                          ? "Medium"
                          : order.risk === "Low Risk"
                          ? "Low"
                          : "-"}
                      </td>
                    )}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-6">
        <CustomPagination
          count={count}
          variant="outlined"
          page={currentPage}
          onChange={handleChange}
          color="primary"
        />
      </div>
      {customize && (
        <CustomizeOverlay
          closeModal={closeModal}
          columnsVisibility={columnsVisibility}
          setColumnsVisibility={setColumnsVisibility}
        />
      )}
    </div>
  );
};

export default OrdersList;
