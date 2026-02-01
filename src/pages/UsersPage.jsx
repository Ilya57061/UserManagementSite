import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { clearToken } from "../lib/auth.js";

function formatDate(s) {
  if (!s) return "";
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export default function UsersPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selected, setSelected] = useState([]);

  const [status, setStatus] = useState({ type: "idle", text: "" });
  const statusTimerRef = useRef(null);

  function setStatusSafe(next) {
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
    setStatus(next);

    if (next.type === "success" || next.type === "error") {
      statusTimerRef.current = setTimeout(() => {
        setStatus({ type: "idle", text: "" });
      }, 3000);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const pagesCount = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  async function load({ silent = false } = {}) {
    if (!silent) setStatusSafe({ type: "loading", text: "Loading..." });

    try {
      const qs = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(debouncedSearch?.trim() ? { search: debouncedSearch.trim() } : {}),
      });

      const res = await api(`/api/users?${qs.toString()}`);
      setItems(res.items || []);
      setTotal(res.total || 0);
      setSelected([]);

      if (!silent) setStatusSafe({ type: "idle", text: "" });
    } catch (err) {
      if (err?.status === 401) {
        clearToken();
        navigate("/login");
        return;
      }
      setStatusSafe({ type: "error", text: err?.message || "Load error" });
    }
  }

  useEffect(() => {
    load();
  }, [page, pageSize, debouncedSearch]);

  function toggleOne(id) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }

  function toggleAll() {
    if (selected.length === items.length) setSelected([]);
    else setSelected(items.map((x) => x.id));
  }

  async function doBulk(path) {
    if (!selected.length) {
      setStatusSafe({ type: "error", text: "Select users first" });
      return;
    }

    setStatusSafe({ type: "loading", text: "Working..." });

    try {
      const res = await api(path, {
        method: "POST",
        body: { ids: selected },
      });

      const msg = res?.message ?? `Done.`;
      setStatusSafe({ type: "success", text: msg });
      await load({ silent: true });
    } catch (err) {
      if (err?.status === 401) {
        clearToken();
        navigate("/login");
        return;
      }
      setStatusSafe({ type: "error", text: err?.message || "Action error" });
    }
  }

  async function deleteUnverified() {
    setStatusSafe({ type: "loading", text: "Working..." });

    try {
      const res = await api("/api/users/delete-unverified", { method: "POST" });

      const msg = res?.message ?? `Deleted unverified: ${res?.affected ?? "?"}`;
      setStatusSafe({ type: "success", text: msg });
      await load({ silent: true });
    } catch (err) {
      if (err?.status === 401) {
        clearToken();
        navigate("/login");
        return;
      }
      setStatusSafe({ type: "error", text: err?.message || "Action error" });
    }
  }

  const statusStyle =
    status.type === "loading"
      ? { padding: "8px 12px", borderRadius: 8, background: "#eef5ff" }
      : status.type === "success"
      ? { padding: "8px 12px", borderRadius: 8, background: "#e9fbe9" }
      : status.type === "error"
      ? { padding: "8px 12px", borderRadius: 8, background: "#ffecec" }
      : null;

  return (
    <div>
      {status.type !== "idle" && status.text ? (
        <div className="mt-2" style={statusStyle}>
          <span className="small-text">{status.text}</span>
        </div>
      ) : null}

      <div className="mt-2 mb-2 d-flex gap-2 flex-wrap">
        <button
          className="btn btn-warning btn-sm"
          onClick={() => doBulk("/api/users/block")}
          title="Block"
        >
          Block
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => doBulk("/api/users/unblock")}
          title="Unblock"
        >
          <img
            src="https://img.icons8.com/?size=100&id=T78mDH2nJkOw&format=png&color=000000"
            alt="Unblock"
            width="20"
            height="20"
          />
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => doBulk("/api/users/delete")}
          title="Delete"
        >
          <img
            src="https://img.icons8.com/?size=100&id=67884&format=png&color=000000"
            alt="Delete"
            width="20"
            height="20"
          />
        </button>

        <button
          className="btn btn-outline-danger btn-sm"
          onClick={deleteUnverified}
          title="Delete unverified"
        >
          <img
            src="https://img.icons8.com/?size=100&id=xsoF8uDtYqwn&format=png&color=000000"
            alt="Delete unverified"
            width="20"
            height="20"
          />
        </button>

        <div className="ms-auto d-flex gap-2 align-items-center flex-wrap">
          <div style={{ width: 260 }}>
            <input
              className="form-control"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setSelected([]);
              }}
            />
          </div>

          <span className="small-text">Page size</span>

          <select
            className="form-select form-select-sm"
            style={{ width: 90 }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
              setSelected([]);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table table-sm table-striped">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={items.length > 0 && selected.length === items.length}
                  onChange={toggleAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Last login</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {items.map((u) => (
              <tr
                key={u.id}
                style={u.status === "Blocked" ? { background: "#ffe6e6" } : null}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(u.id)}
                    onChange={() => toggleOne(u.id)}
                  />
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{formatDate(u.lastLoginAt)}</td>
                <td>{u.status}</td>
              </tr>
            ))}

            {items.length === 0 && status.type !== "loading" ? (
              <tr>
                <td colSpan={5} className="text-center small-text">
                  No users
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <div className="small-text">
            Page {page} / {pagesCount} (total: {total})
          </div>

          <button
            className="btn btn-outline-primary btn-sm"
            disabled={page >= pagesCount}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-2 small-text">Selected: {selected.length}</div>
    </div>
  );
}