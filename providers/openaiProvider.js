const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function callOpenAI(messages) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages
  });
  return res.choices[0].message.content;
}

module.exports = { callOpenAI };
