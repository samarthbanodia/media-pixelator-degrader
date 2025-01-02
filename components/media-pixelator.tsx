'use client'

import { useRef, ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useMediaContext } from '../context/MediaContext'
import { Loader2 } from 'lucide-react'
import { pixelateGif } from '../utils/gifUtils'

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

export default function MediaPixelator() {
  const {
    file, setFile,
    pixelSize, setPixelSize,
    quality, setQuality,
    setProcessedUrl,
    processProgress, setProcessProgress
  } = useMediaContext()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setError(null)

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size must be less than 25MB`)
      return
    }

    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!supportedTypes.includes(selectedFile.type)) {
      setError('Unsupported file type. Please use JPG, PNG, or GIF files.')
      return
    }

    setFile(selectedFile)
  }

  const processMedia = async () => {
    if (!file) return
    setError(null)
    setIsProcessing(true)
    setProcessProgress(0)

    try {
      if (file.type === 'image/gif') {
        setProcessProgress(20)
        const processedUrl = await pixelateGif(file, pixelSize, quality)
        setProcessedUrl(processedUrl)
        setProcessProgress(100)
        router.push('/loading')
      } else {
        const img = new Image()
        
        // Create a promise to ensure image is fully loaded
        const imageLoadPromise = new Promise((resolve, reject) => {
          img.onload = () => resolve(img)
          img.onerror = () => reject(new Error('Failed to load image'))
        })

        // Set image source and wait for load
        img.src = URL.createObjectURL(file)
        await imageLoadPromise

        if (!canvasRef.current) {
          throw new Error('Canvas not initialized')
        }

        setProcessProgress(30)
        
        // Set canvas dimensions to match image
        canvasRef.current.width = img.naturalWidth
        canvasRef.current.height = img.naturalHeight
        
        const ctx = canvasRef.current.getContext('2d', { 
          willReadFrequently: true,
          alpha: true 
        })

        if (!ctx) {
          throw new Error('Could not get canvas context')
        }

        setProcessProgress(50)

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        
        // Draw original image
        ctx.drawImage(img, 0, 0)
        
        // Apply pixelation
        const scaleFactor = Math.max(0.01, pixelSize / 100)
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d', {
          willReadFrequently: true,
          alpha: true
        })
        
        if (!tempCtx) {
          throw new Error('Could not create temporary canvas context')
        }

        // Set temp canvas dimensions
        tempCanvas.width = Math.max(1, Math.floor(canvasRef.current.width * scaleFactor))
        tempCanvas.height = Math.max(1, Math.floor(canvasRef.current.height * scaleFactor))
        
        // Configure context
        tempCtx.imageSmoothingEnabled = true
        ctx.imageSmoothingEnabled = false
        
        // Draw scaled down
        tempCtx.drawImage(
          canvasRef.current,
          0, 0,
          canvasRef.current.width,
          canvasRef.current.height,
          0, 0,
          tempCanvas.width,
          tempCanvas.height
        )

        setProcessProgress(70)
        
        // Draw scaled up
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.drawImage(
          tempCanvas,
          0, 0,
          tempCanvas.width,
          tempCanvas.height,
          0, 0,
          canvasRef.current.width,
          canvasRef.current.height
        )

        setProcessProgress(85)
        
        // Apply quality reduction
        const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
        const data = imageData.data
        const qualityFactor = Math.max(1, Math.floor(256 * (1 - quality / 100)))
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.floor(data[i] / qualityFactor) * qualityFactor     // Red
          data[i + 1] = Math.floor(data[i + 1] / qualityFactor) * qualityFactor // Green
          data[i + 2] = Math.floor(data[i + 2] / qualityFactor) * qualityFactor // Blue
          // Keep alpha channel unchanged
        }
        
        ctx.putImageData(imageData, 0, 0)

        // Get processed image with proper mime type
        const processedUrl = canvasRef.current.toDataURL(
          file.type,
          Math.max(0.1, quality / 100)
        )

        setProcessedUrl(processedUrl)
        setProcessProgress(100)
        router.push('/loading')

        // Cleanup
        URL.revokeObjectURL(img.src)
        tempCanvas.remove()
      }
    } catch (err) {
      console.error('Processing error:', err)
      setError('Error processing media. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="bg-card shadow-sm rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
        <Input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="mb-4"
          disabled={isProcessing}
        />
        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Pixel Size</label>
            <Slider
              value={[pixelSize]}
              onValueChange={(value) => setPixelSize(value[0])}
              min={1}
              max={50}
              step={1}
              className="w-full"
              disabled={isProcessing}
            />
            <span className="text-sm text-muted-foreground mt-1">{pixelSize}</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quality</label>
            <Slider
              value={[quality]}
              onValueChange={(value) => setQuality(value[0])}
              min={1}
              max={100}
              step={1}
              className="w-full"
              disabled={isProcessing}
            />
            <span className="text-sm text-muted-foreground mt-1">{quality}%</span>
          </div>
        </div>
        {isProcessing && (
          <div className="mt-6 space-y-2">
            <Progress value={processProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Processing... {Math.round(processProgress)}%
            </p>
          </div>
        )}
        <Button 
          onClick={processMedia} 
          className="mt-6 w-full"
          disabled={!file || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Process Image'
          )}
        </Button>
      </div>
      {file && !isProcessing && (
        <div className="bg-card shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Image Preview</h2>
          <div>
            <h3 className="text-lg font-medium mb-2">Original Image</h3>
            <img src={URL.createObjectURL(file)} alt="Original" className="max-w-full h-auto rounded-md" />
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  )
}

