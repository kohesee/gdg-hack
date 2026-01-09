import '@/app/globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'GDG Sprint 1',
  description: 'Next.js with Tailwind CSS and Firebase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-50">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
