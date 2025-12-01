<nav
  style={{
    display: "flex",
    gap: "16px",
    fontSize: "13px",
    alignItems: "center"
  }}
>
  <a href="/" style={navLink}>Beranda</a>
  <a href="/products" style={navLink}>Produk</a>
  <a href="/services" style={navLink}>Layanan</a>

  {/* REGISTER */}
  <a
    href="/register"
    style={{
      textDecoration: "none",
      color: "#111827",
      backgroundColor: "#facc15",
      padding: "8px 14px",
      borderRadius: "999px",
      fontWeight: 600
    }}
  >
    Daftar
  </a>

  {/* LOGIN */}
  <a
    href="/login"
    style={{
      textDecoration: "none",
      color: "#111827",
      backgroundColor: "#fbbf24",
      padding: "8px 14px",
      borderRadius: "999px",
      fontWeight: 600
    }}
  >
    Login
  </a>
</nav>
