import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PCR System MDRRMO",
    template: "%s | MDRRMO Carigara",
  },
  description:
    "The official PCR System of MDRRMO Carigara for securely managing, recording, and reviewing emergency incidents, disaster responses, and agency reports.",
  keywords: [
    "MDRRMO Carigara",
    "PCR System",
    "Emergency Records",
    "Incident Logs",
    "Disaster Reports",
    "Emergency Management",
    "Leyte Government",
    "Carigara MDRRMO",
    "Philippines Disaster Records",
    "Emergency Response Records",
  ],
  authors: [{ name: "MDRRMO Carigara", url: "https://pcrsystem.vercel.app" }],
  creator: "MDRRMO Carigara",
  publisher: "Municipal Government of Carigara",
  metadataBase: new URL("https://pcrsystem.vercel.app"),
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "PCR System MDRRMO",
    description:
      "MDRRMO Carigara’s official system for documenting emergency reports, monitoring response efforts, and analyzing disaster records.",
    url: "https://pcrsystem.vercel.app",
    siteName: "PCR System | MDRRMO Carigara",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PCR System MDRRMO - Emergency Records",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PCR System MDRRMO",
    description:
      "Secure and organized emergency report records by MDRRMO Carigara.",
    images: ["/og-image.png"],
  },
  category: "Government",
};

export const viewport = {
  themeColor: "#006241",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
