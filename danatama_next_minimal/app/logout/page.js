"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Hapus data simulasi login & user
    if (typeof window !== "undefined") {
      localStorage.removeItem("danatamaUser");
      localStorage.removeItem("danatamaLoggedIn");
    }

    // Redirect setelah sedikit delay
    const timeout = setTimeout(() => {
      router.push("/");
    }, 1200);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "0 auto",
        backgroundColor: "#020617",
        borderRadius: "16px",
        border: "1px solid #1f2937",
        padding: "20px",
        textAlign: "center"
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
        Logout
      </h1>
      <p
        style={{
          fontSize: "13px",
          color: "#cbd5e1",
          marginTop: 0,
          marginBottom: "8px"
        }}
      >
        Anda sedang keluar dari sesi simulasi.
      </p>
      <p
        style={{
          fontSize: "12px",
          color: "#9ca3af",
          marginTop: 0
        }}
      >
        Data login simulasi telah dibersihkan. Anda akan dialihkan ke halaman
        beranda sesaat lagi…
      </p>
    </div>
  );
}
