import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { LoginButton } from '@/components/login-button'
import { Grid2X2, SlidersHorizontal, ImageDown, Info } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Media Pixelator & Degrader</h1>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="w-4 h-4 mr-2" />
                  About Creator
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="font-medium">Created by Samarth Banodia  </span>
                  <a 
                    href="https://github.com/samarthbanodia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    GitHub Profile
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/samarth-banodia-6897bb317/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LoginButton />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center bg-dot-pattern relative">
        <div className="absolute inset-0 bg-background/50" />
        <div className="container mx-auto px-4 py-16 text-center relative">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Transform your media with
            <span className="block px-4 mt-2 bg-black text-white rounded-sm">
              precision controls
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Advanced media transformation tool for creative effects and privacy protection
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="p-6 rounded-lg border bg-card">
              <Grid2X2 className="w-10 h-10 mb-4 mx-auto text-primary" />
              <h3 className="text-lg font-semibold mb-2">Pixel Control</h3>
              <p className="text-sm text-muted-foreground">
                Fine-tune pixelation levels from subtle to dramatic effects
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <SlidersHorizontal className="w-10 h-10 mb-4 mx-auto text-primary" />
              <h3 className="text-lg font-semibold mb-2">Quality Adjustment</h3>
              <p className="text-sm text-muted-foreground">
                Precise quality control for optimal file size and visual effect
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <ImageDown className="w-10 h-10 mb-4 mx-auto text-primary" />
              <h3 className="text-lg font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">
                Support for both images and gifs with instant preview
              </p>
            </div>
          </div>
          
          <LoginButton variant="default" size="lg" className="font-semibold" />
        </div>
      </main>
    </div>
  )
}

