'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, AlertCircle, BarChart3 } from 'lucide-react'

interface RedirectPageProps {
  params: Promise<{
    shortCode: string
  }>
}

export default function RedirectPage({ params }: RedirectPageProps) {
  const { shortCode } = React.use(params)
  const router = useRouter()
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const redirect = async () => {
      try {
        const response = await fetch(`/api/redirect/${shortCode}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'URL not found')
        }

        setUrl(data.redirectUrl)
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              window.location.href = data.redirectUrl
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    redirect()
  }, [shortCode])

  const handleManualRedirect = () => {
    if (url) {
      window.location.href = url
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full mx-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Finding your link...</h2>
          <p className="text-gray-600">Please wait while we locate your destination</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md w-full mx-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-brand-600 to-accent-600 rounded-full flex items-center justify-center animate-pulse">
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {countdown}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600 mb-6">
          You will be redirected to your destination in {countdown} seconds
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">Destination:</p>
            <p className="text-brand-600 font-medium break-all">{url}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleManualRedirect}
              className="btn-primary flex-1"
            >
              Go Now
            </button>
            <button
              onClick={() => router.push(`/analytics/${shortCode}`)}
              className="btn-secondary flex-1"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </button>
          </div>

          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Create your own short link
          </button>
        </div>
      </div>
    </div>
  )
}