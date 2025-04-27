const { adaptContextForOpenAI } = require('./adapter');
const { callOpenAI } = require('./providers/openaiProvider');
const { callClaude } = require('./providers/claudeProvider');

async function sendRequest(context, model = "openai") {
  if (model === "openai") {
    const messages = adaptContextForOpenAI(context);
    return await callOpenAI(messages);
  } else if (model === "claude") {
    return await callClaude(context);
  } else {
    throw new Error(`Unsupported model: ${model}`);
  }
}

module.exports = { sendRequest };
