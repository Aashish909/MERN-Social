import { callGemini } from '../utils/gemini.js';

// Placeholder AI controller functions for Gemini API integration
export const aiGrammarCorrect = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    const prompt = `Correct this message's grammar and suggest a more professional tone: '${message}'`;
    const suggestion = await callGemini(prompt);
    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ message: err.message || 'AI error' });
  }
};

export const aiRewrite = async (req, res) => {
  try {
    const { message, tone } = req.body;
    if (!message || !tone) return res.status(400).json({ message: 'Message and tone are required' });
    const prompt = `Rewrite this message in a more ${tone} tone: '${message}'`;
    const suggestion = await callGemini(prompt);
    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ message: err.message || 'AI error' });
  }
};

export const aiSummarize = async (req, res) => {
  try {
    let { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' });
    }
    // Support both array of strings and array of objects with text
    messages = messages.map(m => typeof m === 'string' ? m : m.text || '');
    const prompt = `Summarize the following conversation:\n${messages.join('\n')}`;
    const summary = await callGemini(prompt);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message || 'AI error' });
  }
};

export const aiSmartReply = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    const prompt = `Suggest 3 short, natural-sounding replies to this message: '${message}'. Return only the replies as a numbered list.`;
    const aiResponse = await callGemini(prompt);
    // Parse the AI response into an array (expects numbered list)
    const replies = aiResponse
      .split(/\n|\r/)
      .map(line => line.replace(/^\d+\.|^- /, '').trim())
      .filter(line => line.length > 0);
    res.json({ replies });
  } catch (err) {
    res.status(500).json({ message: err.message || 'AI error' });
  }
};

export const aiAssistant = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

export const aiTranslate = async (req, res) => {
  try {
    const { message, targetLanguage } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    // Default to English if not specified
    const language = targetLanguage || 'English';
    const prompt = `Translate the following message to ${language}. Auto-detect the source language. Respond ONLY with the translation, nothing else.\nMessage: '${message}'`;
    const translation = await callGemini(prompt);
    res.json({ translation });
  } catch (err) {
    res.status(500).json({ message: err.message || 'AI error' });
  }
};

export const aiModerate = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
}; 