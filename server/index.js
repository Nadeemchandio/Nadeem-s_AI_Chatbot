const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("AI Chatbot Backend is Running!");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("User message:", message);

    // Send message to OpenAI
    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: message,
    });

    const reply = response.output_text;

    console.log("AI response:", reply);

    res.json({
      reply: reply,
    });

  } catch (error) {
    console.error("OpenAI Error:", error);

    res.status(500).json({
      error: "AI response failed",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});