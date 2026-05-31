export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background bg-mesh">
      <nav className="border-b border-border bg-card px-6 py-4 flex items-center justify-between shadow-lg">
        <span className="font-bold text-primary text-xl tracking-wide">Nippon Toyota</span>
        <a href="/api/auth/logout" className="font-medium text-sm text-destructive hover:text-destructive/80 transition-colors">Logout</a>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
