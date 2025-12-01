export default function HomePage() {
  return (
    <>
      <h1
        style={{
          color: "#fbbf24",
          marginTop: 0,
          fontSize: "26px",
          marginBottom: "8px"
        }}
      >
        DANATAMA MAKMUR SEKURITAS
      </h1>
      <p style={{ fontSize: "14px", marginBottom: "8px", color: "#cbd5f5" }}>
        Halaman Next.js paling sederhana untuk mengecek bahwa setting GitHub →
        Vercel sudah benar.
      </p>
      <p style={{ fontSize: "14px", marginBottom: "8px" }}>
        Jika kamu melihat halaman ini di domain Vercel, berarti:
      </p>
      <ul
        style={{
          fontSize: "14px",
          paddingLeft: "20px",
          marginTop: 0,
          marginBottom: "8px"
        }}
      >
        <li>Project sudah terhubung ke repository GitHub dengan benar.</li>
        <li>Root Directory dan konfigurasi build di Vercel sudah sesuai.</li>
        <li>Next.js sudah terdeteksi karena ada package.json dan app/page.js.</li>
      </ul>
      <p style={{ fontSize: "13px", color: "#9ca3af" }}>
        Setelah ini, kita bisa ganti halaman ini menjadi e-commerce bertema
        investasi DANATAMA MAKMUR SEKURITAS.
      </p>
    </>
  );
}
