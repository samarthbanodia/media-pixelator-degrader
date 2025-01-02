import GIF from 'gif.js'

export async function pixelateGif(
  inputGif: File,
  pixelSize: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: Math.max(1, Math.floor(30 * (quality / 100))),
      workerScript: '/gif.worker.js'
    })

    const img = new Image()
    img.src = URL.createObjectURL(inputGif)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Draw and pixelate the image
      ctx.drawImage(img, 0, 0)

      // Apply pixelation
      const scaleFactor = Math.max(0.01, pixelSize / 100)
      const pixelCanvas = document.createElement('canvas')
      const pixelCtx = pixelCanvas.getContext('2d', {
        willReadFrequently: true,
        alpha: true
      })

      if (!pixelCtx) {
        reject(new Error('Could not get pixel canvas context'))
        return
      }

      pixelCanvas.width = Math.max(1, Math.floor(canvas.width * scaleFactor))
      pixelCanvas.height = Math.max(1, Math.floor(canvas.height * scaleFactor))

      // Draw scaled down
      pixelCtx.drawImage(canvas, 
        0, 0, canvas.width, canvas.height,
        0, 0, pixelCanvas.width, pixelCanvas.height
      )

      // Draw scaled up
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        pixelCanvas,
        0, 0, pixelCanvas.width, pixelCanvas.height,
        0, 0, canvas.width, canvas.height
      )

      // Get ImageData from the canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Add frame to GIF
      gif.addFrame(imageData, { delay: 100 })

      // Render the GIF
      gif.on('finished', (blob: Blob) => {
        resolve(URL.createObjectURL(blob))
      })

      gif.on('error', (error: Error) => {
        reject(error)
      })

      gif.render()

      // Cleanup
      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      reject(new Error('Failed to load GIF'))
    }
  })
} 