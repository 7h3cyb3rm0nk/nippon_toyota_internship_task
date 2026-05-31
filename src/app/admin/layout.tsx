import { LayoutDashboard, Car, ShoppingCart, TableProperties, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Cars", href: "/admin/cars", icon: Car },
    { name: "Slabs", href: "/admin/slabs", icon: TableProperties },
    { name: "Sales", href: "/admin/sales", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <span className="font-bold text-primary text-xl tracking-tighter flex items-center gap-2">
          <Car className="size-6 text-primary" />
          NIPPON TOYOTA
        </span>
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-foreground text-sm bg-transparent hover:bg-secondary/50 transition-all duration-200"
            >
              <item.icon className="size-4" />
              {item.name}
            </Link>
          ))}
          <a href="/api/auth/logout" className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="size-4" />
            Logout
          </a>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
