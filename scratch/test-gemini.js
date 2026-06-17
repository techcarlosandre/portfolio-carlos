const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

let apiKey = "";
try {
  const envContent = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
  const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match) {
    apiKey = match[1].trim();
  }
} catch (e) {}

if (!apiKey) apiKey = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    // In newer SDKs, we might need to access the client/models service or just list them.
    // Let's try to query another common model like gemini-2.5-flash, gemini-2.0-flash, or gemini-1.5-flash-latest
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-pro"];
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("test");
        console.log(`Success with model ${m}:`, result.response.text().substring(0, 30));
        break;
      } catch (err) {
        console.log(`Failed for ${m}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Error listing:", err);
  }
}
run();
