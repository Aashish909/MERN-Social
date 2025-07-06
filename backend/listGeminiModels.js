import dotenv from "dotenv";
dotenv.config();
import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`)
  .then(res => res.json())
  .then(console.log)
  .catch(console.error); 