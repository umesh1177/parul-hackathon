"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Sparkles, ArrowLeft, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

const COLORS = ["var(--primary)", "var(--secondary)", "var(--accent)", "var(--warning)", "var(--success)", "#8884d8"]

export default function BudgetAnalyticsPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<any>(null)
  const [expenseData, setExpenseData] = useState<any[]>([])
  const [dailyData, setDailyData] = useState<any[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: tripData } = await supabase
        .from('trips')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (tripData) {
        setTrip(tripData)
        
        // Fetch all activities for this trip through trip_stops
        const { data: stops } = await supabase.from('trip_stops').select('id, arrival_date').eq('trip_id', tripData.id)
        
        if (stops && stops.length > 0) {
          const stopIds = stops.map(s => s.id)
          const { data: activities } = await supabase.from('activities').select('*').in('stop_id', stopIds)
          
          if (activities) {
            // Calculate total spent
            const total = activities.reduce((sum, act) => sum + Number(act.cost || 0), 0)
            setTotalSpent(total)
            
            // Calculate expense by category
            const categoryMap: Record<string, number> = {}
            activities.forEach(act => {
              const cat = act.category || "Other"
              categoryMap[cat] = (categoryMap[cat] || 0) + Number(act.cost || 0)
            })
            
            const expData = Object.keys(categoryMap).map((key, i) => ({
              name: key,
              value: categoryMap[key],
              color: COLORS[i % COLORS.length]
            })).filter(d => d.value > 0)
            
            setExpenseData(expData.length > 0 ? expData : [{ name: "No expenses yet", value: 1, color: "var(--muted)" }])
            
            // Calculate daily expenses (roughly mapping activities to stop dates)
            const dateMap: Record<string, number> = {}
            activities.forEach(act => {
              const stop = stops.find(s => s.id === act.stop_id)
              if (stop && stop.arrival_date) {
                const date = stop.arrival_date
                dateMap[date] = (dateMap[date] || 0) + Number(act.cost || 0)
              }
            })
            
            const dayData = Object.keys(dateMap).sort().map(key => ({
              day: new Date(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
              amount: dateMap[key]
            }))
            
            setDailyData(dayData)
          }
        }
      }
      setLoading(false)
    }
    
    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    )
  }

  const totalBudget = trip?.total_budget || 0
  const remaining = totalBudget - totalSpent

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/trips/${params.id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Budget Analytics</h1>
              <p className="text-muted-foreground">{trip?.title || "Trip Details"}</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Summary Cards */}
          <Card className="bg-primary/5 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalBudget}</div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/5 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalSpent}</div>
              <p className="text-xs text-muted-foreground mt-1">{totalBudget > 0 ? ((totalSpent/totalBudget)*100).toFixed(1) : 0}% of budget</p>
            </CardContent>
          </Card>
          <Card className="bg-success/5 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">${remaining}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Where your money is going</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `$${value}`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4 w-full">
                {expenseData.map((item) => item.name !== "No expenses yet" && (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Spending</CardTitle>
              <CardDescription>Your expenses per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData.length > 0 ? dailyData : [{ day: "No Data", amount: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value) => `$${value}`}
                    />
                    <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="md:col-span-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> AI Budget Optimizer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-card p-4 rounded-xl border">
                  <h4 className="font-semibold text-warning mb-2">Warning: Food Budget</h4>
                  <p className="text-sm text-muted-foreground">You are projected to overspend on Food by $50. Consider switching Day 3 lunch to a local market.</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">View Alternatives</Button>
                </div>
                <div className="bg-card p-4 rounded-xl border">
                  <h4 className="font-semibold text-success mb-2">Savings Opportunity</h4>
                  <p className="text-sm text-muted-foreground">Your selected train pass is $20 more expensive than buying individual tickets for your planned route.</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">Switch to Single Tickets</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
