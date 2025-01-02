'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useMediaContext } from '../../context/MediaContext'

export default function ResultPage() {
  const { processedUrl, file } = useMediaContext()
  const router = useRouter()

  useEffect(() => {
    if (!processedUrl) {
      router.push('/')
    }
  }, [processedUrl, router])

  const handleGoBack = () => {
    router.push('/editor')
  }

  if (!processedUrl) {
    return null
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Processed Media</h1>
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Result</h2>
            {file?.type.startsWith('image/') ? (
              <img src={processedUrl} alt="Processed" className="max-w-full h-auto rounded-md" />
            ) : (
              <video src={processedUrl} controls className="max-w-full h-auto rounded-md"></video>
            )}
          </div>
          <div className="flex space-x-4">
            <a href={processedUrl} download={`processed_${file?.name || 'media'}`} className="flex-1">
              <Button variant="outline" className="w-full">Download</Button>
            </a>
            <Button onClick={handleGoBack} className="flex-1">Go Back</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

