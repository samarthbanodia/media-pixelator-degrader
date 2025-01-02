'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface LoginButtonProps extends React.ComponentProps<typeof Button> {}

export function LoginButton({ variant = "ghost", ...props }: LoginButtonProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    if (error) {
      console.error('Error signing in:', error.message)
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleSignIn}
      {...props}
    >
      Get Started for Free
    </Button>
  )
}

