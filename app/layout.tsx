import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vel Tech University | CEMS",
  description: "College Event Management System — Vel Tech University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col relative"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {/* Ambient glow orbs — purely decorative, pointer-events off */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          {/* Top-left violet orb */}
          <div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          {/* Bottom-right cyan orb */}
          <div
            className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          {/* Center subtle orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-5"
            style={{
              background:
                "radial-gradient(ellipse, var(--primary-light) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        {/* Page content sits above the orbs */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>

        {/* Subtle grid overlay for texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(var(--border) 1px, transparent 1px),
              linear-gradient(90deg, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </body>
    </html>
  );
}