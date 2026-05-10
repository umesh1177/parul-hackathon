"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, Plus, Loader2, Plane } from "lucide-react"
import Link from "next/link"
import { fetchUserTrips } from "@/app/actions/dashboard-actions"
import { motion } from "framer-motion"

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getTrips() {
      const result = await fetchUserTrips()
      if (result.data) {
        setTrips(result.data)
      }
      setLoading(false)
    }
    getTrips()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
            <p className="text-muted-foreground mt-1">Manage and view all your planned adventures.</p>
          </div>
          <Link href="/trips/new">
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> Plan New Trip
            </Button>
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Link href={`/trips/${trip.id}`} key={trip.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer rounded-2xl group">
                    <div className="relative h-48">
                      <img 
                        src={`https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800&sig=${trip.id}`} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={trip.destination}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white leading-tight">{trip.title}</h3>
                        <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                          <MapPin className="h-3 w-3" /> {trip.destination}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Clock className="h-4 w-4 text-primary" />
                          7 Days
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border">
            <Plane className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold">No trips found</h3>
            <p className="text-muted-foreground mb-6">Start planning your first journey today!</p>
            <Link href="/trips/new">
              <Button variant="outline" className="rounded-xl">Create a Trip</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
