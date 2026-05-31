export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <span className="font-semibold">Nippon Toyota Admin</span>
        <div className="flex gap-4">
          <a href="/admin/cars" className="text-sm hover:underline">Car Models</a>
          <a href="/admin/slabs" className="text-sm hover:underline">Slab Config</a>
          <a href="/admin/sales" className="text-sm hover:underline">Sales</a>
          <a href="/api/auth/logout" className="text-sm hover:underline text-red-500">Logout</a>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
