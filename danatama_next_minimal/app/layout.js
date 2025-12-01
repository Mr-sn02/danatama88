export default function HomePage() {
  return (
    <>
      <h1
        style={{
          color: "#fbbf24",
          marginTop: 0,
          marginBottom: "8px",
          fontSize: "26px"
        }}
      >
        DANATAMA MAKMUR SEKURITAS
      </h1>
      <p
        style={{
          color: "#cbd5e1",
          marginBottom: "20px",
          fontSize: "14px"
        }}
      >
        Platform simulasi investasi — pilih produk saham & instrumen lainnya
        secara edukatif.
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
          textDecoration: "none",
          fontSize: "14px"
        }}
      >
        Mulai Lihat Produk
      </a>
    </>
  );
}
