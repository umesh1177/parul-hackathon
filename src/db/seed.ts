import { db } from "./index";
import { users, trips, stops, activities } from "./schema";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // 1. Create a demo user
    const userId = nanoid();
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    await db.insert(users).values({
      id: userId,
      fullName: "Demo Traveler",
      email: "demo@traveloop.com",
      password: hashedPassword,
      avatarUrl: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
    });

    console.log("✅ User created: demo@traveloop.com / password123");

    // 2. Create a trip to Tokyo
    const tokyoTripId = nanoid();
    await db.insert(trips).values({
      id: tokyoTripId,
      userId: userId,
      title: "Exploring Modern & Traditional Tokyo",
      description: "A 7-day journey through the neon lights of Shinjuku and the temples of Asakusa.",
      destination: "Tokyo, Japan",
      startDate: "2024-10-15",
      endDate: "2024-10-22",
      totalBudget: "2500.00",
      tripType: "Cultural",
    });

    // 3. Add stops for Tokyo
    const stop1Id = nanoid();
    await db.insert(stops).values({
      id: stop1Id,
      tripId: tokyoTripId,
      locationName: "Shinjuku, Tokyo",
      order: "1",
      arrivalDate: new Date("2024-10-15T14:00:00"),
      departureDate: new Date("2024-10-18T10:00:00"),
    });

    // 4. Add activities for Shinjuku
    await db.insert(activities).values([
      {
        id: nanoid(),
        stopId: stop1Id,
        title: "Robot Restaurant Show",
        description: "A crazy neon-lit robot performance.",
        category: "Entertainment",
        cost: "80.00",
      },
      {
        id: nanoid(),
        stopId: stop1Id,
        title: "Shinjuku Gyoen National Garden",
        description: "Beautiful park for a morning walk.",
        category: "Nature",
        cost: "5.00",
      }
    ]);

    // 5. Create a trip to Paris
    const parisTripId = nanoid();
    await db.insert(trips).values({
      id: parisTripId,
      userId: userId,
      title: "Parisian Romance & Art",
      description: "Visiting the Louvre, Eiffel Tower, and hidden cafes in Montmartre.",
      destination: "Paris, France",
      startDate: "2024-12-01",
      endDate: "2024-12-07",
      totalBudget: "3200.00",
      tripType: "Romantic",
    });

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
