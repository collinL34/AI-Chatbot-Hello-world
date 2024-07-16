import fs from 'fs';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
const fileToGenerativePart = (path, mimeType) => {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
};

const run = async() => {
	// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
	const prompt = "What's different between these pictures?";

	const imageParts = [
		fileToGenerativePart("./green.jpg", "image/jpg"),
		fileToGenerativePart("./red.jpg", "image/jpg"),
	];

	const result = await model.generateContent([prompt, ...imageParts]);
	console.log(result.response.text());
};

run();