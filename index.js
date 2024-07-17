import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const prompts = process.argv[2]; //Incoming prompt from user
const MODEL = 'gemini-1.5-flash'; //Most used and popular model; 1.0 pro is also a good option but tended to be shorter less informative responses
console.log(`** GenAI text: '${MODEL}' model & prompts '${prompts}'\n`);

async function main() {
	const genAI = new GoogleGenerativeAI(process.env.API_KEY); //Init the LLM agent
	const model = genAI.getGenerativeModel({model: MODEL}); //Define the model

	const result = await model.generateContentStream(prompts); //Enter the prompt to the LLM; currently not defining any custom context

	//Here we are looping through the incoming stream data as it completes we log it; this could be a great way to get a quick response
	for await (const chunk of result.stream) {
		const chunkText = chunk.text();
		console.log(chunkText);
	}
}

main();
