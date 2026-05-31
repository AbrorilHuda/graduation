import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Informatics '22 | Digital Yearbook & Memorial Platform",
  description: "Step into the official digital yearbook and graduation journey platform for the Informatics Class of 2022. Reconnect with fellow graduates, explore thesis milestones, and unlock memorable highlights of our coding years.",
  keywords: ["Informatics 22", "University Yearbook", "Class of 2022", "Digital Memorial", "Graduation Archive", "S.Kom"],
  authors: [{ name: "Informatics Class of 2022" }],
  openGraph: {
    title: "Informatics '22 | Digital Yearbook & Memorial Platform",
    description: "The official graduation journey archive for the Informatics Class of 2022. A tribute to friendship, relentless struggle, innovation, and memories.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020205",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased dark">
      <body className="min-h-full flex flex-col bg-void text-zinc-100 selection:bg-neon-purple/30 selection:text-neon-cyan">
        {children}
      </body>
    </html>
  );
}
