import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plaster Bust Generator",
  description: "Transform photos into artistic plaster bust sculptures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
