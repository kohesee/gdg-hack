#!/usr/bin/env node

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as readline from "readline";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error(
    "Error: GEMINI_API_KEY environment variable is not set.\nPlease set it before running the CLI tool."
  );
  process.exit(1);
}

const client = new GoogleGenerativeAI(API_KEY);

async function chat(prompt: string): Promise<string> {
  const model = client.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text();
}

async function interactiveMode(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Gemini CLI - Interactive Mode");
  console.log("Type your prompt and press Enter. Type 'exit' to quit.\n");

  const askQuestion = (): void => {
    rl.question("You: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        console.log("Goodbye!");
        rl.close();
        return;
      }

      if (input.trim() === "") {
        askQuestion();
        return;
      }

      try {
        const response = await chat(input);
        console.log(`\nAssistant: ${response}\n`);
      } catch (error) {
        console.error("Error:", (error as Error).message);
      }

      askQuestion();
    });
  };

  askQuestion();
}

async function pipeMode(prompt: string): Promise<void> {
  try {
    const response = await chat(prompt);
    console.log(response);
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await interactiveMode();
  } else {
    const prompt = args.join(" ");
    await pipeMode(prompt);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
