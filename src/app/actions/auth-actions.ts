"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export async function signupAction(formData: any) {
  const { email, password, fullName } = formData;

  try {
    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
      id: nanoid(),
      email,
      password: hashedPassword,
      fullName,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { error: error.message || "Failed to create account" };
  }
}
