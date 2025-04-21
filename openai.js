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
