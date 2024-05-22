import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SuiPad",
  description: "SuiPad Airdrop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-[Arial] bg-[#f7f7f7]">
        {children}
      </body>
    </html>
  );
}
