import './globals.css'

import type { Metadata } from 'next'

import { Providers } from '@/app/providers'

export const metadata: Metadata = {
  title: 'Next RBAC',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
