import fs from "fs";

// Converts local file information to a GoogleGenerativeAI.Part object.
export const fileToGenerativePart = (path: any, mimeType: String) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
};
