"use client";

import { LayoutDashboard, Car, ShoppingCart, TableProperties, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Cars", href: "/admin/cars", icon: Car },
    { name: "Slabs", href: "/admin/slabs", icon: TableProperties },
    { name: "Sales", href: "/admin/sales", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <span className="font-bold text-primary text-xl tracking-tighter flex items-center gap-2">
          <Car className="size-6 text-primary" />
          NIPPON TOYOTA
        </span>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
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

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-card/95 backdrop-blur-md border-b border-border p-6 flex flex-col gap-4 z-40">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-foreground text-base bg-secondary/50"
            >
              <item.icon className="size-5" />
              {item.name}
            </Link>
          ))}
          <a href="/api/auth/logout" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base text-destructive bg-destructive/10">
            <LogOut className="size-5" />
            Logout
          </a>
        </div>
      )}

      <main className="p-6">{children}</main>
    </div>
  )
}
