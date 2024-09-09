import { NextResponse } from 'next/server';

const tasks = [
  {
    id: 1,
    title: "Follow on TikTok",
    description: "Follow our official TikTok account for exciting content!",
    link: "https://www.tiktok.com/@youraccount",
    reward: 500,
    emoji: "📱"
  },
  {
    id: 2,
    title: "Join Telegram Channel",
    description: "Join our Telegram channel for the latest updates!",
    link: "https://t.me/yourchannel",
    reward: 300,
    emoji: "📢"
  },
  {
    id: 3,
    title: "Follow on Instagram",
    description: "Follow our Instagram for beautiful photos and stories!",
    link: "https://www.instagram.com/youraccount",
    reward: 400,
    emoji: "📷"
  },
  {
    id: 4,
    title: "Follow on Twitter",
    description: "Follow us on Twitter for quick updates and news!",
    link: "https://twitter.com/youraccount",
    reward: 350,
    emoji: "🐦"
  },
  {
    id: 5,
    title: "Subscribe on YouTube",
    description: "Subscribe to our YouTube channel for exciting videos!",
    link: "https://www.youtube.com/yourchannel",
    reward: 600,
    emoji: "🎥"
  }
];

export async function GET() {
  return NextResponse.json(tasks);
}