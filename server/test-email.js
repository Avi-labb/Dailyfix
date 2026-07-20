import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sendEmail from "./utils/sendEmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Testing email sending...");
console.log("SMTP_USER:", process.env.SMTP_USER);

const testCustomerEmail = "test@example.com"; // Replace with your actual test email
const testAdminEmail = process.env.ADMIN_EMAIL;

async function runTests() {
  try {
    console.log("\n?? Sending test customer email to:", testCustomerEmail);
    await sendEmail({
      to: testCustomerEmail,
      subject: "Test Customer Order Confirmation",
      html: `
        <h1>Test Customer Email</h1>
        <p>This is a test order confirmation email!</p>
      `
    });

    console.log("\n? Test customer email sent!");

    if (testAdminEmail) {
      console.log("\n?? Sending test admin email to:", testAdminEmail);
      await sendEmail({
        to: testAdminEmail,
        subject: "Test Admin New Order Notification",
        html: `
          <h1>Test Admin Email</h1>
          <p>This is a test new order notification!</p>
        `
      });
      console.log("\n? Test admin email sent!");
    }

    console.log("\n? All tests done!");
  } catch (error) {
    console.error("\n? Error sending email:", error);
    if (error.stack) console.error("Stack trace:", error.stack);
  }
}

runTests();
