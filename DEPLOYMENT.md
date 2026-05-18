# Gemini CLI - Deployment Guide

This guide covers how to deploy the Gemini CLI tool on various hosting platforms.

## Quick Start (Local)

```bash
# Install dependencies
npm install

# Set your API key
export GEMINI_API_KEY=your_actual_key

# Run the CLI
npm run cli
```

## Docker Deployment

### Build and Run Locally with Docker

```bash
# Build the Docker image
docker build -f Dockerfile.cli -t gemini-cli .

# Run interactively
docker run -it -e GEMINI_API_KEY=your_key gemini-cli

# Run with a single prompt
docker run -e GEMINI_API_KEY=your_key gemini-cli "Your prompt here"
```

### Using Docker Compose

```bash
# Create a .env file with your API key
echo "GEMINI_API_KEY=your_actual_key" > .env

# Run with docker-compose
docker-compose -f docker-compose.cli.yml run --rm gemini-cli
```

## Cloud Platform Deployments

### AWS EC2

1. **Launch an EC2 instance:**
   - Choose Ubuntu 22.04 LTS AMI
   - Select an appropriate instance type (t3.micro is fine for testing)

2. **Connect and setup:**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Clone repository
   git clone https://github.com/kohesee/gdg-hack.git
   cd gdg-hack
   
   # Install dependencies
   npm install
   
   # Set environment variable
   export GEMINI_API_KEY=your_key
   
   # Run the CLI
   npm run cli
   ```

3. **Keep it running with PM2:**
   ```bash
   npm install -g pm2
   pm2 start "npm run cli" --name "gemini-cli"
   pm2 save
   pm2 startup
   ```

### DigitalOcean App Platform

1. **Create a new App**
2. **Connect your GitHub repository**
3. **Set the build command:**
   ```
   npm install
   ```
4. **Set the run command:**
   ```
   npm run cli
   ```
5. **Add environment variable:**
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key

### Heroku (with Buildpack)

```bash
# Login to Heroku
heroku login

# Create a new app
heroku create my-gemini-cli

# Set environment variable
heroku config:set GEMINI_API_KEY=your_key

# Deploy
git push heroku main
```

### AWS Lambda (Serverless)

Create a wrapper function in `lambda/handler.ts`:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function handler(event: any) {
  const prompt = event.queryStringParameters?.prompt || "Hello";
  const model = client.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ response: result.response.text() }),
  };
}
```

Deploy with:
```bash
npm install -g serverless
serverless deploy
```

### Google Cloud Run

1. **Create a Dockerfile (we already have Dockerfile.cli)**
2. **Build and push to Container Registry:**
   ```bash
   docker build -f Dockerfile.cli -t gcr.io/your-project/gemini-cli .
   docker push gcr.io/your-project/gemini-cli
   ```
3. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy gemini-cli \
     --image gcr.io/your-project/gemini-cli \
     --set-env-vars GEMINI_API_KEY=your_key \
     --allow-unauthenticated
   ```

### Azure Container Instances

```bash
# Create a resource group
az group create --name gemini-cli-rg --location eastus

# Create a container instance
az container create \
  --resource-group gemini-cli-rg \
  --name gemini-cli \
  --image gemini-cli \
  --cpu 1 --memory 1 \
  --environment-variables GEMINI_API_KEY=your_key
```

## Using a Process Manager

### PM2 (Recommended for VPS)

```bash
# Install PM2 globally
npm install -g pm2

# Start the CLI in daemon mode (useful for background services)
pm2 start "npm run cli" --name "gemini-cli"

# View logs
pm2 logs gemini-cli

# Auto-restart on system reboot
pm2 startup
pm2 save
```

### systemd (For Linux servers)

Create `/etc/systemd/system/gemini-cli.service`:

```ini
[Unit]
Description=Gemini CLI Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/gdg-hack
Environment="GEMINI_API_KEY=your_key"
ExecStart=/usr/bin/npm run cli
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable gemini-cli
sudo systemctl start gemini-cli
```

## Security Best Practices

1. **Never commit your API key:**
   - Use `.env.local` or environment variables
   - Add `.env.local` to `.gitignore`

2. **Use secret management:**
   - AWS Secrets Manager
   - DigitalOcean App Secrets
   - GitHub Secrets (if using CI/CD)

3. **Rotate API keys regularly:**
   - Monitor API usage
   - Disable old keys

4. **Rate limiting:**
   - Implement rate limiting on your own wrapper
   - Monitor Gemini API quotas

5. **Network security:**
   - Use HTTPS for any web interface
   - Restrict API access by IP if possible
   - Use firewalls appropriately

## Monitoring and Maintenance

### Monitor API Usage
```bash
# Check logs
pm2 logs gemini-cli

# View recent interactions
tail -f logs/gemini-cli.log
```

### Auto-scaling (Production)

For production setups with high traffic:
- Use Kubernetes with auto-scaling
- Set up load balancing
- Monitor CPU and memory usage

### Backup and Recovery

- Regularly backup your application code
- Keep your `.env` variables safe and documented
- Document your deployment process

## Support and Troubleshooting

- Check that Node.js version is 18+
- Verify GEMINI_API_KEY is set correctly
- Ensure network connectivity
- Check API rate limits and quotas
- Review Gemini API documentation for model availability

## Next Steps

- Set up monitoring and alerting
- Configure automatic deployments with GitHub Actions
- Add custom error handling and logging
- Consider adding a simple REST API wrapper
