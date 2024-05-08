import type { Metadata } from "next";
import Layout from "@/sections/layout";

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
      <body className=" bg-[#f7f7f7]">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
