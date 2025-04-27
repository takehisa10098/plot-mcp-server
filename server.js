// server.js

const express = require('express');
const dotenv = require('dotenv');
const { readContext, saveContext } = require('./utils/context');
const { getPlotSuggestion } = require('./openai');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = 3000;

// ここから新しいAPI追加する！

// POST /resource/:type → リソース追加
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

// GET /resource/:type → リソース一覧取得
app.get('/resource/:type', (req, res) => {
  const type = req.params.type;

  const context = readContext();
  const resources = context.resources[type] || [];

  res.json(resources);
});

// PUT /resource/:type/:id → リソース更新
app.put('/resource/:type/:id', (req, res) => {
    const type = req.params.type;
    const id = req.params.id;
    const updates = req.body;
  
    const context = readContext();
    const resources = context.resources[type] || [];
  
    // IDが一致するリソースを探す
    const index = resources.findIndex(resource => resource.id === id);
  
    if (index === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }
  
    // オブジェクトをマージ更新
    resources[index] = { ...resources[index], ...updates };
    saveContext(context);
  
    res.json({ message: 'Resource updated successfully', resource: resources[index] });
});
  
// DELETE /resource/:type/:id → リソース削除
app.delete('/resource/:type/:id', (req, res) => {
    const type = req.params.type;
    const id = req.params.id;

    const context = readContext();
    const resources = context.resources[type] || [];

    const index = resources.findIndex(resource => resource.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Resource not found' });
    }

    // 削除
    resources.splice(index, 1);
    saveContext(context);

    res.json({ message: 'Resource deleted successfully' });
});

// （すでにあるエンドポイントたち↓）
app.get('/context', (req, res) => {
  const context = readContext();
  res.json(context);
});

app.post('/step/plot', async (req, res) => {
  const context = readContext();
  const plot = await getPlotSuggestion(context);
  res.json({ plot });
});

// ここまで！

app.listen(PORT, () => {
  console.log(`MCP server running at http://localhost:${PORT}`);
});
