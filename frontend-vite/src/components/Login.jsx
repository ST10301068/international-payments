import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

const Login = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({ accountNumber: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // <-- add this

  const sanitize = (value) => value.replace(/\$/g, "").replace(/\./g, "");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!/^\d+$/.test(form.accountNumber)) newErrors.accountNumber = "Account number must be numeric";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const sanitizedForm = {
        accountNumber: sanitize(form.accountNumber),
        password: form.password,
      };
      const res = await API.post("/auth/login", sanitizedForm);

      // Save token and user
        localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update App state
      setIsLoggedIn(true);

      // Redirect to create-payment immediately
      navigate("/create-payment");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="accountNumber"
          placeholder="Account Number"
          onChange={handleChange}
          value={form.accountNumber}
          required
        />
        {errors.accountNumber && <p style={{ color: "red" }}>{errors.accountNumber}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
