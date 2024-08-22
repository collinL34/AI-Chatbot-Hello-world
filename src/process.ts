import fs from "fs";
import PDFParser from "pdf2json";

// Converts local file information to a GoogleGenerativeAI.Part object.
export const fileToGenerativePart = (path, mimeType) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
};
