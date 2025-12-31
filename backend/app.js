import express from "express";
import cors from "cors";
import { askAI, webSearch } from "./chatbot.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/chat", async (req, res) => {
  const message = req.body.message;
  const reply = await askAI(message);

  res.send({ reply });   
});

app.post("/search", async (req, res) => {
  try {
    const query = req.body.query; // MUST be string
    console.log("Search Query:", query);

    const results = await webSearch(query);
    res.send({ results });
  } catch (err) {
    console.log("Search route error:", err);
    res.status(500).send({ results: [] });
  }
});

const PORT = process.env.PORT
app.listen(PORT || 3001, () => console.log("Server running on port 3001"));
