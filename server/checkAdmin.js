import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Admin from "./models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const createAdmin = async (email, plainPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const existing = await Admin.findOne({ email });
    if (existing) {
      const matches = await bcrypt.compare(plainPassword, existing.password);
      if (!matches) {
        existing.password = hashedPassword;
        await existing.save();
        console.log(`🔄 Password reset for ${email}`);
      } else {
        console.log(`ℹ️  Admin ${email} already exists with correct password`);
      }
      return;
    }
    await Admin.create({ email, password: hashedPassword });
    console.log(`✅ Admin created: ${email} / ${plainPassword}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    const envEmail = process.env.ADMIN_EMAIL || "admin@dailyfixcare.com";
    const envPass = process.env.ADMIN_PASSWORD || "Admin@123";
    await createAdmin(envEmail, envPass);
    await createAdmin("avidevelop60@gmail.com", "123456");
    await createAdmin("admin@dailyfixcare.com", "Admin@123");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();