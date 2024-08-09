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

const getCurrentLocation = () => {
	return ""
}

const findPlace = (place) => {
	const tomTomApiKey = process.env.TOM_TOM_API_KEY;
	const url = `https://api.tomtom.com/search/2/search/${place}.json?key=${tomTomApiKey}`
	
	fetch(url).then((response) => response.text())
    .then((body) => {
        console.log(JSON.stringify(body));
    }); 
}

const routeToDestination = (destination) => {
	const currentLocation = getCurrentLocation();
	const tomTomApiKey = process.env.TOM_TOM_API_KEY;
}

async function functionCalling() {
	await parsePDF();

  // [START function_calling]
  // Make sure to include these imports:
  // import { GoogleGenerativeAI } from "@google/generative-ai";
  async function setLightValues(brightness, colorTemperature) {
    // This mock API returns the requested lighting values
    return {
      brightness,
      colorTemperature,
    };
  }

  const controlLightFunctionDeclaration = {
    name: "controlLight",
    parameters: {
      type: "OBJECT",
      description: "Set the brightness and color temperature of a room light.",
      properties: {
        brightness: {
          type: "NUMBER",
          description:
            "Light level from 0 to 100. Zero is off and 100 is full brightness.",
        },
        colorTemperature: {
          type: "STRING",
          description:
            "Color temperature of the light fixture which can be `daylight`, `cool` or `warm`.",
        },
      },
      required: ["brightness", "colorTemperature"],
    },
  };

  // Executable function code. Put it in a map keyed by the function name
  // so that you can call it once you get the name string from the model.
  const functions = {
    controlLight: ({ brightness, colorTemperature }) => {
      return setLightValues(brightness, colorTemperature);
    },
  };

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: { functionDeclarations: [controlLightFunctionDeclaration] },
  });
  const chat = model.startChat();
  const prompt = "Dim the lights so the room feels cozy and warm.";

  // Send the message to the model.
  const result = await chat.sendMessage([prompt, 
	readFile('./data.txt')
  ]);
  const calls = result.response.functionCalls();

  if (calls) {
	let data = []
	// TODO: Should probably use Promise.all() instead.
	for(var i = 0; i < calls.length; i++) {
		const call = calls[i];
		const apiResponse = await functions[call.name](call.args);
		data.push({
			functionResponse: {
			  name: call.name,
			  response: apiResponse,
			}
		})
        
	}

    // Send the API response back to the model so it can generate
    // a text response that can be displayed to the user.
    const result2 = await chat.sendMessage([
      data
    ]);

    // Log the text response.
    console.log(result2.response.text());
  }
  // [END function_calling]
}

functionCalling();
