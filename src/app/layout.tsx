import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trainify — AI-Powered Fitness Companion",
  description:
    "Transform your fitness journey with AI-powered personalized workout plans, diet guidance, progress tracking, and expert coaching.",
  keywords: ["fitness", "AI", "workout", "diet", "personal trainer"],
  openGraph: {
    title: "Trainify — AI-Powered Fitness Companion",
    description:
      "Personalized workout plans, smart diet guidance, and real-time progress tracking powered by AI.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}