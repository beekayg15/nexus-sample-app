import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";


const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bulls and Cows",
  description: "Bulls and Cows Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className= {`${lato.variable} antialiased bg-black text-white`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
