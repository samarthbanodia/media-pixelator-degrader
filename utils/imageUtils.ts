export function pixelateImage(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  pixelSize: number,
  quality: number
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = img.width
  const h = img.height
  canvas.width = w
  canvas.height = h

  ctx.drawImage(img, 0, 0, w, h)

  // Pixelate
  ctx.imageSmoothingEnabled = false
  const scaleFactor = pixelSize / 100
  ctx.drawImage(canvas, 0, 0, w * scaleFactor, h * scaleFactor)
  ctx.drawImage(canvas, 0, 0, w * scaleFactor, h * scaleFactor, 0, 0, w, h)

  // Lower quality
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return

  tempCanvas.width = w
  tempCanvas.height = h
  tempCtx.drawImage(canvas, 0, 0, w, h)

  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(tempCanvas, 0, 0, w, h)
}

