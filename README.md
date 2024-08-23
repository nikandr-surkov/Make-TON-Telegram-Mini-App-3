# Make TON Telegram Mini App 3: Referral System, Invite Friend Button, Invite Link

Welcome to the third guide in the **Make TON Telegram Mini App** series! This project demonstrates how to implement a referral system, an invite friend button, and an invite link in a Telegram Mini App using Next.js 14.

## Project Overview

This Telegram Mini App showcases:
- Setting up a Next.js 14 project with TypeScript and Tailwind CSS
- Implementing a simple referral system using file-based storage
- Creating an invite friend button that opens the Telegram share dialog
- Generating and copying invite links
- Displaying referral information and referred users
- Basic TypeScript usage for type safety

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- A Telegram account
- A Telegram Bot Token
- GitHub account
- Vercel account

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/Make-TON-Telegram-Mini-App-3.git
   cd Make-TON-Telegram-Mini-App-3
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Deployment and Usage

As this is a Telegram Mini App, you can't see the result directly in development mode. Follow these steps to deploy and use the app:

1. Push your code to a GitHub repository.
2. Sign up for a Vercel account if you haven't already.
3. Connect your GitHub repository to Vercel and deploy the app.
4. Once deployed, Vercel will provide you with a URL for your app.
5. Use this URL to set up your Telegram Mini App:
   - Go to [@BotFather](https://t.me/BotFather) on Telegram
   - Send the command `/newapp` or choose to edit an existing bot
   - Follow the prompts to set up your Mini App, using the Vercel URL as the Web App URL
6. Once set up, you can access your Mini App through Telegram on mobile devices or in the Web version of Telegram.

## Project Structure

- `app/page.tsx`: Main page component
- `components/ReferralSystem.tsx`: Referral system component
- `app/api/referrals/route.ts`: API route for handling referrals
- `lib/storage.ts`: In-memory storage utility functions

## Note on Data Storage

This demo uses an in-memory storage solution for simplicity and to avoid file system permission issues in serverless environments. In a production application, you should use a database or other persistent storage solution to maintain referral data across server restarts and multiple instances.

## YouTube Channel

For video tutorials and more in-depth explanations, check out my YouTube channel:
[Nikandr Surkov](https://www.youtube.com/@NikandrSurkov)

## Next Steps

Stay tuned for the next guide in the **Make TON Telegram Mini App** series, where we'll explore more advanced features and TON integration!