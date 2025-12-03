export default function HomePage() {
  return (
    <div className="dt-container">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          alignItems: "center",
        }}
      >
        {/* Kiri: Hero Text */}
        <section style={{ flex: "1 1 260px", minWidth: 0 }}>
          <span className="dt-badge dt-badge-gold">Management Investasi</span>

          <h1
            style={{
              marginTop: 12,
              marginBottom: 8,
              fontSize: 26,
              lineHeight: 1.2,
              color: "#fbbf24",
            }}
          >
            DANATAMA MAKMUR
            <br />
            SEKURITAS
          </h1>

          <p className="dt-soft" style={{ fontSize: 14, maxWidth: 460 }}>
            Platform management investasi — pilih produk saham &amp; instrumen
            lainnya secara edukatif, aman, dan terstruktur dalam aplikasi
            sekuritas profesional.
          </p>

          <div
            className="dt-flex dt-flex-wrap dt-gap-2 dt-mt-3"
            style={{ maxWidth: 400 }}
          >
            <a href="/products" className="dt-btn dt-btn-primary">
              Mulai Lihat Produk
            </a>

            <a href="/wallet" className="dt-btn dt-btn-outline">
              Kelola Dompet Simulasi
            </a>
          </div>

          <p className="dt-muted dt-mt-3" style={{ fontSize: 11, maxWidth: 460 }}>
            Catatan: Aplikasi ini bersifat{" "}
            <strong>management edukatif</strong>. Terhubung dengan Bursa
            Efek Indonesia dan sistem transaksi sekuritas nyata.
          </p>
        </section>

        {/* Kanan: Kartu info */}
        <section style={{ flex: "1 1 260px", minWidth: 240, maxWidth: 380 }}>
          <div className="dt-card">
            <h2 className="dt-card-title">Kenapa management di Danatama?</h2>
            <p className="dt-card-sub dt-mt-1">
              Lingkungan belajar saham yang mudah dan menyenangkan.
            </p>
            <ul
              style={{
                paddingLeft: 18,
                marginTop: 12,
                marginBottom: 0,
                fontSize: 13,
                color: "#cbd5e1",
              }}
            >
              <li>Belajar membeli saham, reksadana, dan obligasi secara management.</li>
              <li>Dompet virtual terpisah — melatih pengelolaan risiko & modal.</li>
              <li>Portofolio edukatif: pantau performa di pasar sungguhan.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
