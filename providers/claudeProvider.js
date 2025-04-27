// providers/claude.js

async function callClaude(context) {
    // まだAnthropic SDK使わないので仮にシミュレーションだけ
    console.log("Claudeに送るならこういうcontextになります：", JSON.stringify(context, null, 2));
    return "【Claudeへのリクエストは未実装】";
  }
  
  module.exports = { callClaude };
  