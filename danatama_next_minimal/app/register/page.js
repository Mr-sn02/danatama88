"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!fullName || !phone || !email || !password || !confirmPass) {
      setMessage("Semua kolom wajib diisi.");
      return;
    }

    if (password !== confirmPass) {
      setMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone
        }
      }
    });

    setLoading(false);

    if (error) {
      setMessage(error.message || "Pendaftaran gagal.");
      return;
    }

    if (data?.user) {
      setMessage(
        "Pendaftaran berhasil. Silakan cek email jika perlu verifikasi, lalu login."
      );
      // beri sedikit jeda lalu arahkan ke login
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    }
  }

  const pageWrapper = {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "24px 10px",
    boxSizing: "border-box"
  };

  const card = {
    maxWidth: "460px",
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
    backgroundColor: "#22c55e",
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
            Daftar Akun Danatama
          </h1>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              marginTop: "6px",
              marginBottom: 0
            }}
          >
            Lengkapi data di bawah ini untuk membuat akun simulasi investasi.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Nama Lengkap</label>
          <input
            type="text"
            placeholder="contoh: Danatama Makmur"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Nomor HP (untuk kontak)</label>
          <input
            type="tel"
            placeholder="contoh: 081234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />

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
            placeholder="minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Konfirmasi Kata Sandi</label>
          <input
            type="password"
            placeholder="ketik ulang kata sandi"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Memproses..." : "Daftar"}
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
          Sudah punya akun?{" "}
          <a
            href="/login"
            style={{
              color: "#fbbf24",
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            Masuk di sini
          </a>
        </div>
      </div>
    </div>
  );
}
