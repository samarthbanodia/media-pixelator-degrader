'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { Loader2 } from 'lucide-react'
import { useMediaContext } from '@/context/MediaContext'

export default function LoadingPage() {
  const router = useRouter()
  const { processProgress } = useMediaContext()

  useEffect(() => {
    if (processProgress === 100) {
      setTimeout(() => {
        router.push('/result')
      }, 500)
    }
  }, [processProgress, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container max-w-lg mx-auto p-8">
        <div className="text-center space-y-6">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Processing Your Media</h2>
          <div className="space-y-2">
            <Progress value={processProgress} className="w-full h-3" />
            <p className="text-sm text-muted-foreground">
              {Math.round(processProgress)}% Complete
            </p>
          </div>
          <p className="text-muted-foreground">
            Please wait while we process your file. This may take a moment for larger files.
          </p>
        </div>
      </div>
    </div>
  )
} 