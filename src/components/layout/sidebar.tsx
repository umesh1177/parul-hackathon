"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Map, Settings, Users, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Trips", href: "/trips", icon: Briefcase },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Community", href: "/community", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card hidden md:block">
      <div className="h-full flex flex-col px-4 py-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Map className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">TRAVELOOP</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto">
          <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-4 text-primary-foreground">
            <h4 className="font-semibold">Upgrade to Pro</h4>
            <p className="text-xs mt-1 mb-3 opacity-90">Get unlimited AI trip generations and priority support.</p>
            <button className="w-full rounded-lg bg-white/20 hover:bg-white/30 py-2 text-sm font-medium transition-colors">
              View Plans
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
