#!/usr/bin/env node

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as readline from "readline";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-pro";

if (!API_KEY) {
  console.error(
    "Error: GEMINI_API_KEY environment variable is not set.\nPlease set it before running the CLI tool."
  );
  process.exit(1);
}

const client = new GoogleGenerativeAI(API_KEY);

async function generateResponse(prompt: string): Promise<string> {
  try {
    const model = client.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("API_KEY")) {
        throw new Error("Invalid API key. Please check your GEMINI_API_KEY.");
      } else if (error.message.includes("rate")) {
        throw new Error(
          "Rate limit exceeded. Please wait before making another request."
        );
      } else if (error.message.includes("model")) {
        throw new Error(
          `Model '${MODEL}' not found. Please check GEMINI_MODEL environment variable.`
        );
      }
      throw error;
    }
    throw new Error("An unexpected error occurred while calling the API.");
  }
}


async function interactiveMode(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Gemini CLI - Interactive Mode");
  console.log("Type your prompt and press Enter. Type 'exit' to quit.\n");

  while (true) {
    const input = await new Promise<string>((resolve) => {
      rl.question("You: ", (answer) => {
        resolve(answer);
      });
    });

    if (input.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      break;
    }

    if (input.trim() !== "") {
      try {
        const response = await generateResponse(input);
        console.log(`\nAssistant: ${response}\n`);
      } catch (error) {
        console.error("Error:", (error as Error).message);
      }
    }
  }
}


async function singlePromptMode(prompt: string): Promise<void> {
  try {
    const response = await generateResponse(prompt);
    console.log(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error:", errorMessage);
    process.exit(1);
  }
}


async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await interactiveMode();
  } else {
    const prompt = args.join(" ");
    await singlePromptMode(prompt);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
