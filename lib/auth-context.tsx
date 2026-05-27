'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Customer } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import Cookies from 'js-cookie'

interface AuthContextType {
  customer: Customer | null
  isLoading: boolean
  isSignedIn: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setCustomer(data)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sign in failed')
      }

      const data = await response.json()
      setCustomer(data)
      toast({
        title: 'Success',
        description: `Welcome back, ${data.customer_name}!`,
        variant: 'default',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      toast({
        title: 'Sign In Failed',
        description: errorMessage,
        variant: 'destructive',
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sign up failed')
      }

      const data = await response.json()
      setCustomer(data)
      toast({
        title: 'Account Created',
        description: `Welcome, ${data.customer_name}!`,
        variant: 'default',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed'
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setCustomer(null)
    Cookies.remove('auth_customer')
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      variant: 'default',
    })
    // Optional: call logout API
    fetch('/api/auth/logout', { method: 'POST' }).catch(console.error)
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isSignedIn: !!customer,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
