import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { isLoggedIn, setToken } from "../lib/auth.js";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState({ type: "idle", text: "" });

  useEffect(() => {
    if (isLoggedIn()) navigate("/users");
  }, [navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "loading", text: "Signing in..." });

    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });

      setToken(res.accessToken);
      navigate("/users");
    } catch (err) {
      setStatus({ type: "error", text: err?.message || "Login error" });
    }
  }

  const statusStyle =
    status.type === "loading"
      ? { background: "#eef5ff", border: "1px solid #d7e6ff" }
      : status.type === "error"
      ? { background: "#ffecec", border: "1px solid #ffd2d2" }
      : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#ffffff",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div
          style={{
            borderRadius: 14,
            border: "1px solid #e9edf3",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            background: "#fff",
            padding: 28,
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>
              Sign In to The App
            </div>
          </div>

          {status.type !== "idle" && status.text ? (
            <div
              style={{
                ...statusStyle,
                borderRadius: 10,
                padding: "10px 12px",
                marginBottom: 14,
                color: status.type === "error" ? "#b42318" : "#1f2937",
                fontSize: 14,
              }}
            >
              {status.text}
            </div>
          ) : null}

          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "#6b7280",
                  marginBottom: 6,
                }}
              >
                E-mail
              </label>

              <div style={{ position: "relative" }}>
                <input
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                  autoComplete="email"
                  style={{
                    height: 46,
                    paddingRight: 40,
                    borderRadius: 10,
                    border: "1px solid #dfe6ef",
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.6,
                    fontSize: 16,
                  }}
                >
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "#6b7280",
                  marginBottom: 6,
                }}
              >
                Password
              </label>

              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  height: 46,
                  borderRadius: 10,
                  border: "1px solid #dfe6ef",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={status.type === "loading"}
              style={{
                width: "100%",
                height: 46,
                borderRadius: 10,
                border: "none",
                background: "#0b63ff",
                color: "#fff",
                fontWeight: 700,
                opacity: status.type === "loading" ? 0.7 : 1,
                cursor: status.type === "loading" ? "not-allowed" : "pointer",
              }}
            >
              {status.type === "loading" ? "Signing In..." : "Sign In"}
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 18,
                fontSize: 14,
                color: "#6b7280",
              }}
            >
              <div>
                Don&apos;t have an account?{" "}
                <Link to="/register" style={{ color: "#0b63ff" }}>
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}