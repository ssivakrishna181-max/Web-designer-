import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SK — I AM A DESIGNER",
  description: "Cinematic 3D portfolio of a graphic designer.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
