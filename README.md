# 🧠 Simple MCP Server with Node.js

This is a simple prototype of a **Model Context Protocol (MCP)** server built with Node.js and Express.  
It interacts with OpenAI's API to simulate a context-aware assistant—for example, one that helps write stories.

---

## 🚀 What You Can Do

- Structure your context with `system`, `user`, `steps`, and `resources`
- Call OpenAI API to generate story plots using the context
- Add characters dynamically via API
- See how changing context affects LLM responses

---

## 📦 Requirements

- Node.js v18+
- npm
- OpenAI API key ([Get one here](https://platform.openai.com/account/api-keys))

---

## 🛠 Setup

### 1. Clone this repository

```bash
git clone https://github.com/takehisa10098/plot-mcp-server.git
cd plot-mcp-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Create `context.json` file

```json
{
  "system": "あなたは小説執筆のサポートAIです。",
  "user": {
    "goal": "和風ファンタジーの短編小説を書きたい",
    "constraints": ["文字数は3000字以内", "テーマは『喪失と再生』"]
  },
  "steps": [
    { "name": "キャラクター作成", "status": "done" },
    { "name": "プロット生成", "status": "in_progress" }
  ],
  "resources": {
    "characters": [
      { "name": "アカネ", "role": "主人公", "trait": "寡黙で芯が強い" }
    ],
    "world": "戦国時代風の異世界。陰陽術が存在する。"
  }
}
```

### 5. Create `server.js`

```js
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

app.post('/update/characters', (req, res) => {
  const context = readContext();
  const newCharacter = req.body;

  if (!newCharacter.name || !newCharacter.role || !newCharacter.trait) {
    return res.status(400).json({ error: 'name, role, and trait are required' });
  }

  context.resources.characters.push(newCharacter);
  fs.writeFileSync(CONTEXT_PATH, JSON.stringify(context, null, 2), 'utf-8');
  res.json({ message: 'Character added', character: newCharacter });
});

app.listen(PORT, () => {
  console.log(`MCP server running at http://localhost:${PORT}`);
});
```

### 6. Create `openai.js`

```js
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getPlotSuggestion(context) {
  const { system, user, resources } = context;

  const messages = [
    { role: 'system', content: system },
    {
      role: 'user',
      content: `
目標: ${user.goal}
制約: ${user.constraints.join(', ')}

キャラクター: ${JSON.stringify(resources.characters)}
世界観: ${resources.world}

これを踏まえて、小説のプロット案を出してください。
      `
    }
  ];

  const res = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages,
  });

  return res.choices[0].message.content;
}

module.exports = { getPlotSuggestion };
```

---

## 🧪 How to Use

### Start the server

```bash
node server.js
```

### Get current context

```bash
curl http://localhost:3000/context
```

### Generate a plot

```bash
curl -X POST http://localhost:3000/step/plot
```

### Add a new character

```bash
curl -X POST http://localhost:3000/update/characters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ユキ",
    "role": "謎の旅人",
    "trait": "静かで何かを知っているような雰囲気"
  }'
```

---

## 💡 What is MCP?

Model Context Protocol (MCP) is a proposed format for structuring contextual information for LLMs.  
It allows applications to define `system`, `user`, `steps`, and `resources` that represent the ongoing state of a conversation or project.

This project shows how you can design an LLM interaction by **modifying structured context**, instead of rewriting your prompt each time.

---

## 🔗 Related

- [Anthropic MCP Docs](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)

---