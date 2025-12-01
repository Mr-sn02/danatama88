"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    contact: "",
    password: ""
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.username || !form.contact || !form.password) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (form.password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    // SIMPAN DATA KE LOCALSTORAGE (SIMULASI DATABASE)
    if (typeof window !== "undefined") {
      const userData = {
        username: form.username,
        contact: form.contact,
        password: form.password
      };
      localStorage.setItem("danatamaUser", JSON.stringify(userData));
    }

    alert(
      "Registrasi simulasi berhasil. Silakan login menggunakan kontak & kata sandi tersebut."
    );
    router.push("/login");
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
        Daftar Akun Baru
      </h1>

      <p
        style={{
          fontSize: "13px",
          color: "#cbd5e1",
          marginTop: 0,
          marginBottom: "16px"
        }}
      >
        Isi data berikut untuk membuat akun nasabah (simulasi) Danatama Makmur
        Sekuritas.
      </p>

      <form onSubmit={handleSubmit}>
        {/* NAMA PENGGUNA */}
        <label
          style={{
            display: "block",
            fontSize: "13px",
            marginBottom: "4px",
            color: "#e5e7eb"
          }}
        >
          Nama Pengguna
        </label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Nama lengkap / username"
          style={inputStyle}
        />

        {/* NOMOR TELEPON / EMAIL */}
        <label
          style={{
            display: "block",
            fontSize: "13px",
            marginBottom: "4px",
            marginTop: "10px",
            color: "#e5e7eb"
          }}
        >
          Nomor Telepon atau Email
        </label>
        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="0812xxxxxx atau contoh@email.com"
          style={inputStyle}
        />

        {/* PASSWORD */}
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
          placeholder="Minimal 6 karakter"
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
          Daftar
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
        Sudah punya akun?{" "}
        <a href="/login" style={{ color: "#38bdf8", textDecoration: "none" }}>
          Login di sini
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
