import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pagination, Link } from "@mui/material";
import { styled } from "@mui/system";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  FormControlLabel,
  DialogActions,
} from "@mui/material";
import OrderFilters from "./OrdersFilter";

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

const OrderSheet = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [orderStates, setOrderStates] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [orderNotes, setOrderNotes] = useState({});

  const [selectedRows, setSelectedRows] = useState({});
  const [bulkAction, setBulkAction] = useState("");
  const [allSelected, setAllSelected] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState([
    "order_id",
    "risk",
    "payment_gateway_method",
    "total_price",
    "orderStatus",
    "shipment_status",
    "awb_number",
    "customer_name",
    "contact_number",
    "shipping_address",
    "address_remark",
    "discount_code",
    "previousHistory",
    "communicationStatus",
    "callHistory",
    "notes",
  ]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleRowSelect = (orderId) => {
    setSelectedRows((prev) => {
      const newSelectedRows = { ...prev };
      if (newSelectedRows[orderId]) {
        delete newSelectedRows[orderId];
      } else {
        newSelectedRows[orderId] = true;
      }

      // Check if all orders on the current page are selected
      setAllSelected(orders.every((order) => newSelectedRows[order.order_id]));

      return newSelectedRows;
    });
  };

  const handleSelectAll = () => {
    const newAllSelected = !allSelected;
    setAllSelected(newAllSelected);

    if (newAllSelected) {
      const newSelectedRows = {};
      orders.forEach((order) => {
        newSelectedRows[order.order_id] = true;
      });
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows({});
    }
  };

  const handleBulkStatusChange = async () => {
    if (!bulkAction) {
      alert("Please select an action");
      return;
    }

    const selectedOrderIds = Object.keys(selectedRows).filter(
      (id) => selectedRows[id]
    );

    if (selectedOrderIds.length === 0) {
      alert("Please select at least one order");
      return;
    }

    try {
      // Create a list of objects, one for each selected order
      const dataToSend = selectedOrderIds.map((orderId) => ({
        order_id: orderId,
        status: bulkAction,
      }));

      console.log(
        "Sending request to:",
        `${backendUrl}/api/update-create-calling-list/`
      );
      console.log("Request payload:", dataToSend);

      const response = await axios.post(
        `${backendUrl}/api/update-create-calling-list/`,
        dataToSend
      );

      console.log("Response:", response);

      if (response.status === 200) {
        // Update local state
        const updatedOrders = orders.map((order) =>
          selectedOrderIds.includes(order.order_id.toString())
            ? { ...order, orderStatus: bulkAction }
            : order
        );
        setOrders(updatedOrders);
  
        // Update orderStates
        const updatedOrderStates = orderStates.map((state) =>
          selectedOrderIds.includes(state.id.toString())
            ? { ...state, orderStatus: bulkAction }
            : state
        );
        setOrderStates(updatedOrderStates);

        setSuccessMessage(
          `Successfully updated ${selectedOrderIds.length} orders`
        );

        
        setBulkAction("");
        setSelectedRows({});
        setAllSelected(false);
      } else {
        console.error("Failed to update orders:", response.data);
        alert("Failed to update orders. Please check the console for details.");
      }
    } catch (error) {
      console.error("Error updating orders:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      alert("An error occurred while updating orders");
    }
  };

  const handleNotesChange = (value) => {
    setOrderNotes({
      ...orderNotes,
      [selectedOrder.order_id]: value,
    });
  };

  const saveNotes = async () => {
    try {
      await axios.post(`/api/orders/${selectedOrder.order_id}/notes`, {
        notes: orderNotes[selectedOrder.order_id],
      });
      console.log("Notes saved successfully");

      setOrders(
        orders.map((order) =>
          order.order_id === selectedOrder.order_id
            ? { ...order, notes: orderNotes[selectedOrder.order_id] }
            : order
        )
      );
    } catch (error) {
      console.log("error message:", error);
    }
  };

  const fetchData = async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const [ordersResponse, savedDataResponse] = await Promise.all([
        axios.get(
          `${backendUrl}/api/orders/?page=${currentPage}&${queryString}`
        ),
        axios.get(`${backendUrl}/api/orders/`),
      ]);

      setOrders(ordersResponse.data.results);
      setTotalPages(Math.ceil(ordersResponse.data.count / 100));
      setTotalOrders(ordersResponse.data.count);
      setAllSelected(false);

      const savedData = savedDataResponse.data.results;
      initializeOrderStates(ordersResponse.data.results, savedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleFilterChange = (filters) => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchData(filters);
  };

  const initializeOrderStates = (orders, savedData) => {
    const initialOrderStates = orders.map((order) => {
      // First, check for saved data in the database
      const savedOrder = savedData.find(
        (item) => item.order_id === order.order_id
      );

      // If no saved data in DB, check localStorage
      const localStorageData = localStorage.getItem(`order_${order.order_id}`);
      const localSavedOrder = localStorageData
        ? JSON.parse(localStorageData)
        : null;

      // Prioritize DB data, then localStorage, then default order data
      return {
        id: order.order_id,
        orderStatus:
          savedOrder?.status || localSavedOrder?.status || order.orderStatus,
        addressRemark:
          savedOrder?.address_remark ||
          localSavedOrder?.address_remark ||
          order.addressRemark,
        communicationStatus:
          savedOrder?.communication_status ||
          localSavedOrder?.communication_status ||
          order.communicationStatus,
      };
    });

    setOrderStates(initialOrderStates);
    console.log("Initialized Order States:", initialOrderStates);
  };

  const saveChanges = async () => {
    try {
      // Map orderStates to format expected by backend
      const dataToSave = orderStates.map((orderState) => ({
        order_id: orderState.id,
        status: orderState.orderStatus,
        address_remark: orderState.addressRemark,
        communication_status: orderState.communicationStatus,
      }));

      // Make POST request to save data
      const response = await axios.post(
        `${backendUrl}/api/update-create-calling-list/`,
        dataToSave,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dataToSave.forEach((order) => {
        localStorage.setItem(`order_${order.order_id}`, JSON.stringify(order));
      });

      setSuccessMessage("Data saved successfully!");
      console.log("Data to save:", dataToSave);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleOrderStatusChange = (event, orderId) => {
    const updatedOrderStates = orderStates.map((orderState) =>
      orderState.id === orderId
        ? { ...orderState, orderStatus: event.target.value }
        : orderState
    );
    setOrderStates(updatedOrderStates);
  };

  const handleAddressRemarkChange = (event, orderId) => {
    const updatedOrderStates = orderStates.map((orderState) =>
      orderState.id === orderId
        ? { ...orderState, addressRemark: event.target.value }
        : orderState
    );
    setOrderStates(updatedOrderStates);
  };

  const handleCommunicationStatusChange = (event, orderId) => {
    const updatedOrderStates = orderStates.map((orderState) =>
      orderState.id === orderId
        ? { ...orderState, communicationStatus: event.target.value }
        : orderState
    );
    setOrderStates(updatedOrderStates);
  };

  const handleOrderIdClick = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleColumnSelect = (column) => {
    setSelectedColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((col) => col !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const handleDownload = async () => {
    try {
      const queryString = new URLSearchParams({
        // Include any filters here if needed
      }).toString();

      const response = await axios.get(
        `${backendUrl}/api/orders/?${queryString}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading data:", error);
    }
  };

  //console.log(orders);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center py-6 mb-8 border-b border-gray-200">
        Order Sheet
      </h1>

      <div className="mb-8">
        <OrderFilters onFilterChange={handleFilterChange} />
      </div>

      <div className="mb-4">
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleSelectAll}
        >
          {orders.every((order) => selectedRows[order.order_id])
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
            className="mr-2"
          />
          <span>
            Select All ({Object.keys(selectedRows).length} / {totalOrders}{" "}
            selected)
          </span>
        </div>
        <div className="flex items-center">
          <Select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            displayEmpty
            className="mr-2"
          >
            <MenuItem value="" disabled>
              Change Order Status
            </MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBulkStatusChange}
            disabled={!bulkAction || Object.keys(selectedRows).length === 0}
          >
            Apply
          </Button>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          disabled={Object.keys(selectedRows).length === 0}
          className="ml-2"
        >
          Download
        </Button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full min-w-[800px] bg-white border-collapse rounded-md mt-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left font-semibold">Select</th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Order ID
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Risk Rating
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Payment Type
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Amount
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Order Status
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Shipping Status
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  AWB
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Name
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Contact Number
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Address
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Address Remark
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Coupon Code
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Previous History
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Communication Status
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Call History
                </div>
              </th>
              <th className="p-3 text-left font-semibold">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Notes
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => (
              <tr key={order.order_id} className="bg-white hover:bg-gray-100">
                <td className="p-3 border-t">
                  <input
                    type="checkbox"
                    checked={!!selectedRows[order.order_id]}
                    onChange={() => handleRowSelect(order.order_id)}
                  />
                </td>

                <td
                  className="p-3 border-t cursor-pointer text-blue-500"
                  onClick={() => handleOrderIdClick(order)}
                >
                  {order.order_id}
                </td>
                <td className="p-3 border-t">{order.risk}</td>
                <td className="p-3 border-t">{order.payment_gateway_method}</td>
                <td className="p-3 border-t">{order.total_price}</td>
                <td className="p-3 border-t">
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel id={`order-status-label-${order.order_id}`}>
                      Order Status
                    </InputLabel>
                    <Select
                      labelId={`order-status-label-${order.order_id}`}
                      value={
                        orderStates.find((item) => item.id === order.order_id)
                          ?.orderStatus || ""
                      }
                      onChange={(event) =>
                        handleOrderStatusChange(event, order.order_id)
                      }
                      label="Order Status"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                      <MenuItem value="Confirmed">Confirmed</MenuItem>
                    </Select>
                  </FormControl>
                </td>
                <td className="p-3 border-t">{order.shipment_status}</td>
                <td className="p-3 border-t">
                  {/* <Link to={order.awb_link}>{order.awb_number}</Link> */}
                  <a
                    className="text-blue-500"
                    target="_blank"
                    href={order.awb_link}
                  >
                    {order.awb_number}
                  </a>
                </td>
                <td className="p-3 border-t">{order.customer.full_name}</td>
                <td className="p-3 border-t">
                  {order.customer.contact_number}
                </td>
                <td className="p-3 border-t">
                  {order?.address?.shipping_address}
                </td>
                <td className="p-3 border-t">
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel id={`address-remark-label-${order.order_id}`}>
                      Address Remark
                    </InputLabel>
                    <Select
                      labelId={`address-remark-label-${order.order_id}`}
                      value={
                        orderStates.find((item) => item.id === order.order_id)
                          ?.addressRemark || ""
                      }
                      onChange={(event) =>
                        handleAddressRemarkChange(event, order.order_id)
                      }
                      label="Address Remark"
                    >
                      <MenuItem value="Geniune">Geniune</MenuItem>
                      <MenuItem value="Suspicious">Suspicious</MenuItem>
                    </Select>
                  </FormControl>
                </td>
                <td className="p-3 border-t">{order.discount_code}</td>
                <td className="p-3 border-t">{order.previousHistory}</td>
                <td className="p-3 border-t">
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel
                      id={`communication-status-label-${order.order_id}`}
                    >
                      Communication Status
                    </InputLabel>
                    <Select
                      labelId={`communication-status-label-${order.order_id}`}
                      value={
                        orderStates.find((item) => item.id === order.order_id)
                          ?.communicationStatus || ""
                      }
                      onChange={(event) =>
                        handleCommunicationStatusChange(event, order.order_id)
                      }
                      label="Communication Status"
                    >
                      <MenuItem value="call and confirmed">
                        call and confirmed
                      </MenuItem>
                      <MenuItem value="NPU">NPU</MenuItem>
                      <MenuItem value="Busy">Busy</MenuItem>
                      <MenuItem value="Switch off">Switch off</MenuItem>
                      <MenuItem value="Invalid number">Invalid number</MenuItem>
                      <MenuItem value="Language Problem">
                        Language Problem
                      </MenuItem>
                      <MenuItem value="Not Answering Properly">
                        Not Answering Properly
                      </MenuItem>
                      <MenuItem value="Asked to sent whatsapp">
                        Asked to sent whatsapp
                      </MenuItem>
                      <MenuItem value="Asked to callback later">
                        Asked to callback later
                      </MenuItem>
                      <MenuItem value="Confirmed as Risk is trust worthy">
                        Confirmed as Risk is trust worthy
                      </MenuItem>
                      <MenuItem value="Prepaid confirmed">
                        Prepaid confirmed
                      </MenuItem>
                      <MenuItem value="Called and Cancelled">
                        Called and Cancelled
                      </MenuItem>
                      <MenuItem value="Call 1">Call 1</MenuItem>
                      <MenuItem value="COD not available in area Ask for prepaid">
                        COD not available in area Ask for prepaid
                      </MenuItem>
                      <MenuItem value="Check remarks">Check remarks</MenuItem>
                      <MenuItem value="Customer placed another order with Discount coupon code">
                        Customer placed another order with Discount coupon code
                      </MenuItem>
                      <MenuItem value="Send one order first, if she likes send the other one as well">
                        Send one order first, if she likes send the other one as
                        well
                      </MenuItem>
                      <MenuItem value="Out of Coverage area">
                        Out of Coverage area
                      </MenuItem>
                      <MenuItem value="Replacement Order">
                        Replacement Order
                      </MenuItem>
                      <MenuItem value="Dummy Order">Dummy Order</MenuItem>
                      <MenuItem value="Order by Employee">
                        Order by Employee
                      </MenuItem>
                      <MenuItem value="Network Issue">Network Issue</MenuItem>
                      <MenuItem value="COD Confirmed">COD Confirmed</MenuItem>
                    </Select>
                  </FormControl>
                </td>
                <td className="p-3 border-t">{order.callHistory}</td>
                <td className="p-3 border-t">
                  {order.notes || orderNotes[order.order_id] || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Changes Button */}
      <div className="my-6 text-center">
        <Button variant="contained" color="primary" onClick={saveChanges}>
          Save Changes
        </Button>
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </div>

      {/* Pagination Component */}
      <div className="my-6">
        <CustomPagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="p-2">
          <div className="flex flex-wrap justify-between items-center ">
            <span className="whitespace-nowrap">{selectedOrder?.order_id}</span>
            <span className="whitespace-nowrap">
              {selectedOrder?.risk || "N/A"}
            </span>
            <span className="whitespace-nowrap">
              {selectedOrder?.payment_gateway_method || "N/A"}
            </span>
            <span className="whitespace-nowrap">
              {selectedOrder?.calling_list?.Status || "N/A"}
            </span>
            <span className="whitespace-nowrap">
              {selectedOrder?.calling_list?.confirmation_status || "N/A"}
            </span>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div>
              {/* {console.log(selectedOrder)} */}

              <div className="mt-2 mb-4 ">
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedOrder.customer?.full_name || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedOrder.address?.shipping_address || "N/A"}
                </p>
                <p>
                  <strong>Contact:</strong>{" "}
                  {selectedOrder.customer?.contact_number || "N/A"}
                </p>
              </div>

              {selectedOrder.line_items_set &&
              selectedOrder.line_items_set.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left font-semibold">S.no.</th>
                      <th className="p-2 text-left font-semibold">
                        Line Item Name
                      </th>
                      <th className="p-2 text-left font-semibold">SKU</th>
                      <th className="p-2 text-left font-semibold">Qty</th>
                      <th className="p-2 text-left font-semibold">Price</th>
                      <th className="p-2 text-left font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.line_items_set.map((item, index) => (
                      <tr key={index} className="bg-white hover:bg-gray-100">
                        <td className="p-2 border-t">{index + 1}</td>
                        <td className="p-2 border-t">{item.title || "N/A"}</td>
                        <td className="p-2 border-t">{item.sku || "N/A"}</td>
                        <td className="p-2 border-t">{item.quantity || 0}</td>
                        <td className="p-2 border-t">{item.price || 0}</td>
                        <td className="p-2 border-t">
                          {(item.quantity || 0) * (item.price || 0)}
                        </td>
                      </tr>
                    ))}
                    <tr className=" font-semibold">
                      <td className="p-2 border-t" colSpan={3}>
                        Subtotal
                      </td>
                      <td className="p-2 border-t">
                        {selectedOrder.line_item_quantity || "N/A"}
                      </td>
                      <td className="p-2 border-t"></td>
                      <td className="p-2 border-t">
                        {selectedOrder.line_items_set[0]?.total_price || "N/A"}
                      </td>
                    </tr>
                    <tr className=" font-semibold">
                      <td className="p-2 border-t" colSpan={3}>
                        {selectedOrder.discount_code || "N/A"}
                      </td>
                      <td className="p-2 border-t">
                        {selectedOrder.line_items_set[0].discount_percentage
                          ? `${selectedOrder.line_items_set[0].discount_percentage}%`
                          : "N/A"}
                      </td>
                      <td className="p-2 border-t"></td>
                      <td className="p-2 border-t">
                        {selectedOrder.line_items_set[0].discount_amount ||
                          "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold">
                      <td className="p-2 border-t" colSpan={5}>
                        Total
                      </td>
                      <td className="p-2 border-t">
                        {selectedOrder.total_price || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No line items available for this order.</p>
              )}

              <div className="mt-6">
                <textarea
                  className="w-full p-2 border rounded"
                  rows="4"
                  value={orderNotes[selectedOrder?.order_id] || ""}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Enter notes here..."
                />
              </div>

              <div className="mt-6 flex justify-between">
                <p className="text-lg mb-2 mr-4">
                  Contact no. :{" "}
                  {selectedOrder.customer?.contact_number || "N/A"}
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded space-y-2"
                  onClick={() => {
                    // Implement call functionality here
                    // This could open a dialer or initiate a call through your system
                    console.log(
                      `Calling ${selectedOrder.customer?.contact_number}`
                    );
                  }}
                >
                  Call Customer
                </button>
              </div>

              <div className="mt-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left font-semibold">Attempt</th>
                      <th className="p-2 text-left font-semibold">Status</th>
                      <th className="p-2 text-left font-semibold">Recording</th>
                      <th className="p-2 text-left font-semibold">
                        Attempt by
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCloseDialog}
            //color="primary"
          >
            Close
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={saveNotes}
            //color="primary"
          >
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderSheet;
