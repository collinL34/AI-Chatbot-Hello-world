import fs from "fs";
import PDFParser from "pdf2json"; 
import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const parsePDF = () => {
	const pdfParser = new PDFParser(this, 1);

	pdfParser.on("pdfParser_dataError", (errData) => console.error(errData.parserError));

	pdfParser.on("pdfParser_dataReady", (pdfData) => {
		fs.writeFile("./data.txt", pdfParser.getRawTextContent(), () => {
			console.log("Done.");
		});
	});
	
	pdfParser.loadPDF("./722.6.pdf"); //create text file from pdf contents
};

const readFile = (filePath) => {
	try {
	  	const data = fs.readFileSync(filePath);

	  	return data.toString();
	} catch (error) {
	  	console.error(`Got an error trying to read the file: ${error.message}`);
	}
};

const main = async() => {
	await parsePDF();

	const genAI = new GoogleGenerativeAI(process.env.API_KEY); //Init the LLM agent
	const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'}); //Define the model

	const result = await model.generateContent([
		'how do i identify my transmission?', //String Prompt to send to the LLM
		readFile('./data.txt') //Input data for the LLM to utilize for information
	]);

	console.log(result.response.text());
}

main(); //Basic level of utilizing RAG to help query LLM
