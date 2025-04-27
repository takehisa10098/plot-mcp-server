const express = require('express');
const dotenv = require('dotenv');
const { readContext, saveContext } = require('./utils/context');
const { sendRequest } = require('./llmService');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = 3000;

// context取得
app.get('/context', (req, res) => {
  const context = readContext();
  res.json(context);
});

// プロット生成
app.post('/step/plot', async (req, res) => {
  const context = readContext();
  const model = req.query.model || "openai"; // デフォルトはopenai

  try {
    const plot = await sendRequest(context, model);
    res.json({ plot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating plot" });
  }
});

// =====================
// Resources CRUDエンドポイント
// =====================

// リソース追加
app.post('/resource/:type', (req, res) => {
  const type = req.params.type;
  const newResource = req.body;

  const context = readContext();

  if (!context.resources[type]) {
    context.resources[type] = [];
  }

  context.resources[type].push(newResource);
  saveContext(context);

  res.json({ message: 'Resource created successfully', resource: newResource });
});

// リソース一覧取得
app.get('/resource/:type', (req, res) => {
  const type = req.params.type;
  const context = readContext();
  const resources = context.resources[type] || [];
  res.json(resources);
});

// リソース更新
app.put('/resource/:type/:id', (req, res) => {
  const type = req.params.type;
  const id = req.params.id;
  const updates = req.body;

  const context = readContext();
  const resources = context.resources[type] || [];

  const index = resources.findIndex(resource => resource.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  resources[index] = { ...resources[index], ...updates };
  saveContext(context);

  res.json({ message: 'Resource updated successfully', resource: resources[index] });
});

// リソース削除
app.delete('/resource/:type/:id', (req, res) => {
  const type = req.params.type;
  const id = req.params.id;

  const context = readContext();
  const resources = context.resources[type] || [];

  const index = resources.findIndex(resource => resource.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  resources.splice(index, 1);
  saveContext(context);

  res.json({ message: 'Resource deleted successfully' });
});

// =====================
// ここまで Resources CRUD
// =====================

app.listen(PORT, () => {
  console.log(`MCP server running at http://localhost:${PORT}`);
});
