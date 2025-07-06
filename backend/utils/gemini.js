import fetch from 'node-fetch';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function callGemini(prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  console.log("Gemini API Key:", GEMINI_API_KEY);
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not set');
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const error = await response.text();
    if (response.status === 429) {
      throw new Error('You have hit the free Gemini API usage limit. Please wait a few minutes and try again.');
    }
    throw new Error(`Gemini API error: ${error}`);
  }
  const data = await response.json();
  // Extract the AI's reply
  const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return suggestion;
} 