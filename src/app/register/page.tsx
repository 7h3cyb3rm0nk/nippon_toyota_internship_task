'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Car, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: fullName } 
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh">
      <Card className="w-full max-w-sm border-border shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 p-8 pb-0">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Car className="size-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tighter text-center uppercase">Create Account</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button 
              type="submit" 
              className="w-full rounded-full gap-2" 
              disabled={loading || !fullName || !email || !password}
            >
              <UserPlus className="size-4" />
              {loading ? 'Creating...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
