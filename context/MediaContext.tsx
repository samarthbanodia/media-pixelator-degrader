'use client'

import React, { createContext, useState, useContext } from 'react'

interface MediaContextType {
  file: File | null
  setFile: (file: File | null) => void
  processedUrl: string | null
  setProcessedUrl: (url: string | null) => void
  pixelSize: number
  setPixelSize: (size: number) => void
  quality: number
  setQuality: (quality: number) => void
  processProgress: number
  setProcessProgress: (progress: number) => void
}

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [file, setFile] = useState<File | null>(null)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [pixelSize, setPixelSize] = useState(10)
  const [quality, setQuality] = useState(80)
  const [processProgress, setProcessProgress] = useState(0)

  return (
    <MediaContext.Provider value={{
      file, setFile,
      processedUrl, setProcessedUrl,
      pixelSize, setPixelSize,
      quality, setQuality,
      processProgress, setProcessProgress
    }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMediaContext() {
  const context = useContext(MediaContext)
  if (!context) throw new Error('useMediaContext must be used within MediaProvider')
  return context
} 