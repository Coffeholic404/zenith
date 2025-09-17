import { Cairo } from "next/font/google";
import "../../globals.css"; // Ensure global styles are imported
import { ThemeProvider } from "@/components/layout/theme-provider";
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return ( 
      <div
        className={`${cairo.className} flex w-screen  h-screen  items-center justify-center    `}
      >
        <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      ><div className="w-full h-full  bg-white shadow-md rounded-lg  ">
          {children}
        </div></ThemeProvider>
        
      </div> 
  );
}
