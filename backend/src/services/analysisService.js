const openai = require("../config/openai");
const buildPrompt = require("../utils/prompt");

async function analyzeResume(jd, resumeText, hiringChoice, levelChoice) {
  const prompt = buildPrompt(jd, resumeText, hiringChoice, levelChoice);
  if (!prompt) {
    return { error: "Invalid hiring or level choice provided.", filename: "" };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = response.choices?.[0]?.message?.content;
    let resultText = content ? content.trim() : "Match %: 0\nDecision: ❌ Reject\nReason (if Rejected): No response from model.";

    let matchPercent = 0;
    const match = resultText.match(/Match\s*%:\s*(\d+)/);
    if (match) {
      matchPercent = Number(match[1]);
    }

    if (matchPercent < 72) {
      resultText = resultText.replace(/Decision:.*/, "Decision: ❌ Reject");
      if (resultText.includes("Reason (if Rejected):")) {
        resultText = resultText.replace(/Reason \(if Rejected\):.*/, "Reason (if Rejected): Match % below 72% threshold.");
      } else {
        resultText += "\nReason (if Rejected): Match % below 72% threshold.";
      }
    }

    return {
      result_text: resultText,
      match_percent: matchPercent,
      usage: response.usage
        ? {
            prompt_tokens: response.usage.prompt_tokens,
            completion_tokens: response.usage.completion_tokens,
            total_tokens: response.usage.total_tokens,
          }
        : null,
    };
  } catch (err) {
    return { error: `Analysis failed: ${err.message || err}`, filename: "" };
  }
}

module.exports = {
  analyzeResume,
};
