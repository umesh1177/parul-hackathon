"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Heart, 
  Mountain, 
  Palmtree, 
  Building2, 
  History, 
  Compass,
  ArrowRight,
  Sun,
  Moon,
  Coffee,
  CloudSun
} from "lucide-react"
import { motion } from "framer-motion"

const DESTINATIONS = [
  {
    id: 1,
    title: "Swiss Alps Skiing",
    location: "Zermatt, Switzerland",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    category: "Mountain",
    badges: ["Luxury Budget", "Winter"],
    description: "World-class skiing beneath the shadow of the iconic Matterhorn.",
    bestFor: "Family",
    price: "$$$"
  },
  {
    id: 2,
    title: "Rome Ancient History",
    location: "Rome, Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    category: "Cultural",
    badges: ["Moderate Budget", "Spring"],
    description: "Walk in the footsteps of gladiators and emperors in the Eternal City.",
    bestFor: "Couple",
    price: "$$"
  },
  {
    id: 3,
    title: "Maldives Overwater",
    location: "Male, Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    category: "Luxury",
    isTrending: true,
    badges: ["Luxury Budget", "All-Season"],
    description: "Ultimate relaxation in crystal clear waters with direct lagoon access.",
    bestFor: "Honeymoon",
    price: "$$$"
  },
  {
    id: 4,
    title: "Kyoto Zen Gardens",
    location: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    category: "Cultural",
    badges: ["Moderate Budget", "Autumn"],
    description: "Find peace among ancient temples and colorful maple leaves.",
    bestFor: "Solo",
    price: "$$"
  },
  {
    id: 5,
    title: "Santorini Sunsets",
    location: "Oia, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    category: "Beach",
    badges: ["Luxury Budget", "Summer"],
    description: "Breathtaking views of the Aegean Sea from white-washed villas.",
    bestFor: "Romantic",
    price: "$$$"
  },
  {
    id: 6,
    title: "Machu Picchu Trek",
    location: "Cusco, Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    category: "Adventure",
    badges: ["Adventure Budget", "Dry Season"],
    description: "Discover the lost city of the Incas high in the Andes mountains.",
    bestFor: "Friends",
    price: "$$"
  }
]

const PLACE_TYPES = [
  { icon: <History className="h-4 w-4" />, label: "Ancient" },
  { icon: <Compass className="h-4 w-4" />, label: "Temple" },
  { icon: <Palmtree className="h-4 w-4" />, label: "Nature" },
  { icon: <Building2 className="h-4 w-4" />, label: "Modern" },
  { icon: <Palmtree className="h-4 w-4" />, label: "Beach" },
  { icon: <History className="h-4 w-4" />, label: "Museum" },
  { icon: <History className="h-4 w-4" />, label: "Fort" },
  { icon: <Mountain className="h-4 w-4" />, label: "Wildlife" },
  { icon: <Mountain className="h-4 w-4" />, label: "Hill Station" },
  { icon: <Building2 className="h-4 w-4" />, label: "City" },
]

const TIMES = [
  { icon: <Sun className="h-4 w-4" />, label: "Morning" },
  { icon: <CloudSun className="h-4 w-4" />, label: "Evening" },
  { icon: <Coffee className="h-4 w-4" />, label: "All Day" },
  { icon: <Moon className="h-4 w-4" />, label: "Night" },
]

export default function ExplorePage() {
  const [search, setSearch] = useState("")

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-72 flex flex-col gap-8 overflow-y-auto pr-4 hidden lg:flex border-r border-border/50">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Filters</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Found {DESTINATIONS.length} places (max 10)</p>
          </div>

          <div className="space-y-6">
            {/* Location */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase text-xs tracking-wider text-muted-foreground">Location</h4>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="City (e.g. Tokyo)" className="pl-9 h-10 rounded-xl" />
              </div>
              <select className="w-full h-10 rounded-xl border border-input bg-card px-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                <option>All States</option>
              </select>
              <select className="w-full h-10 rounded-xl border border-input bg-card px-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                <option>All Countries</option>
              </select>
            </div>

            {/* Place Type */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase text-xs tracking-wider text-muted-foreground">Place Type</h4>
              <div className="flex flex-wrap gap-2">
                {PLACE_TYPES.map((type) => (
                  <button key={type.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium hover:border-primary hover:text-primary transition-all">
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Best Time To Visit */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase text-xs tracking-wider text-muted-foreground">Best Time To Visit</h4>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((time) => (
                  <button key={time.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-medium hover:border-primary hover:text-primary transition-all">
                    {time.icon}
                    {time.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-8 overflow-y-auto">
          {/* Header & Search */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Explore Destinations</h1>
              <p className="text-muted-foreground mt-2">Discover hand-picked places from around the world for your next adventure.</p>
            </div>

            <div className="flex gap-3 max-w-4xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search any city, country or destination worldwide..." 
                  className="pl-12 h-12 rounded-2xl border-border/50 bg-card shadow-sm text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 shadow-md">
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
            {DESTINATIONS.map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-xl transition-all group rounded-3xl">
                  <div className="relative aspect-[4/3]">
                    <img 
                      src={dest.image} 
                      alt={dest.title} 
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-black shadow-sm">
                        {dest.category}
                      </span>
                      {dest.isTrending && (
                        <span className="bg-red-500 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                          🔥 Trending
                        </span>
                      )}
                    </div>
                    <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors shadow-sm">
                      <Heart className="h-5 w-5" />
                    </button>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">{dest.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1 text-white/90 text-sm font-medium drop-shadow-md">
                          <MapPin className="h-3.5 w-3.5" />
                          {dest.location}
                        </div>
                        <div className="bg-black/20 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-yellow-400 text-xs font-bold">
                          <Star className="h-3 w-3 fill-current" />
                          {dest.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex gap-2 mb-4">
                      {dest.badges.map((b) => (
                        <span key={b} className="px-3 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/10">
                          {b}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
                      {dest.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                      <div className="text-xs text-muted-foreground font-medium">
                        Best for: <span className="text-foreground">{dest.bestFor}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-primary font-bold">Details</Button>
                        <Link href={`/trips/new?destination=${dest.title}`}>
                          <Button size="sm" className="bg-primary text-white font-bold rounded-xl px-4 shadow-lg shadow-primary/20 hover:shadow-none transition-all">
                            Plan Trip
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

import Link from "next/link"
