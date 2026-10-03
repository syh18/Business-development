import "./globals.css";

export const metadata = {
  title: "Bisniz — Business Development System",
  description: "Teman mulai bisnis untuk menghitung HPP, harga jual, penjualan, dan analisis bisnis."
};

export default function RootLayout({ children }) {
  return <html lang="id"><body>{children}</body></html>;
}
