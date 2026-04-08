import type { Metadata } from 'next'
import { DM_Mono, Instrument_Sans } from 'next/font/google'
import './globals.css'

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
})

const instrumentSans = Instrument_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-instrument',
})

export const metadata: Metadata = {
  title: 'meghana appidi',
  description: 'creative technologist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${dmMono.variable} ${instrumentSans.variable}`}>
        {children}
      </body>
    </html>
  )
}
