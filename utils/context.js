const fs = require('fs');
const path = require('path');

const CONTEXT_PATH = path.join(__dirname, '../context.json');

function readContext() {
  const data = fs.readFileSync(CONTEXT_PATH, 'utf-8');
  return JSON.parse(data);
}

function saveContext(context) {
  fs.writeFileSync(CONTEXT_PATH, JSON.stringify(context, null, 2), 'utf-8');
}

module.exports = { readContext, saveContext };
