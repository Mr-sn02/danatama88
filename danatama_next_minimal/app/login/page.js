"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ contact: "", password: "" });
  const [error, setError] = useState("");
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("danatamaUser");
      if (data) {
        setStoredUser(JSON.parse(data));
      }
    }
  }, []);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.contact || !form.password) {
      setError("Kontak dan kata sandi wajib diisi.");
      return;
    }

    if (!storedUser) {
      setError("Belum ada data registrasi. Silakan daftar akun terlebih dahulu.");
      return;
    }

    if (
      form.contact !== storedUser.contact ||
      form.password !== storedUser.password
    ) {
      setError("Kontak atau kata sandi tidak sesuai.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "danatamaLoggedIn",
        JSON.stringify({
          loggedIn: true,
          username: storedUser.username,
          contact: storedUser.contact
        })
      );
    }

    alert(`Login simulasi berhasil. Selamat datang, ${storedUser.username}!`);
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
        Masuk menggunakan nomor telepon / email dan kata sandi yang sudah
        didaftarkan.
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
          Nomor Telepon / Email
        </label>
        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Kontak yang digunakan saat registrasi"
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
          style={{
            width: "100%",
            backgroundColor: "#fbbf24",
            color: "#111827",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            marginTop: "16px"
          }}
        >
          Masuk
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
