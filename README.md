# TRAVELOOP — AI Travel Copilot

TRAVELOOP is an AI-powered travel copilot that intelligently plans, optimizes, and manages personalized travel experiences. 

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui & Framer Motion
- Zustand
- Supabase (PostgreSQL, Auth, Storage)

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Copy the `.env.example` file to `.env.local` and add your real keys.
   ```bash
   cp .env.example .env.local
   ```

3. **Supabase Setup:**
   Run the SQL script located in `supabase/schema.sql` in your Supabase project's SQL Editor to create the necessary tables, configure Row Level Security, and set up Auth triggers.

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

## Design Aesthetics
Traveloop uses a premium, modern design system featuring glassmorphism, soft shadows, rounded corners, and vibrant gradients. Built with Framer Motion for smooth transitions.

## Features
- AI-generated itineraries
- Multi-city trip planning
- Budget optimization
- Drag-and-drop timeline builder
- Community sharing
