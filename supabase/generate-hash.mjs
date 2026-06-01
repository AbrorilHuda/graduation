import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("password123", 12);
console.log("bcrypt hash for 'password123':");
console.log(hash);
console.log("\nUpdate supabase/seed.sql dengan hash di atas.");
