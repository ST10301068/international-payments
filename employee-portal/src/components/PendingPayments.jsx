import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function PendingPayments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPayments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/employee/payments/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to fetch payments");
      setPayments(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const updatePayment = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/employee/payments/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to update payment");
      fetchPayments();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); // use router navigation
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <nav style={{ marginBottom: "30px" }}>
        <button onClick={() => navigate("/employee/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/employee/history")}>Payment History</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h1 style={{ color: "#2c3e50" }}>⏳ Pending Payments</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {payments.length === 0 ? (
        <p>No pending payments found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p.accountNumber}</td>
                <td>{p.amount}</td>
                <td>{p.status}</td>
                <td>
                  <button onClick={() => updatePayment(p._id, "Approved")} style={{ margin: "2px" }}>Approve</button>
                  <button onClick={() => updatePayment(p._id, "Denied")} style={{ margin: "2px" }}>Deny</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PendingPayments;
