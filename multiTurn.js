import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
  	// The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
  	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  	// A way to pre-populate follow up prompts to the LLM
	const chat = model.startChat({
		history: [
			{
				role: "user",
				parts: [{ text: "Hello, I have 2 dogs in my house." }],
			},
			{
				role: "model",
				parts: [{ text: "Great to meet you. What would you like to know?" }],
			},
		],
		generationConfig: {
			maxOutputTokens: 100,
		},
	});

	const msg = "How many paws are in my house?";
	const result = await chat.sendMessage(msg);
	
	console.log(result.response.text());
}

run();