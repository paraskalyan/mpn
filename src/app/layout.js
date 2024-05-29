import { Inter, Montaga } from "next/font/google";
import { Monoton } from "next/font/google";
import "./globals.css";
// import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const monton = Monoton({
  subsets: ["latin"],
  weight: '400',
  display: 'swap',
  variable: '--font-monton'

})


export const metadata = {
  title: "MPN MAKE",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${monton.variable}`}>
        {/* <AuthProvider> */}

        {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
