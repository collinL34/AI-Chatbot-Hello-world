import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const prompts = process.argv[2];
const MODEL = 'gemini-1.5-flash';
console.log(`** GenAI text: '${MODEL}' model & prompts '${prompts}'\n`)

async function main() {
	const genAI = new GoogleGenerativeAI(process.env.API_KEY);
	const model = genAI.getGenerativeModel({model: MODEL});

	const result = await model.generateContentStream(prompts)
	let text = '';
	for await (const chunk of result.stream) {
		const chunkText = chunk.text();
		console.log(chunkText);
		text += chunkText;
	}
}

main();
