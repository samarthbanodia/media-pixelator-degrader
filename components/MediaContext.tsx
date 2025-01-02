'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'

interface MediaContextType {
  file: File | null
  setFile: (file: File | null) => void
  pixelSize: number
  setPixelSize: (size: number) => void
  quality: number
  setQuality: (quality: number) => void
  processedUrl: string | null
  setProcessedUrl: (url: string | null) => void
}

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export function MediaProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null)
  const [pixelSize, setPixelSize] = useState(10)
  const [quality, setQuality] = useState(50)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)

  return (
    <MediaContext.Provider value={{
      file, setFile,
      pixelSize, setPixelSize,
      quality, setQuality,
      processedUrl, setProcessedUrl
    }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMediaContext() {
  const context = useContext(MediaContext)
  if (context === undefined) {
    throw new Error('useMediaContext must be used within a MediaProvider')
  }
  return context
}

