import type { Metadata, Viewport } from "next"
import { JetBrains_Mono as FontMono, Inter } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
import Providers from "@/components/providers"

import "./globals.css"

export const metadata: Metadata = {
  title: "Job batching App",
  description: "The best job batching app in the world",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
