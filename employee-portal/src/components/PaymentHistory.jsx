import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function PaymentHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/employee/payments/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to fetch history");
      setHistory(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <nav style={{ marginBottom: "30px" }}>
        <button onClick={() => navigate("/employee/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/employee/history")}>Payment History</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h1 style={{ color: "#2c3e50" }}>📋 Payment History</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {history.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Processed By</th>
            </tr>
          </thead>
          <tbody>
            {history.map((p) => (
              <tr key={p._id}>
                <td>{p.accountNumber}</td>
                <td>{p.amount}</td>
                <td style={{ color: p.status === 'Approved' ? 'green' : 'red', fontWeight: 'bold' }}>
                  {p.status}
                </td>
                <td>{p.processedBy || 'System'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaymentHistory;
