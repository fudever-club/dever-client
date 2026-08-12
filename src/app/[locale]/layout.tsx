import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import Providers from "@/providers";

const deverSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FU - DEVER",
  description: "Fu-Dever dashboard cho thành viên",
  icons: "/icons/layout/fu-dever-logo.png",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  return (
    <html lang={params?.locale || "vi"}>
      <body className={deverSans.className} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
