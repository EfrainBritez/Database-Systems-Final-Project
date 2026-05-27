'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { SignInForm } from '@/components/forms/sign-in-form'
import { SignUpForm } from '@/components/forms/sign-up-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AuthButtons() {
  const { isSignedIn, customer, signOut, isLoading } = useAuth()
  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
      </div>
    )
  }

  // When user is signed in, show avatar with logout menu
  if (isSignedIn && customer) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-blue-600 transition-colors">
            {customer?.customer_name ? customer.customer_name.charAt(0).toUpperCase() : '?'}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // When user is not signed in, show sign in and sign up buttons
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setSignInOpen(true)}
        >
          Sign In
        </Button>
        <Button onClick={() => setSignUpOpen(true)}>
          Sign Up
        </Button>
      </div>

      <SignInForm isOpen={signInOpen} onOpenChange={setSignInOpen} />
      <SignUpForm isOpen={signUpOpen} onOpenChange={setSignUpOpen} />
    </>
  )
}
