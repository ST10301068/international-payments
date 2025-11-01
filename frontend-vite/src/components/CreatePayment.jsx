import React, { useState } from "react";
import API from "../api/api.js";
import DOMPurify from "dompurify";

const CreatePayment = () => {
  const [form, setForm] = useState({
    amount: "",
    currency: "",
    provider: "",
    recipientAccount: "",
    swiftCode: "",
  });

  const [errors, setErrors] = useState({});

  const sanitize = (value) => value.replace(/\$/g, "").replace(/\./g, "");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
  const newErrors = {};
  if (!/^\d+(\.\d{1,2})?$/.test(form.amount)) 
    newErrors.amount = "Enter a valid amount";
  if (!["USD", "EUR", "ZAR"].includes(form.currency.toUpperCase())) 
    newErrors.currency = "Currency must be USD, EUR, or ZAR";
  if (form.provider.toUpperCase() !== "SWIFT") 
    newErrors.provider = "Provider must be SWIFT";
  if (!/^\d+$/.test(form.recipientAccount)) 
    newErrors.recipientAccount = "Recipient account must be numeric";
  if (!/^[A-Z0-9]{8,11}$/.test(form.swiftCode.toUpperCase())) // ✅ Check uppercase
    newErrors.swiftCode = "SWIFT Code must be 8-11 uppercase alphanumeric characters";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const sanitizedForm = {
        amount: parseFloat(form.amount),
        currency: DOMPurify.sanitize(form.currency),
        provider: DOMPurify.sanitize(form.provider),
        recipientAccount: DOMPurify.sanitize(form.recipientAccount),
        swiftCode: DOMPurify.sanitize(form.swiftCode),

      };
      console.log("Sending payment data:", sanitizedForm);
      await API.post("/payments", sanitizedForm);
      alert("Payment created!");
      setForm({ amount: "", currency: "", provider: "", recipientAccount: "", swiftCode: "" });
      setErrors({});
    } catch (err) {
       console.error("Full error:", err);
       console.error("Backend response:", err.response?.data); // ← See exact error
       console.error("Status:", err.response?.status);
       alert(err.response?.data?.msg || err.response?.data?.error || "Payment creation failed");
    }
  };

  return (
    <div>
      <h2>Create Payment</h2>
      <form onSubmit={handleSubmit}>
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        {errors.amount && <p style={{ color: "red" }}>{errors.amount}</p>}

        <input name="currency" placeholder="Currency (USD, EUR, ZAR)" value={form.currency} onChange={handleChange} required />
        {errors.currency && <p style={{ color: "red" }}>{errors.currency}</p>}

        <input name="provider" placeholder="Provider (SWIFT)" value={form.provider} onChange={handleChange} required />
        {errors.provider && <p style={{ color: "red" }}>{errors.provider}</p>}

        <input name="recipientAccount" placeholder="Recipient Account Number" value={form.recipientAccount} onChange={handleChange} required />
        {errors.recipientAccount && <p style={{ color: "red" }}>{errors.recipientAccount}</p>}

        <input name="swiftCode" placeholder="SWIFT Code" value={form.swiftCode} onChange={handleChange} required />
        {errors.swiftCode && <p style={{ color: "red" }}>{errors.swiftCode}</p>}

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default CreatePayment;
