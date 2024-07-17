import prompt from 'prompt';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY); //Init the LLM agent
const model = genAI.getGenerativeModel({model: MODEL}); //Define the model

prompt.start();
console.log('Ask the gini anything ...');

prompt.get(['prompt'], async(err, data) => {
    if (data.prompt === 'exit') {
        console.log('exiting.');
        process.exit(0);
    }

    console.log(`** GenAI text: '${model}' model & prompts '${data.prompt}'\n`)
    const result = await model.generateContentStream(prompts); //Enter the prompt to the LLM; currently not defining any custom context

    console.log(result.response.text());
});
