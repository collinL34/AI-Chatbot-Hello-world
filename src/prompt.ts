import dotenv from "dotenv";
import readline from "readline";
import { fileToGenerativePart } from "./process";
import { getAiModel } from "./model";
import { handleFunctionCalls } from "./functions";

console.log("Starting...");

dotenv.config();

const systemMessage =
  "You are a happy, loving and slightly sassy assitant. " +
  "You will help people and use lots of emoticons. " +
  "Dont be overly verbose or too sappy. ";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function startPrompt() {
  const imageParts = [
    fileToGenerativePart("./data/images/green.jpg", "image/jpg"), //Past in the file path; next define the type of data
    fileToGenerativePart("./data/images/red.jpg", "image/jpg"),
  ];

  const model = getAiModel();
  const chat = model.startChat();

  const res = await chat.sendMessage([
    "Were starting a chat conversation",
    systemMessage,
    ...imageParts,
    "You don't need to mention the images of cars"
  ]);

  console.log(res.response.text());

  rl.on("line", async (prompt) => {
    const result = await chat.sendMessage([prompt, systemMessage]);
    const calls = result.response.functionCalls();

    if (calls) {
      /* 
        Send the API response back to the model so it can generate
         a text response that can be displayed to the user. 
         */
      const parts = await handleFunctionCalls(calls);
      const result2 = await chat.sendMessage([...parts]);

      console.log(result2.response.text());

      rl.prompt();
    } else {
      console.log(result.response.text());
      rl.prompt();
    }
  }).on("close", async () => {
    const result = await chat.sendMessage([
      "Okay im leaving now, bye!",
      systemMessage,
    ]);

    const bye = result.response.text();

    console.log(bye);
    process.exit(0);
  });
}

startPrompt().then(() => {});
