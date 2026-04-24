import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin";
import dbConnect from "../lib/mongodb";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env or .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin";
  const name = "Preyanka Jain";

  await dbConnect();

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    console.log("Admin already exists. Skipping seed.");
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const admin = new Admin({
    username,
    passwordHash,
    name,
    role: "admin",
  });

  await admin.save();
  console.log("Admin user created successfully!");
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error seeding admin:", err);
    process.exit(1);
  });
