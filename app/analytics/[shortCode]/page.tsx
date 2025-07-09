'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  ExternalLink, 
  Calendar, 
  MousePointer, 
  QrCode,
  Copy,
  ArrowLeft,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

interface AnalyticsData {
  shortCode: string
  originalUrl: string
  clicks: number
  createdAt: string
  lastAccessed: string | null
}

interface AnalyticsPageProps {
  params: {
    shortCode: string
  }
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { shortCode } = params
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [urlData, setUrlData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch analytics data
        const [analyticsResponse, urlResponse] = await Promise.all([
          fetch(`/api/analytics/${shortCode}`),
          fetch(`/api/url/${shortCode}`)
        ])

        const analyticsData = await analyticsResponse.json()
        const urlData = await urlResponse.json()

        if (!analyticsResponse.ok) {
          throw new Error(analyticsData.error || 'Failed to fetch analytics')
        }

        if (!urlResponse.ok) {
          throw new Error(urlData.error || 'Failed to fetch URL data')
        }

        setAnalytics(analyticsData.analytics)
        setUrlData(urlData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [shortCode])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full mx-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Analytics...</h2>
          <p className="text-gray-600">Fetching your link data</p>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full mx-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load analytics data'}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="btn-primary w-full"
            >
              Create New Link
            </button>
            <button
              onClick={() => router.back()}
              className="btn-secondary w-full"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const shortUrl = `${window.location.origin}/${shortCode}`

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-600 to-accent-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Link Analytics</h1>
              <p className="text-gray-600">Detailed insights for your short link</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="card text-center">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MousePointer className="w-6 h-6 text-brand-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {analytics.clicks.toLocaleString()}
                </div>
                <p className="text-gray-600">Total Clicks</p>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-accent-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {analytics.clicks > 0 ? 'Active' : 'Inactive'}
                </div>
                <p className="text-gray-600">Status</p>
              </div>
            </div>

            {/* Link Details */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Link Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Short URL</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-gray-50 rounded-lg p-3 font-mono text-brand-600">
                      {shortUrl}
                    </div>
                    <button
                      onClick={() => handleCopy(shortUrl)}
                      className="p-3 text-gray-500 hover:text-brand-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Original URL</label>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-gray-50 rounded-lg p-3 text-gray-600 text-sm break-all">
                      {analytics.originalUrl}
                    </div>
                    <a
                      href={analytics.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-gray-500 hover:text-brand-600 transition-colors"
                      title="Visit original URL"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created</label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(analytics.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTimeAgo(analytics.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Accessed</label>
                    <div className="flex items-center space-x-2 mt-2">
                      <MousePointer className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {analytics.lastAccessed 
                          ? formatDate(analytics.lastAccessed)
                          : 'Never'
                        }
                      </span>
                    </div>
                    {analytics.lastAccessed && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getTimeAgo(analytics.lastAccessed)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            {urlData?.qrCode && (
              <div className="card text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
                  <img 
                    src={urlData.qrCode} 
                    alt="QR Code" 
                    className="w-32 h-32 mx-auto"
                  />
                </div>
                <button
                  onClick={() => handleCopy(urlData.qrCode)}
                  className="btn-secondary mt-4 w-full"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Copy QR Code
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={`/${shortCode}`}
                  className="btn-primary w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Link
                </a>
                <button
                  onClick={() => router.push('/')}
                  className="btn-secondary w-full"
                >
                  Create New Link
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Click Rate</span>
                  <span className="font-semibold">
                    {analytics.clicks > 0 ? 'Good' : 'New'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${analytics.clicks > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    {analytics.clicks > 0 ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Short Code</span>
                  <span className="font-mono text-sm">{shortCode}</span>
                </div>
              </div>
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