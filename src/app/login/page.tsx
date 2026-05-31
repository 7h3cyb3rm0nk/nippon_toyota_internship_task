'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Car, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/officer')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh">
      <Card className="w-full max-w-sm border-border shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 p-8 pb-0">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Car className="size-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tighter text-center uppercase">Nippon Toyota</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button 
              type="submit" 
              className="w-full rounded-full gap-2" 
              disabled={loading || !email || !password}
            >
              <Lock className="size-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Test Credentials:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium text-foreground">Admin:</p>
                <p>admin@test.com</p>
                <p>Test123!</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Officer:</p>
                <p>officer@test.com</p>
                <p>Test123!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
