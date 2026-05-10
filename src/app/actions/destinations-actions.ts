"use server";

import { db } from "@/db";
import { trips } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function fetchTopDestinations() {
  try {
    // Fetch unique destinations and counts
    const destinations = await db
      .select({
        name: trips.destination,
        count: sql<number>`count(*)`,
      })
      .from(trips)
      .groupBy(trips.destination)
      .orderBy(sql`count(*) desc`)
      .limit(6);

    return { data: destinations };
  } catch (error) {
    console.error("Fetch destinations error:", error);
    return { error: "Failed to fetch destinations" };
  }
}
