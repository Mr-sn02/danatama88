"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ contact: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.contact || !form.password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: form.contact,
      password: form.password
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message || "Gagal login. Periksa email & kata sandi.");
      return;
    }

    alert("Login berhasil (Supabase).");
    router.push("/products");
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "0 auto",
        backgroundColor: "#020617",
        borderRadius: "16px",
        border: "1px solid #1f2937",
        padding: "20px"
      }}
    >
      <h1
        style={{
          color: "#fbbf24",
          marginTop: 0,
          marginBottom: "8px",
          fontSize: "20px"
        }}
      >
        Login Nasabah
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#cbd5e1",
          marginTop: 0,
          marginBottom: "16px"
        }}
      >
        Masuk menggunakan email dan kata sandi yang sudah didaftarkan.
      </p>

      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            marginBottom: "4px",
            color: "#e5e7eb"
          }}
        >
          Email
        </label>
        <input
          type="email"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Email terdaftar"
          style={inputStyle}
        />

        <label
          style={{
            display: "block",
            fontSize: "13px",
            marginBottom: "4px",
            marginTop: "10px",
            color: "#e5e7eb"
          }}
        >
          Kata Sandi
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Masukkan kata sandi"
          style={inputStyle}
        />

        {error && (
          <p
            style={{
              fontSize: "12px",
              color: "#f97316",
              marginTop: "6px",
              marginBottom: 0
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: "#fbbf24",
            color: "#111827",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: loading ? "default" : "pointer",
            marginTop: "16px",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p
        style={{
          fontSize: "12px",
          textAlign: "center",
          marginTop: "14px",
          color: "#9ca3af"
        }}
      >
        Belum punya akun?{" "}
        <a href="/register" style={{ color: "#38bdf8", textDecoration: "none" }}>
          Daftar di sini
        </a>
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #334155",
  backgroundColor: "#020617",
  color: "#e5e7eb",
  fontSize: "13px"
};
