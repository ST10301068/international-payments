import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

const Register = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // <-- add this

  const sanitize = (value) => value.replace(/\$/g, "").replace(/\./g, "");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!/^[A-Za-z ]+$/.test(form.fullName)) newErrors.fullName = "Only letters and spaces allowed";
    if (!/^\d{13}$/.test(form.idNumber)) newErrors.idNumber = "ID must be 13 digits";
    if (!/^\d+$/.test(form.accountNumber)) newErrors.accountNumber = "Account number must be numeric";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(form.password))
      newErrors.password = "Password must have min 8 chars, 1 uppercase, 1 lowercase, 1 number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const sanitizedForm = {
        fullName: sanitize(form.fullName),
        idNumber: sanitize(form.idNumber),
        accountNumber: sanitize(form.accountNumber),
        password: form.password,
      };
      const res = await API.post("/auth/register", sanitizedForm);

      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update App state
      setIsLoggedIn(true);

      // Redirect to create-payment immediately
      navigate("/create-payment");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          value={form.fullName}
          required
        />
        {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}

        <input
          name="idNumber"
          placeholder="ID Number"
          onChange={handleChange}
          value={form.idNumber}
          required
        />
        {errors.idNumber && <p style={{ color: "red" }}>{errors.idNumber}</p>}

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

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
