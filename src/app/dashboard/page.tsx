"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plane, Wallet, Calendar, Plus, ArrowRight, Loader2 } from "lucide-react"
import { fetchUserTrips } from "@/app/actions/dashboard-actions"
import { useSession } from "next-auth/react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getTrips() {
      if (status === "authenticated") {
        const result = await fetchUserTrips()
        if (result.data) {
          setTrips(result.data)
        }
      }
      setLoading(false)
    }
    
    getTrips()
  }, [status])

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {session?.user?.name || 'Traveler'}! 🌍
            </h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your trips today.</p>
          </div>
          <Link href="/trips/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Plan New Trip
            </Button>
          </Link>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
              <Plane className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : trips.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Planned in Traveloop</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-accent/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Countries Visited</CardTitle>
              <MapPin className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">+3 this year</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-success/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Budget Saved</CardTitle>
              <Wallet className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,240</div>
              <p className="text-xs text-muted-foreground mt-1">From AI optimizations</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-warning/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Travel Days</CardTitle>
              <Calendar className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground mt-1">In 2024</p>
            </CardContent>
          </Card>
        </section>

        {/* Next Trip Overview */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 flex flex-col gap-4">
            {loading ? (
              <Card className="h-full border-border flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </Card>
            ) : trips.length === 0 ? (
               <Card className="h-full border-border border-dashed flex flex-col items-center justify-center py-12 text-center">
                 <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                 <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
                 <p className="text-muted-foreground mb-6">Create your first AI-powered trip to get started.</p>
                 <Link href="/trips/new">
                   <Button>Plan New Trip</Button>
                 </Link>
               </Card>
            ) : (
              trips.map(trip => (
                <Card key={trip.id} className="border-border">
                  <CardHeader>
                    <CardTitle>{trip.title}</CardTitle>
                    <CardDescription>{trip.destination} • {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[200px] w-full rounded-xl overflow-hidden mb-4 bg-muted">
                      {trip.coverImage ? (
                        <img 
                          src={trip.coverImage} 
                          alt={trip.destination} 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Plane className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground truncate max-w-[60%]">
                        {trip.description}
                      </div>
                      <Link href={`/trips/${trip.id}`}>
                        <Button variant="outline" className="gap-2">
                          View Itinerary <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Card className="flex-1 border-border bg-gradient-to-br from-primary/10 to-transparent">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <span className="text-xl">✨</span> AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">Typhoon season ends in October, but pack a light rain jacket.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">Found a highly-rated ramen spot near your hotel, saved $15 over average tourist places.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">Your itinerary has a tight connection on Day 3. Recommended alternative train.</p>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="secondary">Review Suggestions</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
