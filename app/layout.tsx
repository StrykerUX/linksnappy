import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LinkSnappy - Snap your links, share instantly',
  description: 'A modern URL shortener with analytics. Create short links, track clicks, and share them with QR codes.',
  keywords: 'url shortener, link shortener, short links, qr code, analytics',
  authors: [{ name: 'Abraham Stryker' }],
  creator: 'Abraham Stryker',
  openGraph: {
    title: 'LinkSnappy - Snap your links, share instantly',
    description: 'A modern URL shortener with analytics. Create short links, track clicks, and share them with QR codes.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkSnappy - Snap your links, share instantly',
    description: 'A modern URL shortener with analytics. Create short links, track clicks, and share them with QR codes.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-600 to-accent-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold gradient-text">LinkSnappy</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <nav className="hidden md:flex space-x-6">
                    <a href="/" className="text-gray-700 hover:text-brand-600 transition-colors">Home</a>
                    <a href="/analytics" className="text-gray-700 hover:text-brand-600 transition-colors">Analytics</a>
                  </nav>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>by</span>
                    <a href="https://imstryker.com" className="font-medium text-brand-600 hover:text-brand-700">@abraham.stryker</a>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  © 2024 LinkSnappy. Built with ❤️ by Abraham Stryker
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Snap your links, share instantly
                </p>
                <div className="mt-4 flex justify-center space-x-6">
                  <a href="https://github.com/strykerux" className="text-gray-500 hover:text-brand-600 transition-colors text-xs">
                    GitHub
                  </a>
                  <a href="https://imstryker.com" className="text-gray-500 hover:text-brand-600 transition-colors text-xs">
                    Website
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}