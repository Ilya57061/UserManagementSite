import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    setLoading(true);

    try {
      await api("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
        auth: false,
      });

      setOk("Successfully registered! Check your email for the confirmation link.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Registration error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f7f9fc",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "24px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <h3 style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>
            Register
          </h3>

          {error && (
            <div
              style={{
                background: "#f8d7da",
                color: "#721c24",
                border: "1px solid #f5c6cb",
                padding: "10px 15px",
                marginBottom: "16px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {ok && (
            <div
              style={{
                background: "#d4edda",
                color: "#155724",
                border: "1px solid #c3e6cb",
                padding: "10px 15px",
                marginBottom: "16px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              {ok}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Name
              </label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #dfe6ef",
                  paddingLeft: "10px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #dfe6ef",
                  paddingLeft: "10px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #dfe6ef",
                  paddingLeft: "10px",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
              style={{
                height: "40px",
                borderRadius: "6px",
                backgroundColor: "#1e6bff",
                color: "#fff",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
              }}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "14px",
              color: "#6c757d",
            }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1e6bff" }}>
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}