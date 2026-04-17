require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  try {
    const ai = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const json = await ai.json();
    if(json.models) {
      json.models.forEach(m => console.log(m.name));
    } else {
      console.log(json);
    }
  } catch (e) {
    console.error(e);
  }
}
run();
