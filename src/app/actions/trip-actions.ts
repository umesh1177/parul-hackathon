"use server"

import { db } from "@/db";
import { trips, stops, activities } from "@/db/schema";
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { nanoid } from "nanoid";

const tripSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title for the trip" },
    description: { type: Type.STRING, description: "A short description of the trip" },
    total_budget: { type: Type.NUMBER, description: "Estimated total budget based on the user's constraints" },
    trip_type: { type: Type.STRING, description: "Type of trip (e.g. Adventure, Relaxing, Cultural)" },
    stops: {
      type: Type.ARRAY,
      description: "List of cities/stops in the trip",
      items: {
        type: Type.OBJECT,
        properties: {
          city: { type: Type.STRING },
          country: { type: Type.STRING },
          arrival_date: { type: Type.STRING, description: "YYYY-MM-DD" },
          departure_date: { type: Type.STRING, description: "YYYY-MM-DD" },
          order_index: { type: Type.NUMBER },
          activities: {
            type: Type.ARRAY,
            description: "Activities in this city",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                cost: { type: Type.NUMBER },
                duration: { type: Type.NUMBER, description: "Duration in minutes" },
              },
              required: ["title", "description", "category", "cost", "duration"]
            }
          }
        },
        required: ["city", "country", "arrival_date", "departure_date", "order_index", "activities"]
      }
    }
  },
  required: ["title", "description", "total_budget", "trip_type", "stops"]
}

export async function generateTripAction(data: {
  destination: string
  startDate: string
  endDate: string
  budget: string
  interests?: string
}) {
  console.log("DEBUG: generateTripAction called with:", data);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("DEBUG: No session found");
    throw new Error("You must be logged in to generate a trip.")
  }

  const userId = session.user.id;
  console.log("DEBUG: User ID:", userId);

  const apiKey = process.env.GEMINI_API_KEY;
  console.log("DEBUG: API Key present:", !!apiKey);
  
  if (!apiKey || apiKey === "dummy") {
    console.warn("GEMINI_API_KEY is not set or is 'dummy'. Saving dummy trip instead.");
    return await saveDummyTripToMySQL(userId, data)
  }

  try {
    console.log("DEBUG: Initializing GoogleGenAI with apiVersion: v1...");
    // Explicitly set apiVersion to v1 to avoid v1beta issues
    const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });

    const prompt = `
      Generate a highly detailed travel itinerary.
      Destination: ${data.destination}
      Start Date: ${data.startDate}
      End Date: ${data.endDate}
      Budget constraints: ${data.budget} USD
      User Interests: ${data.interests || "General sightseeing"}
      
      Ensure the activities fit the budget and the dates. Return realistic costs and durations.
    `

    console.log("DEBUG: Sending request to Gemini (gemini-2.0-flash)...");
    const response = await ai.models.generateContent({ 
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: tripSchema,
      }
    });

    console.log("DEBUG: Response received from Gemini");
    const text = response.text();
    console.log("DEBUG: Raw response text:", text);

    if (!text) {
      throw new Error("AI returned empty response");
    }

    const tripData = JSON.parse(text)
    console.log("DEBUG: Parsed trip data:", tripData);
    
    const tripId = await saveTripToMySQL(userId, data, tripData);
    console.log("DEBUG: Trip saved successfully with ID:", tripId);
    return tripId;
    
  } catch (error: any) {
    console.error("CRITICAL AI ERROR:", error);
    // If 2.0 flash is not available, try 1.5 flash with v1
    if (error.message?.includes("not found")) {
        console.log("DEBUG: gemini-2.0-flash not found, falling back to gemini-1.5-flash...");
        try {
            const aiFallback = new GoogleGenAI({ apiKey, apiVersion: 'v1' });
            const responseFallback = await aiFallback.models.generateContent({ 
                model: "gemini-1.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: tripSchema,
                }
            });
            const textFallback = responseFallback.text();
            const tripDataFallback = JSON.parse(textFallback || "{}");
            return await saveTripToMySQL(userId, data, tripDataFallback);
        } catch (innerError: any) {
            console.error("CRITICAL FALLBACK ERROR:", innerError);
            throw new Error(`AI Generation failed: ${innerError.message || "Unknown error"}`)
        }
    }
    throw new Error(`AI Generation failed: ${error.message || "Unknown error"}`)
  }
}

async function saveTripToMySQL(userId: string, originalData: any, aiData: any) {
  // 1. Insert Trip
  const tripId = nanoid();
  await db.insert(trips).values({
    id: tripId,
    userId: userId,
    title: aiData.title,
    description: aiData.description,
    destination: originalData.destination,
    startDate: originalData.startDate,
    endDate: originalData.endDate,
    totalBudget: aiData.total_budget?.toString() || originalData.budget.toString(),
    tripType: aiData.trip_type,
  });

  // 2. Insert Stops & Activities
  for (const stop of aiData.stops || []) {
    const stopId = nanoid();
    await db.insert(stops).values({
      id: stopId,
      tripId: tripId,
      locationName: `${stop.city}, ${stop.country}`,
      order: stop.order_index.toString(),
      arrivalDate: new Date(stop.arrival_date),
      departureDate: new Date(stop.departure_date),
    });

    const activitiesToInsert = (stop.activities || []).map((act: any) => ({
      id: nanoid(),
      stopId: stopId,
      title: act.title,
      description: act.description,
      category: act.category,
      cost: act.cost?.toString(),
    }));

    if (activitiesToInsert.length > 0) {
      await db.insert(activities).values(activitiesToInsert);
    }
  }

  return tripId;
}

async function saveDummyTripToMySQL(userId: string, data: any) {
  const tripId = nanoid();
  
  await db.insert(trips).values({
    id: tripId,
    userId: userId,
    title: `Trip to ${data.destination}`,
    description: `A generated dummy trip because GEMINI_API_KEY is not set.`,
    destination: data.destination,
    startDate: data.startDate,
    endDate: data.endDate,
    totalBudget: data.budget.toString(),
    tripType: 'General',
  });
  
  const stopId = nanoid();
  await db.insert(stops).values({
    id: stopId,
    tripId: tripId,
    locationName: data.destination,
    order: "1",
    arrivalDate: new Date(data.startDate),
    departureDate: new Date(data.endDate),
  });

  await db.insert(activities).values([
    {
      id: nanoid(),
      stopId: stopId,
      title: "Visit the main square",
      description: "A nice walk around the city center.",
      category: "Sightseeing",
      cost: "0",
    },
    {
      id: nanoid(),
      stopId: stopId,
      title: "Local Dinner",
      description: "Enjoy some local cuisine.",
      category: "Food",
      cost: "50",
    }
  ]);

  return tripId;
}
