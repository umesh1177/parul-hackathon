"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Brain, Plane, Wallet, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchTopDestinations } from "@/app/actions/destinations-actions"

export default function LandingPage() {
  const [destinations, setDestinations] = useState<any[]>([])

  useEffect(() => {
    async function getDestinations() {
      const result = await fetchTopDestinations()
      if (result.data) {
        setDestinations(result.data)
      }
    }
    getDestinations()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">TRAVELOOP</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">Features</Link>
            <Link href="#destinations" className="text-sm font-medium text-muted-foreground hover:text-foreground">Destinations</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline">Log in</Link>
            <Link href="/signup" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              TRAVELOOP AI COPILOT IS LIVE
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6 leading-tight"
            >
              Your Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Travel Copilot</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Traveloop uses advanced AI to intelligently plan, optimize, and manage your personalized travel experiences. Say goodbye to spreadsheets.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/dashboard" className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Start Planning <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                View Demo
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="container mx-auto mt-20 px-4 max-w-5xl"
          >
            <div className="rounded-2xl border bg-card p-2 shadow-2xl backdrop-blur-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000" 
                alt="App Dashboard Preview" 
                className="rounded-xl w-full object-cover max-h-[500px]"
              />
            </div>
          </motion.div>
        </section>

        {/* Dynamic Destinations Section */}
        <section id="destinations" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" /> Trending Destinations
                </h2>
                <p className="text-muted-foreground">See where other travelers are heading. Our AI has planned thousands of unique itineraries across the globe.</p>
              </div>
              <Link href="/explore">
                <Button variant="ghost" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.length > 0 ? destinations.map((dest, i) => (
                <Link href="/explore" key={i}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border bg-card aspect-[4/3] cursor-pointer"
                  >
                  <img 
                    src={`https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=800&sig=${i}`}
                    alt={dest.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-6 w-full">
                    <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                    <p className="text-white/70 text-sm">{dest.count} trips planned by AI</p>
                  </div>
                </motion.div>
              </Link>
            )) : (
                // Fallback / Skeleton
                [1, 2, 3].map((_, i) => (
                  <div key={i} className="rounded-2xl border bg-muted animate-pulse aspect-[4/3]" />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Supercharge your travel planning</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to plan the perfect trip, powered by AI.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Itinerary Generation</h3>
                <p className="text-muted-foreground">Instantly create highly personalized day-by-day itineraries based on your unique interests and travel style.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-6">
                  <Wallet className="h-6 w-6 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Budgeting</h3>
                <p className="text-muted-foreground">Track expenses automatically and get AI-driven suggestions for cheaper alternatives to stay within budget.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <Plane className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Weather & Real-time Adapts</h3>
                <p className="text-muted-foreground">The AI automatically rearranges your outdoor plans if bad weather is detected, suggesting indoor alternatives.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-bold">TRAVELOOP</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Traveloop Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
