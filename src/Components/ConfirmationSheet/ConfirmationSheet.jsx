import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import {
  Pagination,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

const CustomPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPagination-ul": {
    justifyContent: "center",
    margin: "20px 0",
  },
  "& .MuiPaginationItem-root": {
    margin: theme.spacing(0.5),
    borderRadius: "0",
  },
}));

const ConfirmationSheet = () => {
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fulfilled, setFulfilled] = useState({});
  const [reason, setReason] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfirmedOrders();
  }, [currentPage]);

  const fetchConfirmedOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://13.60.99.181/api/orders/confirmed?page=${currentPage}`
      );
      setConfirmedOrders(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
      setLoading(false);
    } catch (error) {
      console.error("Error fetching confirmed orders:", error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleFulfillmentChange = (orderId) => (event) => {
    setFulfilled((prev) => ({ ...prev, [orderId]: event.target.checked }));
  };

  const handleReasonChange = (orderId) => (event) => {
    setReason((prev) => ({ ...prev, [orderId]: event.target.value }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedOrders = confirmedOrders.map((order) => ({
        order_id: order.order_id,
        fulfilled: fulfilled[order.order_id] || false,
        reason: reason[order.order_id] || "",
      }));

      await axios.post(
        "http://13.60.99.181/api/orders/update-fulfillment",
        updatedOrders
      );
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Error saving changes. Please try again.");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center py-6 mb-8 border-b border-gray-200">
        Confirmation Sheet
      </h1>
      <table className="w-full min-w-[800px] bg-white border-collapse rounded-md mt-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left font-semibold">Order ID</th>
            <th className="p-3 text-left font-semibold">Payment Type</th>
            <th className="p-3 text-left font-semibold">Line Item Name</th>
            <th className="p-3 text-left font-semibold">SKU</th>
            <th className="p-3 text-left font-semibold">Qty</th>
            <th className="p-3 text-left font-semibold">Fulfilled</th>
            <th className="p-3 text-left font-semibold">
              Reason for Not Fulfilling
            </th>
          </tr>
        </thead>
        <tbody>
          {confirmedOrders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.payment_gateway_method}</td>
              <td>{order.line_items_set[0]?.title || "N/A"}</td>
              <td>{order.line_items_set[0]?.sku || "N/A"}</td>
              <td>{order.line_items_set[0]?.quantity || "N/A"}</td>
              <td>
                <Checkbox
                  checked={fulfilled[order.order_id] || false}
                  onChange={handleFulfillmentChange(order.order_id)}
                  color="primary"
                />
              </td>
              <td>
                <Select
                  labelId={`reason-label-${order.order_id}`}
                  value={reason[order.order_id] || ""}
                  onChange={handleReasonChange(order.order_id)}
                  displayEmpty
                  fullWidth
                  label="Reason"
                >
                  <MenuItem value="">Select a reason</MenuItem>
                  <MenuItem value="New Design">New Design</MenuItem>
                  <MenuItem value="Gone for Plating">Gone for Plating</MenuItem>
                  <MenuItem value="Gone for marking">Gone for marking</MenuItem>
                  <MenuItem value="In process">In process</MenuItem>
                  <MenuItem value="Order Cancelled">Order Cancelled</MenuItem>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-6">
        <CustomPagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveChanges}
        className="mt-4"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default ConfirmationSheet;
