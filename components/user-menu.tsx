'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from 'lucide-react'

interface UserData {
  avatar_url?: string
  email?: string
  full_name?: string
  picture?: string // Google sometimes uses 'picture' instead of 'avatar_url'
}

export function UserMenu() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function getUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Combine both possible metadata locations
          const metadata: UserData = {
            ...user.user_metadata,
            ...user.identities?.[0]?.identity_data
          }
          setUserData(metadata)
          console.log('User data:', metadata) // For debugging
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    getUserData()
  }, [supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Get the avatar URL from either avatar_url or picture
  const avatarUrl = userData?.avatar_url || userData?.picture || ''
  const userEmail = userData?.email || ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full overflow-hidden hover:opacity-80 transition-opacity">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={avatarUrl} 
              alt={userData?.full_name || 'Profile'} 
              referrerPolicy="no-referrer" // Important for Google images
            />
            <AvatarFallback>
              {userEmail.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {userData?.full_name && (
          <DropdownMenuItem className="text-sm font-medium px-2 py-1.5 cursor-default">
            {userData.full_name}
          </DropdownMenuItem>
        )}
        {userEmail && (
          <DropdownMenuItem className="text-sm text-muted-foreground px-2 py-1.5 cursor-default">
            {userEmail}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

