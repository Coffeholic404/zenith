"use client";
import { Cairo } from "next/font/google";
import "./globals.css";
import ProviderAuth from "@/components/Provider/Provider";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import store from "@/store/index";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.className} min-h-screen max-h-screen overflow-y-hidden`}
      >
        <SessionProvider>
          <Provider store={store}>
            <ProviderAuth>{children}</ProviderAuth>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
