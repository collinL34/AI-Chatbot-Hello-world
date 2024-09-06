import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { getFunctionDeclarations } from "./declarations/index";

export function getAiModel(): GenerativeModel {
  let functions = getFunctionDeclarations();

  let metadata = {
    functionDeclarations: [...functions],
  };

  const tools = [metadata];

  const genAI = new GoogleGenerativeAI(process.env["API_KEY"] || "Invalid");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools,
  });

  return model;
}
