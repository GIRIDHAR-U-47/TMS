"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Employee {
  emp_no: string;
  // Add other fields as per your backend response
  [key: string]: any;
}

const EmployeePage = () => {
  const params = useParams();
  const emp_no = params.emp_no as string;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!emp_no) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/employees/?emp_no=${emp_no}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch employee");
        return res.json();
      })
      .then((data) => {
        setEmployee(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setEmployee(null);
      })
      .finally(() => setLoading(false));
  }, [emp_no]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Employee Details</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {employee && (
        <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
          {Object.entries(employee).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {String(value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeePage; 