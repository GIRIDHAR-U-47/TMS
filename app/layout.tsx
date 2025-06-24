import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Training Management System',
  description: 'Created By Giridhar Uppili',
  generator: 'giridharuppili.netlify.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
