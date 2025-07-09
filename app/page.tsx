'use client'

import { useState } from 'react'
import { Link, Copy, QrCode, BarChart3, Zap, Shield, Globe } from 'lucide-react'

interface ShortenedUrl {
  shortCode: string
  shortUrl: string
  originalUrl: string
  qrCode: string
  createdAt: string
}

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL')
      }

      setShortenedUrl(data)
      setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-brand-600 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="gradient-text">LinkSnappy</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Snap your links, share instantly. Create short URLs with powerful analytics and QR codes.
            </p>

            {/* URL Shortener Form */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleShorten} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/your-long-url"
                    className="input-primary flex-1 text-lg"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !url || !isValidUrl(url)}
                    className="btn-primary text-lg px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Snapping...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Link className="w-5 h-5" />
                        <span>Snap It!</span>
                      </div>
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}
              </form>

              {/* Result Card */}
              {shortenedUrl && (
                <div className="card mt-8 animate-slide-up">
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full checkmark-animation"></div>
                      </div>
                      <span className="font-semibold">Link Snapped Successfully!</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Your Short URL</label>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex-1 bg-gray-50 rounded-lg p-3 font-mono text-brand-600 text-lg">
                            {shortenedUrl.shortUrl}
                          </div>
                          <button
                            onClick={() => handleCopy(shortenedUrl.shortUrl)}
                            className="p-3 text-gray-500 hover:text-brand-600 transition-colors"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 items-center">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700">Original URL</label>
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-600 text-sm truncate">
                            {shortenedUrl.originalUrl}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2">
                          <label className="text-sm font-medium text-gray-700">QR Code</label>
                          <div className="bg-white p-2 rounded-lg shadow-sm">
                            <img 
                              src={shortenedUrl.qrCode} 
                              alt="QR Code" 
                              className="w-16 h-16"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <a
                          href={`/analytics/${shortenedUrl.shortCode}`}
                          className="btn-secondary text-sm"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </a>
                        <button
                          onClick={() => handleCopy(shortenedUrl.qrCode)}
                          className="btn-secondary text-sm"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Copy QR Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/60 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LinkSnappy?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              More than just a URL shortener. Get powerful features to track, analyze, and share your links.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card card-hover text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Create short links instantly with our optimized servers. No delays, no hassle.
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">
                Track clicks, monitor performance, and understand your audience with comprehensive analytics.
              </p>
            </div>

            <div className="card card-hover text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">QR Code Generation</h3>
              <p className="text-gray-600">
                Get instant QR codes for all your short links. Perfect for offline marketing and sharing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Success Toast */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span>Copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  )
}