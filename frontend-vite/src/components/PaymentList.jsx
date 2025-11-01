import React, { useEffect, useState } from "react";
import API from "../api/api";
import DOMPurify from "dompurify"; // sanitization library

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const sanitize = (value) => DOMPurify.sanitize(value);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get("/payments"); // API is already HTTPS
        // Sanitize each payment's fields
        const sanitizedPayments = res.data.map((p) => ({
          _id: sanitize(p._id),
          amount: sanitize(p.amount),
          currency: sanitize(p.currency),
          provider: sanitize(p.provider),
          recipientAccount: sanitize(p.recipientAccount),
          swiftCode: sanitize(p.swiftCode),
          status: sanitize(p.status || "Pending"),
        }));
        setPayments(sanitizedPayments);
      } catch (err) {
        console.error(err);
        alert("Could not fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <p>Loading payments...</p>;

  return (
    <div>
      <h2>Your Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table border="1" style={{ margin: "0 auto", padding: "10px" }}>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Recipient Account</th>
              <th>SWIFT Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p.amount}</td>
                <td>{p.currency}</td>
                <td>{p.provider}</td>
                {/* Mask all but last 4 digits of account number */}
                <td>{p.recipientAccount.replace(/\d(?=\d{4})/g, "*")}</td>
                <td>{p.swiftCode}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentList;
