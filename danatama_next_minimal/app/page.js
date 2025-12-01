export default function HomePage() {
  return (
    <>
      <h1 style={{ color: "#fbbf24", marginTop: 0 }}>
        DANATAMA MAKMUR SEKURITAS
      </h1>

      <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
        Platform simulasi investasi — pilih produk saham & instrumen lainnya.
      </p>

      <a
        href="/products"
        style={{
          display: "inline-block",
          background: "#fbbf24",
          color: "#111",
          padding: "12px 20px",
          borderRadius: "10px",
          fontWeight: "bold",
          textDecoration: "none"
        }}
      >
        Mulai Lihat Produk
      </a>
    </>
  );
}
