import type { Metadata } from "next";
import { Roboto, Anton } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
});

const anton = Anton({
  weight: '400',
  variable: '--font-anton',
  subsets: ['latin', 'vietnamese'],
});

export const metadata: Metadata = {
  title: "Drinking Game",
  description: "Không say không về",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${anton.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
