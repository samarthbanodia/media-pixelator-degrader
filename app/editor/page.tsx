import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserMenu } from '@/components/user-menu'
import MediaPixelator from '@/components/media-pixelator'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EditorPage() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect('/')
    }

    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link 
              href="/" 
              className="text-xl font-bold hover:opacity-80 transition-opacity"
            >
              Media Pixelator & Degrader
            </Link>
            <UserMenu />
          </div>
        </header>
        <MediaPixelator />
      </div>
    )
  } catch (error) {
    console.error('Editor page error:', error)
    redirect('/')
  }
}

