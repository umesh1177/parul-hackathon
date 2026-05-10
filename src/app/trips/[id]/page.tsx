"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, DollarSign, GripVertical, Settings, Sparkles, Loader2, Plane } from "lucide-react"
import Link from "next/link"
import { fetchTripDetails, fetchStopActivities } from "@/app/actions/trip-details-actions"

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<any>(null)
  const [stops, setStops] = useState<any[]>([])
  const [activeStop, setActiveStop] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getTripData() {
      const result = await fetchTripDetails(params.id)
      
      if (result.data) {
        setTrip(result.data.trip)
        setStops(result.data.stops)
        
        if (result.data.stops.length > 0) {
          const firstStop = result.data.stops[0]
          setActiveStop(firstStop)
          
          const actResult = await fetchStopActivities(firstStop.id)
          if (actResult.data) {
            setActivities(actResult.data)
          }
        }
      }
      setLoading(false)
    }
    getTripData()
  }, [params.id])

  async function handleStopChange(stop: any) {
    setActiveStop(stop)
    setActivities([])
    const result = await fetchStopActivities(stop.id)
    if (result.data) {
      setActivities(result.data)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  if (!trip) {
    return (
      <MainLayout>
        <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center gap-4">
          <Plane className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-2xl font-bold">Trip not found</h2>
          <Button>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        
        {/* Left Sidebar: Days */}
        <div className="w-48 flex flex-col gap-2 overflow-y-auto pr-2 hidden lg:flex">
          <h3 className="font-semibold text-lg mb-2">Itinerary</h3>
          {stops.map((stop, index) => (
            <button
              key={stop.id}
              onClick={() => handleStopChange(stop)}
              className={`flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                activeStop?.id === stop.id 
                  ? "bg-primary text-primary-foreground font-medium shadow-md" 
                  : "bg-card hover:bg-muted text-muted-foreground border border-border"
              }`}
            >
              <span className="truncate">{stop.locationName.split(',')[0]}</span>
              <span className="text-xs opacity-80 ml-2">D{index + 1}</span>
            </button>
          ))}
          <Button variant="outline" className="mt-4 border-dashed">
            + Add Stop
          </Button>
        </div>

        {/* Middle: Activities Timeline */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
          {activeStop ? (
            <>
              <div className="flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                <div>
                  <h2 className="text-2xl font-bold">{activeStop.locationName}</h2>
                  <p className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                    <Calendar className="h-4 w-4" /> 
                    {activeStop.arrivalDate ? new Date(activeStop.arrivalDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                  <Button className="bg-gradient-to-r from-primary to-accent text-white border-0">
                    <Sparkles className="mr-2 h-4 w-4" /> Optimize Day
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                {activities.length > 0 ? activities.map((act) => (
                  <Card key={act.id} className="border-border shadow-sm group hover:border-primary/50 transition-colors">
                    <CardContent className="p-0 flex items-stretch">
                      <div className="w-8 flex items-center justify-center border-r bg-muted/30 text-muted-foreground cursor-grab active:cursor-grabbing">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <div className="flex-1 p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg">{act.title}</h4>
                          <p className="text-sm text-muted-foreground">{act.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 60m</span>
                            <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ${act.cost}</span>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                            {act.category || "Activity"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No activities planned for this stop yet.
                  </div>
                )}
              </div>
              
              <Button variant="outline" className="w-full mt-4 border-dashed py-8 text-muted-foreground hover:text-foreground">
                + Add Activity
              </Button>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a stop to view activities.
            </div>
          )}
        </div>

        {/* Right Sidebar: Map & Budget */}
        <div className="w-80 flex-col gap-4 hidden xl:flex">
          <Card className="flex-1 border-border overflow-hidden flex flex-col">
            <CardContent className="p-0 flex-1 relative bg-muted">
              <div className="absolute inset-0 flex items-center justify-center flex-col text-muted-foreground gap-2">
                <MapPin className="h-8 w-8 text-primary/50" />
                <p className="text-sm font-medium text-center px-4">Map integration will appear here,<br/>showing all activities</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-48 border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col h-full justify-between">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Total Trip Budget</h4>
                <div className="text-3xl font-bold mt-2">
                  ${activities.reduce((sum, act) => sum + Number(act.cost || 0), 0)} 
                  <span className="text-lg text-muted-foreground font-normal"> / ${trip.totalBudget}</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 mt-4">
                <div 
                  className="bg-success h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (activities.reduce((sum, act) => sum + Number(act.cost || 0), 0) / Number(trip.totalBudget || 1)) * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right text-primary group-hover:underline">View full budget analytics →</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
