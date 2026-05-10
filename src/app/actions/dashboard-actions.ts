"use server";

import { db } from "@/db";
import { trips } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function fetchUserTrips() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const userTrips = await db
      .select()
      .from(trips)
      .where(eq(trips.userId, session.user.id))
      .orderBy(asc(trips.startDate));

    return { data: userTrips };
  } catch (error: any) {
    console.error("Fetch trips error:", error);
    return { error: "Failed to fetch trips" };
  }
}
