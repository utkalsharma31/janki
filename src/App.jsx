import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import OrdersList from "./Components/OrdersList/OrdersList";
import LoginPage from "./Components/Login/LoginPage";
import Signup from "./Components/Signup/Signup";
import PositionPage from "./Components/Signup/PositionPage";
import OrderSheet from "./Components/OrderSheet/OrderSheet";
import FoundersDashboard from "./Components/FoundersDashboard/FoundersDashboard";
import ConfirmationSheet from "./Components/ConfirmationSheet/ConfirmationSheet";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<OrdersList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/positionPage" element={<PositionPage />} /> 
        <Route path="/OrderSheet" element={<OrderSheet />} /> 
        <Route path="/foundersDashboard" element={<FoundersDashboard />} /> 
        <Route path="/ConfirmationSheet" element={<ConfirmationSheet />} /> 
      </Routes>
    </div>
  );
}

export default App;
