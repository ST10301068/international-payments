import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import CreatePayment from "./components/CreatePayment.jsx";
import PaymentList from "./components/PaymentList.jsx";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/login"; // redirect to login
  };

  return (
    <Router>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1 style={{ color: "#2c3e50" }}>💸 International Payments Portal</h1>

        <nav style={{ marginBottom: "30px" }}>
          {!isLoggedIn && (
            <>
              <Link to="/register" style={{ margin: "0 15px" }}>Register</Link>
              <Link to="/login" style={{ margin: "0 15px" }}>Login</Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link to="/create-payment" style={{ margin: "0 15px" }}>Create Payment</Link>
              <Link to="/payments" style={{ margin: "0 15px" }}>View Payments</Link>
              <button
                onClick={handleLogout}
                style={{ margin: "0 15px", padding: "5px 10px", cursor: "pointer" }}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<h2>Welcome! Please select an option above.</h2>} />

          {/* Redirect to /create-payment if logged in */}
          <Route path="/register" element={isLoggedIn ? <Navigate to="/create-payment" /> : <Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/create-payment" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />

          {/* Protected routes */}
          <Route path="/create-payment" element={isLoggedIn ? <CreatePayment /> : <Navigate to="/login" />} />
          <Route path="/payments" element={isLoggedIn ? <PaymentList /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
