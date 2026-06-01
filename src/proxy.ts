import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // if (pathname === "/assets/car.glb") {
  //   const ua = request.headers.get("user-agent") ?? "";
  //   if (/iPhone|iPad|Android/i.test(ua)) {
  //     console.log("on mobile")
  //     return NextResponse.rewrite(new URL("/assets/car-mobile.glb", request.url));
  //   }
  //   return NextResponse.next();
  // }
  const response = await updateSession(request)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() { },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return response

  // Only check role on login page and cross-role access
  if (pathname === '/login') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) return response

    return NextResponse.redirect(
      new URL(profile.role === 'admin' ? '/admin/cars' : '/officer', request.url)
    )
  }

  if (pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) return response

    if (profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/officer', request.url))
    }
  }

  if (pathname.startsWith('/officer')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) return response

    if (profile.role !== 'sales_officer') {
      return NextResponse.redirect(new URL('/admin/cars', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.+\\.[\\w]+$).*)'],
}
