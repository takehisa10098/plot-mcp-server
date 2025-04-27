const express = require('express');
const dotenv = require('dotenv');
const { readContext } = require('./utils/context');
const { sendRequest } = require('./llmService');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/context', (req, res) => {
  const context = readContext();
  res.json(context);
});

app.post('/step/plot', async (req, res) => {
  const context = readContext();
  const model = req.query.model || "openai"; // デフォルトは openai

  try {
    const plot = await sendRequest(context, model);
    res.json({ plot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating plot" });
  }
});

app.listen(PORT, () => {
  console.log(`MCP server running at http://localhost:${PORT}`);
});
