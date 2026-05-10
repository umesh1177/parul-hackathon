"use server";

import { db } from "@/db";
import { trips, stops, activities } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function fetchTripDetails(tripId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const [trip] = await db
      .select()
      .from(trips)
      .where(eq(trips.id, tripId));

    if (!trip) {
      return { error: "Trip not found" };
    }

    // Verify ownership
    if (trip.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    const tripStops = await db
      .select()
      .from(stops)
      .where(eq(stops.tripId, tripId))
      .orderBy(asc(stops.order));

    return { data: { trip, stops: tripStops } };
  } catch (error) {
    console.error("Fetch trip details error:", error);
    return { error: "Failed to fetch trip details" };
  }
}

export async function fetchStopActivities(stopId: string) {
  try {
    const stopActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.stopId, stopId));

    return { data: stopActivities };
  } catch (error) {
    console.error("Fetch activities error:", error);
    return { error: "Failed to fetch activities" };
  }
}
