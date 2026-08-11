import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI lazily
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", gym: "IBIZA GYM Ben Arous", time: new Date().toISOString() });
  });

  // AI Fitness Coach Endpoint
  app.post("/api/ai-coach", async (req, res) => {
    try {
      const { message, userGoal } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured
        return res.json({
          response: `Welcome to IBIZA GYM in Nouvelle Médina 3, Ben Arous! We offer top-tier Hammer Strength equipment, early 5:00 AM openings 7 days a week, and high-energy classes like Ibiza Rhythm Spin, BodyPump, Cross-Training, Boxing, and Pilates. Call us at +216 31 221 221 or visit us at 04, rue de Bizerte, Nouvelle Médina3, Ben Arous 2063!`
        });
      }

      const systemPrompt = `You are the official AI Fitness Coach & Concierge for "IBIZA GYM" located in Nouvelle Médina 3, Ben Arous, Tunisia.
Key Facts about IBIZA GYM:
- Location: 04, rue de Bizerte, Nouvelle Médina3, Ben Arous 2063, Tunisia (GPS: 36.7558041, 10.2212097).
- Contact: Phone +216 31 221 221 / +216 29 111 000, Instagram @ibizagym (https://www.instagram.com/ibizagym/).
- Hours: Mon-Fri 05:00 AM - 10:00 PM, Sat 05:00 AM - 08:00 PM, Sun 08:00 AM - 04:00 PM. Open 7 days a week starting 5 AM!
- Distinguishing Features: Ibiza neon LED & energetic music aesthetic, Hammer Strength & Technogym equipment, 5 specialized zones (Free Weights up to 60kg, Functional Sprint Turf Track, High-Tech Spin Arena, Group Studio, Recovery Bar), InBody 770 composition scans, certified coaches.
- Classes: Ibiza Rhythm Spin, BodyPump, Cross-Training HIIT, BodyCombat & Boxing, Zumba & Orientale Dance, Pilates & Core Sculpt, Outdoor Pilates Pop-Up.
- Memberships: Day Pass (15 TND), Monthly Flex (80 TND), Transformation 3-Month Pack (210 TND), Annual VIP (650 TND).
Be energetic, encouraging, concise, and helpful. Format your response cleanly with bullet points if helpful. User Goal: ${userGoal || 'General Fitness'}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
        ]
      });

      const text = response.text || "IBIZA GYM welcomes you! Feel the energy of Ibiza in Ben Arous. How can we help you reach your goals today?";
      return res.json({ response: text });
    } catch (err: any) {
      console.error("Gemini AI Coach Error:", err);
      return res.status(500).json({
        response: "Welcome to IBIZA GYM! Our team in Ben Arous is ready to help you hit your fitness goals. Visit us at 04, rue de Bizerte, Nouvelle Médina3, Ben Arous 2063 or call +216 31 221 221!"
      });
    }
  });

  // Book Trial / Class Pass Endpoint
  app.post("/api/book-trial", (req, res) => {
    const { fullName, phone, email, selectedGoal, preferredDay, preferredTimeSlot } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ error: "Full name and phone number are required" });
    }

    const bookingId = `IBZ-${Math.floor(100000 + Math.random() * 900000)}`;
    return res.json({
      success: true,
      bookingId,
      message: `Congratulations ${fullName}! Your IBIZA GYM trial pass (#${bookingId}) is confirmed for ${preferredDay || 'your visit'} (${preferredTimeSlot || 'Anytime'}). Show this confirmation code at reception in Nouvelle Médina 3!`,
      details: {
        fullName,
        phone,
        email,
        selectedGoal,
        gymLocation: "04, rue de Bizerte, Nouvelle Médina3, Ben Arous 2063",
        gymPhone: "+216 31 221 221"
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
