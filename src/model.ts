import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { getLocationNameFromCordinatesDeclaration } from "./location";
import {
  getCurrentLocationDeclaration,
  getWeatherDeclaration,
  getWeatherForecastDeclaration,
} from "./weather";
import { lockAndUnlockCarFunctionDeclaration } from "./vehicle";
import { getDateFunctionDeclaration } from "./dateTime";
import { controlLightFunctionDeclaration } from "./smartHome";

export function getAiModel(): GenerativeModel {
  let metadata = {
    functionDeclarations: [
      getCurrentLocationDeclaration,
      getDateFunctionDeclaration,
      getLocationNameFromCordinatesDeclaration,
      getWeatherForecastDeclaration,
      lockAndUnlockCarFunctionDeclaration,
      controlLightFunctionDeclaration,
      getWeatherDeclaration,
    ],
  };

  const tools = [metadata];

  const genAI = new GoogleGenerativeAI(process.env.API_KEY || "Invalid");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools,
  });

  return model;
}
