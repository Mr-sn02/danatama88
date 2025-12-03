"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setMessage(error.message || "Login gagal. Periksa kembali data Anda.");
      return;
    }

    if (data?.user) {
      setMessage("Login berhasil. Mengalihkan...");
      router.push("/");
    }
  }

  const pageWrapper = {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "24px 10px",
    boxSizing: "border-box"
  };

  const card = {
    maxWidth: "420px",
    margin: "0 auto",
    backgroundColor: "#020617",
    borderRadius: "16px",
    border: "1px solid #1f2937",
    padding: "20px 18px",
    boxSizing: "border-box"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    marginTop: "10px",
    color: "#e5e7eb",
    fontSize: "13px"
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    backgroundColor: "#020617",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#e5e7eb",
    fontSize: "13px",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    marginTop: "14px",
    backgroundColor: "#fbbf24",
    padding: "10px 16px",
    borderRadius: "999px",
    border: "none",
    fontWeight: 700,
    fontSize: "14px",
    cursor: loading ? "default" : "pointer"
  };

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <h1
            style={{
              color: "#fbbf24",
              margin: 0,
              fontSize: "20px"
            }}
          >
            Masuk Akun Danatama
          </h1>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              marginTop: "6px",
              marginBottom: 0
            }}
          >
            Gunakan email dan kata sandi yang sudah terdaftar.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="contoh: nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Kata Sandi</label>
          <input
            type="password"
            placeholder="min. 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {message && (
          <p
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              marginTop: "10px"
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            marginTop: "14px",
            fontSize: "12px",
            color: "#9ca3af",
            textAlign: "center"
          }}
        >
          Belum punya akun?{" "}
          <a
            href="/register"
            style={{
              color: "#fbbf24",
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Daftar sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
