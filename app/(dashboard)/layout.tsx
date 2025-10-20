import type React from "react";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "لوحة التحكم | Next.js 14 RTL",
  description: "لوحة تحكم عربية حديثة مبنية باستخدام Next.js 14 و Tailwind CSS",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="ar" dir="rtl" suppressHydrationWarning>
    
    <div
      className={`${cairo.className} min-h-screen max-h-screen  overflow-hidden`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <SidebarProvider>
            <div className="flex min-h-screen max-h-screen overflow-hidden  bg-mainBg">
              <AppSidebar />
              <div className="flex flex-col gap-1 flex-1 min-h-screen max-h-screen overflow-hidden">
                <AppHeader />
                <main className="flex-1 p-6  border-t  overflow-y-scroll bg-mainBg">
                  {children}
                </main>
                {/* <AppFooter /> */}
              </div>
            </div>
          </SidebarProvider>
        </TooltipProvider>
        <Toaster />
      </ThemeProvider>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const colorTheme = localStorage.getItem('color-theme');
                if (colorTheme) {
                  document.documentElement.classList.add('theme-' + colorTheme);
                } else {
                  document.documentElement.classList.add('theme-blue');
                }
              } catch (e) {
                console.error('Color theme initialization failed:', e);
              }
            })();
          `,
        }}
      />
    </div>
    // </html>
  );
}
