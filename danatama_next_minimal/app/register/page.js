"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    contact: "",
    password: ""
  });
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

    if (!form.username || !form.contact || !form.password) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (!form.contact.includes("@")) {
      setError("Untuk saat ini, gunakan alamat email aktif pada kolom kontak.");
      return;
    }

    if (form.password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.contact,
      password: form.password,
      options: {
        data: {
          username: form.username,
          contact: form.contact
        }
      }
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || "Terjadi kesalahan saat registrasi.");
      return;
    }

    alert(
      "Registrasi berhasil (Supabase). Jika verifikasi email diaktifkan, silakan cek inbox Anda."
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
        Sekuritas. Gunakan email aktif pada kolom kontak.
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

        {/* EMAIL / KONTAK */}
        <label
          style={{
            display: "block",
            fontSize: "13px",
            marginBottom: "4px",
            marginTop: "10px",
            color: "#e5e7eb"
          }}
        >
          Email (Kontak Verifikasi)
        </label>
        <input
          type="email"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="contoh: nasabah@danatama.co.id"
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
          {loading ? "Memproses..." : "Daftar"}
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
