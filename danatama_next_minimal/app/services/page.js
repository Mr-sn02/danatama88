export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "Online Stock Trading (Equity)",
      badge: "Saham • BEI",
      description:
        "Layanan untuk jual–beli saham di Bursa Efek Indonesia (BEI) melalui platform Danatama.",
      points: [
        "Real-time market data",
        "Order buy / sell",
        "Watchlist saham pilihan",
        "Monitoring portfolio & profit / loss",
        "Chart & basic technical indicators"
      ]
    },
    {
      id: 2,
      title: "Margin Trading",
      badge: "Leverage",
      description:
        "Fasilitas pinjaman dana (margin) untuk melakukan transaksi saham dengan leverage terukur.",
      points: [
        "Limit margin tambahan sesuai profil risiko",
        "Daftar saham marginable yang disetujui",
        "Suku bunga margin kompetitif",
        "Monitoring risiko & posisi secara real-time",
        "Fitur auto-repay / auto-force sell sesuai ketentuan"
      ]
    },
    {
      id: 3,
      title: "Reksadana Online",
      badge: "Reksa Dana",
      description:
        "Pembelian dan penjualan reksadana secara online melalui platform Danatama.",
      points: [
        "Reksadana pasar uang (money market)",
        "Reksadana obligasi / fixed income",
        "Reksadana campuran (balanced fund)",
        "Reksadana saham (equity fund)"
      ]
    },
    {
      id: 4,
      title: "Obligasi & Fixed Income",
      badge: "Fixed Income",
      description:
        "Akses ke produk obligasi dan instrumen fixed income, baik pemerintah maupun korporasi.",
      points: [
        "Obligasi negara (ORI, SR, SBR, ST)",
        "Obligasi korporasi & sukuk",
        "Akses penawaran perdana (primary market)",
        "Transaksi di pasar sekunder (secondary market)"
      ]
    },
    {
      id: 5,
      title: "Investment Banking Support",
      badge: "Corporate",
      description:
        "Layanan untuk kebutuhan pendanaan dan aksi korporasi bagi klien institusi & korporasi.",
      points: [
        "Underwriting & penjaminan emisi efek",
        "Corporate advisory untuk struktur pendanaan",
        "Dukungan proses IPO dan aksi korporasi lainnya",
        "Koordinasi dengan regulator dan otoritas terkait"
      ],
      note:
        "Sebagian besar layanan ini tersedia melalui kantor pusat Danatama Makmur Sekuritas, bukan melalui aplikasi retail."
    },
    {
      id: 6,
      title: "Research & Market Insight",
      badge: "Riset Pasar",
      description:
        "Akses informasi riset dan update pasar untuk membantu pengambilan keputusan investasi.",
      points: [
        "Daily market update & ringkasan pergerakan indeks",
        "Stock recommendation (disclaimer on)",
        "Economic outlook & macro update",
        "Sector & thematic analysis"
      ]
    },
    {
      id: 7,
      title: "Laporan Portofolio & Tax Reporting",
      badge: "Laporan",
      description:
        "Kemudahan dalam mengakses laporan transaksi dan dokumen pendukung pelaporan pajak.",
      points: [
        "Laporan portofolio bulanan",
        "Rekaman transaksi yang dapat diunduh",
        "Dokumen pendukung untuk pelaporan pajak",
        "Riwayat aktivitas akun dalam periode tertentu"
      ]
    }
  ];

  return (
    <>
      <h1 style={{ color: "#fbbf24", marginTop: 0, marginBottom: "8px" }}>
        Layanan Danatama Makmur Sekuritas
      </h1>
      <p style={{ color: "#cbd5e1", marginBottom: "20px", fontSize: "14px" }}>
        Ringkasan jenis layanan investasi yang umumnya tersedia untuk nasabah
        Danatama Makmur Sekuritas, baik retail maupun korporasi.
      </p>

      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
        }}
      >
        {services.map((service) => (
          <article
            key={service.id}
            style={{
              backgroundColor: "#020617",
              borderRadius: "16px",
              border: "1px solid #1f2937",
              padding: "16px"
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: "#9ca3af",
                marginBottom: "6px"
              }}
            >
              ⭐ Layanan {service.id}
            </div>

            <h2
              style={{
                fontSize: "16px",
                margin: 0,
                marginBottom: "4px",
                color: "#fbbf24"
              }}
            >
              {service.title}
            </h2>

            <div
              style={{
                display: "inline-block",
                fontSize: "11px",
                padding: "4px 8px",
                borderRadius: "999px",
                border: "1px solid #334155",
                color: "#e5e7eb",
                marginBottom: "8px",
                backgroundColor: "#020617"
              }}
            >
              {service.badge}
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#cbd5e1",
                marginTop: 0,
                marginBottom: "8px"
              }}
            >
              {service.description}
            </p>

            <ul
              style={{
                fontSize: "13px",
                paddingLeft: "18px",
                margin: 0,
                marginBottom: service.note ? "8px" : 0,
                color: "#e5e7eb"
              }}
            >
              {service.points.map((point, idx) => (
                <li key={idx} style={{ marginBottom: "4px" }}>
                  {point}
                </li>
              ))}
            </ul>

            {service.note && (
              <p
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  marginTop: 0
                }}
              >
                {service.note}
              </p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
