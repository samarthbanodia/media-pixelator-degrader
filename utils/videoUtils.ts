export function pixelateVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  pixelSize: number,
  quality: number
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const scaleFactor = pixelSize / 100
  const processFrame = () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Pixelate
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(canvas, 0, 0, canvas.width * scaleFactor, canvas.height * scaleFactor)
    ctx.drawImage(
      canvas,
      0, 0, canvas.width * scaleFactor, canvas.height * scaleFactor,
      0, 0, canvas.width, canvas.height
    )

    // Lower quality (simulated by reducing color depth)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const qualityFactor = Math.floor(256 * (1 - quality / 100))
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / qualityFactor) * qualityFactor     // Red
      data[i + 1] = Math.floor(data[i + 1] / qualityFactor) * qualityFactor // Green
      data[i + 2] = Math.floor(data[i + 2] / qualityFactor) * qualityFactor // Blue
    }
    ctx.putImageData(imageData, 0, 0)

    requestAnimationFrame(processFrame)
  }

  video.play()
  processFrame()
}

