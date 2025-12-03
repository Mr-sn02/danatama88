"use client";

import "./globals.css";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getUser();
      setLoggedIn(!!data?.user);
      setChecking(false);
    }
    checkSession();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    router.push("/login");
  }

  const navLink = {
    textDecoration: "none",
    color: "#e5e7eb",
    fontSize: "13px",
    padding: "6px 10px",
    borderRadius: "999px",
    whiteSpace: "nowrap"
  };

  // Halaman yang tidak perlu bottom nav (login/register/admin)
  const hideBottomNav =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/admin");

  return (
    <html lang="id">
      <body>
        {/* ===== TOP BAR (LOGO + CS + AUTH) ===== */}
        <header
          style={{
            borderBottom: "1px solid #111827",
            backgroundColor: "rgba(2,6,23,0.96)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 40
          }}
        >
          <div
            style={{
              maxWidth: "1040px",
              margin: "0 auto",
              padding: "10px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              boxSizing: "border-box"
            }}
          >
            {/* Kiri: Logo + nama perusahaan */}
            <a
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none"
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  position: "relative"
                }}
              >
                <Image
                  src="/logo-danata.png"
                  alt="Logo PT. DANATAMA MAKMUR SEKURITAS"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#fbbf24",
                    fontWeight: 700
                  }}
                >
                  PT. DANATAMA MAKMUR
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#9ca3af"
                  }}
                >
                  Member of Indonesia Stock Exchange
                </div>
              </div>
            </a>

            {/* Kanan: CS + Auth */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              {/* Customer Service WhatsApp */}
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                style={{
                  ...navLink,
                  backgroundColor: "#22c55e",
                  color: "#0f172a",
                  fontWeight: 600
                }}
              >
                CS
              </a>

              {/* Belum login → Daftar & Login */}
              {!checking && !loggedIn && (
                <>
                  <a
                    href="/register"
                    style={{
                      ...navLink,
                      backgroundColor: "#facc15",
                      color: "#111827",
                      fontWeight: 600
                    }}
                  >
                    Daftar
                  </a>
                  <a
                    href="/login"
                    style={{
                      ...navLink,
                      backgroundColor: "#fbbf24",
                      color: "#111827",
                      fontWeight: 600
                    }}
                  >
                    Login
                  </a>
                </>
              )}

              {/* Sudah login → Logout */}
              {!checking && loggedIn && (
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    borderRadius: "999px",
                    padding: "6px 12px",
                    border: "1px solid #e5e7eb33",
                    backgroundColor: "transparent",
                    color: "#e5e7eb",
                    fontSize: "12px",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ===== KONTEN UTAMA ===== */}
        <main
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            padding: "16px 10px 80px 10px", // ekstra space bawah untuk bottom nav
            boxSizing: "border-box"
          }}
        >
          {children}
        </main>

        {/* ===== BOTTOM NAVIGATION (BERANDA, PRODUK, LAYANAN, DOMPET, PROFIL) ===== */}
        {!hideBottomNav && (
          <nav
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: "62px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "rgba(2,6,23,0.96)",
              borderTop: "1px solid #1f2937",
              backdropFilter: "blur(10px)",
              zIndex: 100
            }}
          >
            {/* Beranda */}
            <a
              href="/"
              style={{
                textAlign: "center",
                fontSize: "12px",
                textDecoration: "none",
                color: pathname === "/" ? "#facc15" : "#e5e7eb"
              }}
            >
              <div style={{ fontSize: "20px" }}>🏠</div>
              Beranda
            </a>

            {/* Produk */}
            <a
              href="/products"
              style={{
                textAlign: "center",
                fontSize: "12px",
                textDecoration: "none",
                color: pathname === "/products" ? "#facc15" : "#e5e7eb"
              }}
            >
              <div style={{ fontSize: "20px" }}>📦</div>
              Produk
            </a>

            {/* Layanan */}
            <a
              href="/services"
              style={{
                textAlign: "center",
                fontSize: "12px",
                textDecoration: "none",
                color: pathname === "/services" ? "#facc15" : "#e5e7eb"
              }}
            >
              <div style={{ fontSize: "20px" }}>🪙</div>
              Layanan
            </a>

            {/* Dompet */}
            <a
              href="/wallet"
              style={{
                textAlign: "center",
                fontSize: "12px",
                textDecoration: "none",
                color: pathname === "/wallet" ? "#facc15" : "#e5e7eb"
              }}
            >
              <div style={{ fontSize: "20px" }}>💰</div>
              Dompet
            </a>

            {/* Profil */}
            <a
              href="/profile"
              style={{
                textAlign: "center",
                fontSize: "12px",
                textDecoration: "none",
                color: pathname === "/profile" ? "#facc15" : "#e5e7eb"
              }}
            >
              <div style={{ fontSize: "20px" }}>👤</div>
              Profil
            </a>
          </nav>
        )}
      </body>
    </html>
  );
}
