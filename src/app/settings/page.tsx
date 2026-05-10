"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Settings, User, Bell, Lock, Globe, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const SETTINGS_GROUPS = [
  {
    title: "Account",
    description: "Manage your profile and account settings",
    items: [
      { name: "Profile Information", icon: User },
      { name: "Security & Password", icon: Lock },
      { name: "Privacy Settings", icon: Shield },
    ]
  },
  {
    title: "Preferences",
    description: "Customize your Traveloop experience",
    items: [
      { name: "Notifications", icon: Bell },
      { name: "Language & Region", icon: Globe },
    ]
  }
]

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and app preferences.</p>
        </div>

        <div className="grid gap-6">
          {SETTINGS_GROUPS.map((group) => (
            <div key={group.title} className="space-y-4">
              <div className="px-1">
                <h2 className="text-xl font-bold">{group.title}</h2>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
              
              <div className="grid gap-3">
                {group.items.map((item) => (
                  <Card key={item.name} className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <Button variant="ghost" size="sm">Manage</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Card className="border-danger/20 bg-danger/5">
          <CardHeader>
            <CardTitle className="text-danger">Danger Zone</CardTitle>
            <CardDescription>Permanently delete your account and all your data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="rounded-xl">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
