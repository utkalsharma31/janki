import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pagination } from "@mui/material";
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
  DialogActions,
} from "@mui/material";

const CustomPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPagination-ul": {
    justifyContent: "center", // Center align the pagination items
    margin: "20px 0", // Add some margin below pagination
  },
  "& .MuiPaginationItem-root": {
    margin: theme.spacing(0.5),
    borderRadius: "0",
  },
}));

const CallingList = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [orderStates, setOrderStates] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch data from Django API based on current page
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, savedDataResponse] = await Promise.all([
          axios.get(`http://192.168.1.38:8000/api/orders/?page=${currentPage}`),
          axios.get("http://192.168.1.38:8000/api/orders/"),
        ]);

        setOrders(ordersResponse.data.results);
        setTotalPages(Math.ceil(ordersResponse.data.count / 20));

        console.log("Order Response:", ordersResponse.data.results)

        const savedData = savedDataResponse.data.results;
        console.log("Saved Data:", savedData);

        localStorage.setItem("savedOrderData", JSON.stringify(savedData));

        initializeOrderStates(ordersResponse.data.results, savedData);

        // const initialOrderStates = ordersResponse.data.results.map((order) => {
        //   const savedOrder = savedData.find(
        //     (item) => item.order_id === order.order_id
        //   );
        //   return {
        //     id: order.order_id,
        //     orderStatus: savedOrder ? savedOrder.status : order.orderStatus,
        //     addressRemark: savedOrder
        //       ? savedOrder.address_remark
        //       : order.addressRemark,
        //     communicationStatus: savedOrder
        //       ? savedOrder.communication_status
        //       : order.communicationStatus,
        //   };
        // });
        // setOrderStates(initialOrderStates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage]);


  const initializeOrderStates = (orders, savedData) => {
    const storedData = JSON.parse(localStorage.getItem('savedOrderData')) || [];
    
    const initialOrderStates = orders.map((order) => {
      const savedOrder = savedData.find((item) => item.order_id === order.order_id) 
        || storedData.find((item) => item.order_id === order.order_id);
      
      return {
        id: order.order_id,
        orderStatus: savedOrder ? savedOrder.calling_list.status : order.orderStatus,
        addressRemark: savedOrder ? savedOrder.calling_list.address_remark : order.addressRemark,
        communicationStatus: savedOrder ? savedOrder.calling_list.communication_status : order.communicationStatus,
        date: savedOrder ? savedOrder.order_created_at : order.order_created_at
      };
    });
  
    setOrderStates(initialOrderStates);
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
        "http://192.168.1.38:8000/api/update-create-calling-list/",
        dataToSave,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem('savedOrderData', JSON.stringify(dataToSave));
      
      setSuccessMessage("Data saved successfully!");
      console.log("Data to save:", dataToSave);

    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleOrderIdClick = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  console.log(orders);

  return (
    <div className="w-full px-5 bg-">
      <p className="text-3xl text-center font-semibold py-4 border-b">
        Abandoned Cart List
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse rounded-md mt-6">
          {/* Table Headers */}
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left font-semibold">Date</th>
              <th className="p-3 text-left font-semibold">Amount</th>
              <th className="p-3 text-left font-semibold">Order Status</th>
              <th className="p-3 text-left font-semibold">Shipping Status</th>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Contact Number</th>
              <th className="p-3 text-left font-semibold">Address</th>
              <th className="p-3 text-left font-semibold">Address Remark</th>
              <th className="p-3 text-left font-semibold">Coupon Code</th>
              <th className="p-3 text-left font-semibold">Previous History</th>
              <th className="p-3 text-left font-semibold">
                Communication Status
              </th>
              <th className="p-3 text-left font-semibold">Call History</th>
              <th className="p-3 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {orders?.map((order) => (
              <tr key={order.order_id} className="bg-white hover:bg-gray-100">
                <td className="p-3 border-t">{(new Date(order.order_created_at).toLocaleDateString())}</td>
                <td className="p-3 border-t">{order.total_price}</td>
                <td className="p-3 border-t">
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel id={`order-status-label-${order.order_id}`}>
                      Order Status
                    </InputLabel>
                    <Select
                      labelId={`order-status-label-${order.order_id}`}
                      defaultValue={
                        orderStates.find((item) => item.id === order.order_id)
                          ?.orderStatus || ""
                      }
                      onChange={(event) =>
                        handleOrderStatusChange(event, order.order_id)
                      }
                      label="Order Status"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                    </Select>
                  </FormControl>
                </td>
                <td className="p-3 border-t">{order.shipment_status}</td>
                <td className="p-3 border-t">{order.customer.full_name}</td>
                <td className="p-3 border-t">
                  {order.customer.contact_number}
                </td>
                <td className="p-3 border-t">
                  {order.address.shipping_address}
                </td>
                <td className="p-3 border-t">
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel id={`address-remark-label-${order.order_id}`}>
                      Address Remark
                    </InputLabel>
                    <Select
                      labelId={`address-remark-label-${order.order_id}`}
                      defaultValue={
                        orderStates.find((item) => item.id === order.order_id)
                          ?.addressRemark || ""
                      }
                      onChange={(event) =>
                        handleAddressRemarkChange(event, order.order_id)
                      }
                      label="Address Remark"
                    >
                      <MenuItem value="Genuine">Genuine</MenuItem>
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
                <td className="p-3 border-t">{order.notes}</td>
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
        <DialogTitle>Order Details - {selectedOrder?.order_id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div>
              <p>
                <strong>Risk Rating:</strong> {selectedOrder.risk}
              </p>
              <p>
                <strong>Payment Type:</strong>
                {selectedOrder.payment_gateway_method}
              </p>
              <p>
                <strong>Amount:</strong> {selectedOrder.total_price}
              </p>
              <p>
                <strong>Order Status:</strong> {selectedOrder.orderStatus}
              </p>
              <p>
                <strong>Shipping Status:</strong>
                {selectedOrder.shipment_status}
              </p>
              <p>
                <strong>AWB:</strong> {selectedOrder.awb}
              </p>
              <p>
                <strong>Name:</strong> {selectedOrder.customer.full_name}
              </p>
              <p>
                <strong>Contact Number:</strong>
                {selectedOrder.customer.contact_number}
              </p>
              <p>
                <strong>Address:</strong>
                {selectedOrder.address.shipping_address}
              </p>
              <p>
                <strong>Address Remark:</strong> {selectedOrder.addressRemark}
              </p>
              <p>
                <strong>Coupon Code:</strong> {selectedOrder.discount_code}
              </p>
              <p>
                <strong>Previous History:</strong>
                {selectedOrder.previousHistory}
              </p>
              <p>
                <strong>Communication Status:</strong>{" "}
                {selectedOrder.communicationStatus}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CallingList;
