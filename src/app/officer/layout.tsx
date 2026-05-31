export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <span className="font-semibold">Nippon Toyota</span>
        <a href="/api/auth/logout" className="text-sm hover:underline text-red-500">Logout</a>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
