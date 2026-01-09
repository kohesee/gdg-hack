#!/usr/bin/env node

/**
 * Svix Play Webhook Setup Script
 * This script helps you set up webhooks for local development using Svix Play
 */

const https = require('https')

async function createSvixPlayEndpoint() {
  console.log('🚀 Creating Svix Play endpoint for webhook testing...\n')
  
  const data = JSON.stringify({
    url: 'http://localhost:3000/api/webhooks/clerk',
    description: 'GDG Sprint1 Local Webhook Development'
  })

  const options = {
    hostname: 'api.svix.com',
    port: 443,
    path: '/v1/play/endpoints',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData)
          resolve(result)
        } catch (e) {
          reject(new Error('Failed to parse response'))
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(data)
    req.end()
  })
}

async function main() {
  try {
    console.log('📡 Setting up Svix Play for local webhook development\n')
    
    // Alternative method - direct instructions
    console.log('🔗 Manual Setup Instructions:')
    console.log('1. Go to https://play.svix.com')
    console.log('2. Click "Create a new endpoint"')
    console.log('3. Enter URL: http://localhost:3000/api/webhooks/clerk')
    console.log('4. Copy the Play URL (e.g., https://play.svix.com/in/c_xxx/)')
    console.log('5. Use this URL in your Clerk Dashboard webhook settings\n')
    
    console.log('🎯 Quick Setup Commands:')
    console.log('1. Start your dev server:')
    console.log('   bun run dev')
    console.log('\n2. In Clerk Dashboard → Webhooks → Add Endpoint:')
    console.log('   URL: [Svix Play URL from step 4 above]')
    console.log('   Events: user.created, user.updated, user.deleted')
    console.log('\n3. Copy webhook secret to .env.local:')
    console.log('   CLERK_WEBHOOK_SECRET=whsec_your_secret_here')
    console.log('\n4. Restart dev server and test!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n📋 Manual Setup:')
    console.log('Visit https://play.svix.com and follow the setup instructions above.')
  }
}

if (require.main === module) {
  main()
}

module.exports = { createSvixPlayEndpoint }