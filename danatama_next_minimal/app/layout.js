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

  // Halaman depan (landing) hanya di path "/"
  const isLanding = pathname === "/";

  const navLink = {
    textDecoration: "none",
    color: "#e5e7eb",
    fontSize: "13px",
    padding: "6px 10px",
    borderRadius: "999px",
    whiteSpace: "nowrap"
  };

  return (
    <html lang="id">
      <body>
        {/* NAVBAR ATAS */}
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

            {/* Tengah: menu utama */}
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                overflowX: "auto",
                padding: "4px 0",
                flex: 1
              }}
            >
              {/* Landing page: hanya Beranda */}
              {isLanding && (
                <a href="/" style={navLink}>
                  Beranda
                </a>
              )}

              {/* Dashboard: tampil menu lengkap */}
              {!isLanding && (
                <>
                  <a href="/" style={navLink}>
                    Beranda
                  </a>
                  <a href="/products" style={navLink}>
                    Produk
                  </a>
                  <a href="/services" style={navLink}>
                    Layanan
                  </a>
                  <a href="/portfolio-history" style={navLink}>
                    Portofolio
                  </a>
                  <a href="/wallet" style={navLink}>
                    Dompet
                  </a>
                  <a href="/profile" style={navLink}>
                    Profil
                  </a>
                </>
              )}
            </nav>

            {/* Kanan: tombol CS + auth */}
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

              {/* Jika belum login → tampil Daftar & Login */}
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

              {/* Jika sudah login → hanya tombol Logout */}
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

        {/* KONTEN UTAMA */}
        <main
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            padding: "16px 10px 32px 10px",
            boxSizing: "border-box"
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
