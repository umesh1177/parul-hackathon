"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, DollarSign, Sparkles, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { generateTripAction } from "@/app/actions/trip-actions"

const tripSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z.string().min(1, "Budget is required"),
  interests: z.string().optional(),
})

function CreateTripForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isGenerating, setIsGenerating] = useState(false)

  const prefilledDestination = searchParams.get("destination") || ""

  const form = useForm<z.infer<typeof tripSchema>>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      destination: prefilledDestination,
      startDate: "",
      endDate: "",
      budget: "",
      interests: "",
    },
  })

  async function onSubmit(values: z.infer<typeof tripSchema>) {
    setIsGenerating(true)
    
    try {
      const tripId = await generateTripAction(values)
      toast.success("Itinerary generated successfully!")
      router.push(`/trips/${tripId}`) 
    } catch (error: any) {
      toast.error(error.message || "Failed to generate trip")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Plan a new trip</h1>
        <p className="text-muted-foreground mt-2">Let our AI build the perfect itinerary for your next adventure.</p>
      </div>

      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
          <CardDescription>Tell us about where you want to go and what you want to do.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Destination
              </label>
              <Input 
                placeholder="e.g. Tokyo, Japan" 
                {...form.register("destination")}
                className="bg-muted/50"
              />
              {form.formState.errors.destination && (
                <p className="text-sm text-destructive">{form.formState.errors.destination.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Start Date
                </label>
                <Input 
                  type="date"
                  {...form.register("startDate")}
                  className="bg-muted/50"
                />
                {form.formState.errors.startDate && (
                  <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> End Date
                </label>
                <Input 
                  type="date"
                  {...form.register("endDate")}
                  className="bg-muted/50"
                />
                {form.formState.errors.endDate && (
                  <p className="text-sm text-destructive">{form.formState.errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-success" /> Total Budget ($)
              </label>
              <Input 
                type="number"
                placeholder="e.g. 1500" 
                {...form.register("budget")}
                className="bg-muted/50"
              />
              {form.formState.errors.budget && (
                <p className="text-sm text-destructive">{form.formState.errors.budget.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" /> Interests & Preferences
              </label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. I love trying local street food, visiting historical museums, and I want a relaxed pace."
                {...form.register("interests")}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium" 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate with AI
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CreateTripPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <CreateTripForm />
      </Suspense>
    </MainLayout>
  )
}
