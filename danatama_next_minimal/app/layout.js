export const metadata = {
  title: "DANATAMA MAKMUR SEKURITAS",
  description: "Halaman Next.js paling simpel untuk testing Vercel"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        style={{
          backgroundColor: "#0f172a",
          color: "#e2e8f0",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          margin: 0,
          padding: "40px"
        }}
      >
        <main
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "24px",
            backgroundColor: "#020617",
            borderRadius: "16px",
            border: "1px solid #1f2937"
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
