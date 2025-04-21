const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const { getPlotSuggestion } = require('./openai');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = 3000;
const CONTEXT_PATH = './context.json';

const readContext = () => JSON.parse(fs.readFileSync(CONTEXT_PATH, 'utf-8'));

app.get('/context', (req, res) => {
  const context = readContext();
  res.json(context);
});

app.post('/step/plot', async (req, res) => {
  const context = readContext();
  const plot = await getPlotSuggestion(context);
  res.json({ plot });
});

app.listen(PORT, () => {
  console.log(`MCP server running at http://localhost:${PORT}`);
});
