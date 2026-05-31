import { LayoutDashboard, Car, ShoppingCart, TableProperties, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const features = [
    { title: "Dashboard", description: "Overview of your operations", icon: LayoutDashboard, href: "/admin" },
    { title: "Cars", description: "Manage vehicle inventory", icon: Car, href: "/admin/cars" },
    { title: "Sales", description: "Track recent sales", icon: ShoppingCart, href: "/admin/sales" },
    { title: "Slabs", description: "Manage slab inventory", icon: TableProperties, href: "/admin/slabs" },
  ];

  return (
    <div className="flex flex-1 flex-col p-8 gap-8 bg-background">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Nippon Dashboard</h1>
        <p className="text-muted-foreground">Select an area to manage your inventory and sales.</p>
      </header>
      
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href} className="block">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <feature.icon className="size-6 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end pt-2">
                <ArrowRight className="size-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  );
}
