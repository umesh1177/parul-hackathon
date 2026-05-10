"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Users, Sparkles } from "lucide-react"

export default function CommunityPage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center px-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Users className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Traveloop Community</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Share your itineraries, discover hidden gems, and connect with fellow travelers. 
          The community feature is coming soon!
        </p>
        <div className="mt-10 flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          <Sparkles className="h-4 w-4" /> 
          Join the waitlist for early access
        </div>
      </div>
    </MainLayout>
  )
}
