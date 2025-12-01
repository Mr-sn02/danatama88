export const metadata = {
  title: "PT. DANATAMA MAKMUR SEKURITAS",
  description: "Simulasi e-commerce investasi Danatama Makmur Sekuritas"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        style={{
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          margin: 0,
          minHeight: "100vh"
        }}
      >
        {/* HEADER */}
        <header
          style={{
            borderBottom: "1px solid #1f2937",
            padding: "12px 24px",
            backgroundColor: "#020617",
            position: "sticky",
            top: 0,
            zIndex: 20
          }}
        >
          <div
            style={{
              maxWidth: "960px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px"
            }}
          >
            {/* Logo + nama */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src="/logo-danata.png"
                alt="Logo PT. DANATAMA MAKMUR SEKURITAS"
                style={{ height: "55px", objectFit: "contain" }}
              />
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#facc15"
                  }}
                >
                  PT. DANATAMA MAKMUR SEKURITAS
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#9ca3af"
                  }}
                >
                  MEMBER OF INDONESIA STOCK EXCHANGE
                </div>
              </div>
            </div>

            {/* NAV MENU */}
            <nav
              style={{
                display: "flex",
                gap: "16px",
                fontSize: "13px"
              }}
            >
              <a
                href="/"
                style={{
                  textDecoration: "none",
                  color: "#e5e7eb"
                }}
              >
                Beranda
              </a>
              <a
                href="/products"
                style={{
                  textDecoration: "none",
                  color: "#e5e7eb"
                }}
              >
                Produk
              </a>
            </nav>
          </div>
        </header>

        {/* KONTEN UTAMA */}
        <main
          style={{
            maxWidth: "960px",
            margin: "24px auto",
            padding: "0 24px 32px 24px"
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
