function adaptContextForOpenAI(context) {
    const { system, user, resources, steps } = context;
  
    const currentStep = steps.find(step => step.status === "in_progress") || {};
  
    return [
      { role: "system", content: system },
      { role: "user", content: `
  目標: ${user.goal}
  制約: ${user.constraints.join(", ")}
  
  キャラクター情報: ${JSON.stringify(resources.characters || [])}
  世界設定: ${JSON.stringify(resources.world || {})}
  現在ステップ: ${JSON.stringify(currentStep)}
    `.trim() }
    ];
  }
  
  module.exports = { adaptContextForOpenAI };
  