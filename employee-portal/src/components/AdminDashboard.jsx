import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", fullName: "", password: "" });
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to fetch employees");
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  const createEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to create employee");
      setNewUser({ username: "", fullName: "", password: "" });
      setError("");
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to delete employee");
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  return (
    <div className="container">
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h2>👨‍💼 Admin Dashboard</h2>
      {error && <p className="error">{error}</p>}

      <div className="section">
        <h3>Create New Employee</h3>
        <form onSubmit={createEmployee}>
          <input
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
          <input
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <button type="submit">Create Employee</button>
        </form>
      </div>

      <div className="section">
        <h3>Employee Accounts</h3>
        {employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id}>
                  <td>{emp.username}</td>
                  <td>{emp.fullName}</td>
                  <td>
                    <button onClick={() => deleteEmployee(emp._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
