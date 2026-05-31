"use client"; // Add this line for client-side functionality

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThreeCarLoader from "@/components/ThreeCarLoader"; // Import the loader
import { useState, useEffect } from "react"; // Import useState and useEffect

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata needs to be moved to a separate server component or static file
// if this layout is "use client" as it cannot be exported from a client component.
// For now, removing to avoid errors.
// export const metadata: Metadata = {
//   title: "Calculate Incenitve",
//   description: "Incentive Calculator",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Detect system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    handleChange(); // Set initial theme
    mediaQuery.addEventListener('change', handleChange); // Listen for changes

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Simulate initial loading time, e.g., fetching user data or initial content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Show loader for 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${theme === 'dark' ? 'dark' : ''}`}
    >
      <body className="min-h-full flex flex-col">
        <ThreeCarLoader isLoading={isLoading} />
        {children}
      </body>
    </html>
  );
}
