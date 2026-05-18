# Gemini CLI - Access AI Anywhere

A simple, lightweight CLI tool to access Google's Gemini AI from anywhere in the world. No fancy TUI, just pure simplicity.

## Features

- 🚀 Simple command-line interface
- 💬 Interactive mode for continuous conversations
- 🔌 Piped input mode for scripting and automation
- 🔐 Secure API key management via environment variables
- 📦 Easy to deploy and host

## Prerequisites

- Node.js 18+ and npm/yarn
- Google Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Installation

1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/kohesee/gdg-hack.git
   cd gdg-hack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Gemini API key:
   ```bash
   # Copy the example env file
   cp .env.local.example .env.local

   # Edit .env.local and add your Gemini API key
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Usage

### Interactive Mode

Run the CLI with no arguments to enter interactive mode:

```bash
npm run cli
```

Then simply type your prompts and press Enter. Type `exit` to quit.

```
Gemini CLI - Interactive Mode
Type your prompt and press Enter. Type 'exit' to quit.

You: What is the capital of France?
Assistant: The capital of France is Paris...
```

### Single Prompt Mode

Pass a prompt directly as arguments:

```bash
npm run cli What is the meaning of life?
```

The response will be printed to stdout and the program will exit.

### Piped Input Mode

Use pipes to integrate with other commands:

```bash
echo "Explain quantum computing in simple terms" | npm run cli
```

### Docker Deployment

Build and run the CLI in a Docker container:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV GEMINI_API_KEY=your_api_key_here

ENTRYPOINT ["npm", "run", "cli"]
```

Build and run:
```bash
docker build -t gemini-cli .
docker run -e GEMINI_API_KEY=your_key_here gemini-cli "What is AI?"
```

### Environment Variables

- `GEMINI_API_KEY` (required): Your Google Gemini API key
- `GEMINI_MODEL` (optional): The Gemini model to use. Defaults to `gemini-pro`. You can use other models like `gemini-pro-vision` if available.

## Examples

**Ask a question:**
```bash
GEMINI_API_KEY=your_key npm run cli "Explain neural networks"
```

**Interactive chat:**
```bash
GEMINI_API_KEY=your_key npm run cli
```

**Generate creative content:**
```bash
npm run cli "Write a haiku about programming"
```

**Use in scripts:**
```bash
#!/bin/bash
export GEMINI_API_KEY="your_key"
response=$(npm run cli "Translate 'hello' to Spanish")
echo "Translation: $response"
```

## Hosting Options

### 1. VPS/Cloud Server
- Deploy to AWS EC2, DigitalOcean, Linode, etc.
- Install Node.js
- Clone repo and set GEMINI_API_KEY environment variable
- Run with a process manager (PM2, systemd, etc.)

### 2. Serverless (AWS Lambda, Google Cloud Functions)
- Wrap the CLI logic in a handler function
- Deploy and invoke via API

### 3. Docker Container
- Containerize with Dockerfile
- Deploy to Docker Hub, AWS ECR, or Kubernetes

### 4. Local Development
- Run locally for testing and development
- Share with team members via `.env.local.example`

## Troubleshooting

**Error: GEMINI_API_KEY environment variable is not set**
- Make sure to set the environment variable before running:
  ```bash
  export GEMINI_API_KEY=your_actual_key
  npm run cli
  ```

**Rate limiting errors**
- Gemini API has rate limits. Wait before making additional requests.

**Connection errors**
- Check your internet connection
- Verify your API key is valid
- Ensure the Gemini API is available in your region

## Contributing

Feel free to contribute improvements or bug fixes!

## License

MIT
