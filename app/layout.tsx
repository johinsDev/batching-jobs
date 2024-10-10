import type { Metadata, Viewport } from "next"
import { JetBrains_Mono as FontMono, Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

export const metadata: Metadata = {
  title: "Finance App",
  description: "The best finance app in the world",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontSans = Inter({
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
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
