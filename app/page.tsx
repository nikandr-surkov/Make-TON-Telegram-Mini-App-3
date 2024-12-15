'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Gift, Check, X } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";

const SNOWFLAKE_COUNT = 30;
const SNOWFLAKE_SIZES = ['text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'];
const TAP_THRESHOLD = 9 + Math.floor(Math.random() * 4); 
const COIN_AMOUNTS = [50, 100, 150, 200, 250];

const SnowflakeElement = ({ onClick, id, x, y, size }: { onClick: (id: number) => void; id: number; x: number; y: number; size: string }) => {
  return (
    <div
      className={`absolute cursor-pointer ${size} text-white animate-fall`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={() => onClick(id)}
    >
      ❄️
    </div>
  );
};

const BurstEffect = ({ x, y }: { x: number; y: number }) => {
  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%` }}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full animate-burst"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-20px)`,
          }}
        />
      ))}
    </div>
  );
};

const CoinBox = ({ amount, onComplete }: { amount: number; onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative">
        <Gift className="text-red-600 w-32 h-32 animate-bounce" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-yellow-400 animate-coin-reveal">
            +{amount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [coins, setCoins] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedCoins = localStorage.getItem('coins');
      return storedCoins ? parseInt(storedCoins, 10) : 0;
    }
    return 0;
  });
  const [snowflakesTapped, setSnowflakesTapped] = useState(0);
  const [taps, setTaps] = useState(0);
  const [showCoinBox, setShowCoinBox] = useState(false);
  const [coinAmount, setCoinAmount] = useState(0);
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; x: number; y: number; size: string }>>([]);
  const [burstEffects, setBurstEffects] = useState<{id: number; x: number; y: number}[]>([]);
  const [telegramId, setTelegramId] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');

  // New state for daily check-in
  const [isDailyCheckInOpen, setIsDailyCheckInOpen] = useState(false);
  const [dailyCheckInStatus, setDailyCheckInStatus] = useState<{[key: string]: boolean}>({});
  const [canClaimToday, setCanClaimToday] = useState(false);

  // Audio context and sources
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgMusicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const tapMusicBufferRef = useRef<AudioBuffer | null>(null);
  const comboMusicBufferRef = useRef<AudioBuffer | null>(null);

  // Initialize audio context and load sounds
  useEffect(() => {
    const initAudio = async () => {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const loadSound = async (url: string) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await audioContextRef.current!.decodeAudioData(arrayBuffer);
      };

      const [bgBuffer, tapBuffer, comboBuffer] = await Promise.all([
        loadSound('gamemusic/bg-music.mp3'),
        loadSound('gamemusic/tap-music.mp3'),
        loadSound('gamemusic/combo-music.mp3')
      ]);

      // Start background music
      bgMusicSourceRef.current = audioContextRef.current.createBufferSource();
      bgMusicSourceRef.current.buffer = bgBuffer;
      bgMusicSourceRef.current.loop = true;
      bgMusicSourceRef.current.connect(audioContextRef.current.destination);
      bgMusicSourceRef.current.start();

      // Store other buffers for later use
      tapMusicBufferRef.current = tapBuffer;
      comboMusicBufferRef.current = comboBuffer;
    };

    initAudio();

    return () => {
      if (bgMusicSourceRef.current) {
        bgMusicSourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Initialize the user 
  const initializeUser = async (
    telegram_id: string,
    telegram_username: string,
    startParameter?: string
  ) => {
    const storageKey = `telemasOpenedBefore_${telegram_id}`;
    const hasOpenedBefore = localStorage.getItem(storageKey) === 'true';

    if (hasOpenedBefore) {
      console.log('User has opened the app before, skipping database query');
      return { success: true, message: 'User already initialized' };
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id,
          telegram_username,
          referrer_id: startParameter,
          coin_balance: 0,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log('User initialized successfully');
        localStorage.setItem(storageKey, 'true');
      } else {
        console.error('Error initializing user:', data.error);
      }

      return data;
    } catch (error) {
      console.error('Error initializing user:', error);
      return { success: false, error: 'Failed to initialize user' };
    }
  };

  // Telegram WebApp Initialization
  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        const user = WebApp.initDataUnsafe.user;
        const startParameter = WebApp.initDataUnsafe.start_param;

        if (user) {
          setTelegramId(user.id.toString());
          setTelegramUsername(user.username || '');

          // Initialize user in the database
          const result = await initializeUser(
            user.id.toString(),
            user.username || '',
            startParameter
          );

          if (result.success) {
            console.log('User initialized in the database');
          } else {
            console.error('Failed to initialize user in the database:', result.error);
          }
        }
      }
    };

    initWebApp();

    // Initialize snowflakes
    const initialSnowflakes = Array.from({ length: SNOWFLAKE_COUNT }, (_, i) => ({ 
      id: i, 
      x: Math.random() * 100, 
      y: Math.random() * -100 - 20, 
      size: SNOWFLAKE_SIZES[Math.floor(Math.random() * SNOWFLAKE_SIZES.length)]
    }));
    setSnowflakes(initialSnowflakes);

    // Start snowflake animation
    const animateSnowflakes = () => {
      setSnowflakes(prev => prev.map(sf => ({
        ...sf,
        y: sf.y <= 100 ? sf.y + 0.1 : -20 
      })));
    };

    const animationInterval = setInterval(animateSnowflakes, 50);

    return () => clearInterval(animationInterval);
  }, []);

  // Update localStorage whenever coins change
  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
  }, [coins]);

  // Play sound effect
  const playSound = useCallback((buffer: AudioBuffer) => {
    if (audioContextRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    }
  }, []);

  const handleSnowflakeTap = useCallback((id: number) => {
    setSnowflakes(prev => {
      const tappedSnowflake = prev.find(sf => sf.id === id);
      if (tappedSnowflake) {
        setBurstEffects(bursts => [...bursts, { id: Date.now(), x: tappedSnowflake.x, y: tappedSnowflake.y }]);
        return prev.map(sf => sf.id === id ? { ...sf, y: Math.random() * -100 - 20 } : sf);
      }
      return prev;
    });
    setSnowflakesTapped(prev => prev + 1);
    setTaps((prevTaps) => {
      const newTaps = prevTaps + 1;
      if (newTaps >= TAP_THRESHOLD) {
        const amount = COIN_AMOUNTS[Math.floor(Math.random() * COIN_AMOUNTS.length)];
        setShowCoinBox(true);
        setCoinAmount(amount);
        setCoins((prevCoins) => prevCoins + amount);
        // Play combo sound
        if (comboMusicBufferRef.current) {
          playSound(comboMusicBufferRef.current);
        }
        return 0;
      }
      return newTaps;
    });
    // Play tap sound
    if (tapMusicBufferRef.current) {
      playSound(tapMusicBufferRef.current);
    }
  }, [playSound]);

  const handleCoinBoxComplete = useCallback(() => {
    setShowCoinBox(false);
    setCoinAmount(0);
  }, []);

  useEffect(() => {
    const burstTimeout = setTimeout(() => {
      setBurstEffects([]);
    }, 1000);

    return () => clearTimeout(burstTimeout);
  }, [burstEffects]);

  // Christmas Themed Daily Check-in Calendar
  const generateChristmasCalendar = useCallback(() => {
    const today = new Date();
    const christmasDay = new Date(today.getFullYear(), 11, 25);
    const daysLeft = Math.max(0, Math.ceil((christmasDay.getTime() - today.getTime()) / (1000 * 3600 * 24)));

    return Array.from({ length: daysLeft }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        date: date,
        day: date.getDate(),
        isClaimed: dailyCheckInStatus[date.toISOString().split('T')[0]] || false,
        reward: 500 * (i + 1)
      };
    });
  }, [dailyCheckInStatus]);

  // Check-in Claim Function
  const handleDailyCheckIn = useCallback((calendarEntry: any) => {
    const dateKey = calendarEntry.date.toISOString().split('T')[0];
    
    if (!dailyCheckInStatus[dateKey]) {
      // Mark as claimed
      const updatedStatus = {
        ...dailyCheckInStatus,
        [dateKey]: true
      };
      setDailyCheckInStatus(updatedStatus);

      // Add coins
      setCoins(prev => prev + calendarEntry.reward);

      // Save to local storage
      localStorage.setItem('dailyCheckInStatus', JSON.stringify(updatedStatus));
      localStorage.setItem('lastCheckInDate', dateKey);
    }
  }, [dailyCheckInStatus]);

  // Initialize Daily Check-in Status
  useEffect(() => {
    const storedStatus = localStorage.getItem('dailyCheckInStatus');
    const lastCheckInDate = localStorage.getItem('lastCheckInDate');
    const today = new Date().toISOString().split('T')[0];

    if (storedStatus) {
      const parsedStatus = JSON.parse(storedStatus);
      setDailyCheckInStatus(parsedStatus);
      
      // Check if today's check-in is available
      setCanClaimToday(!parsedStatus[today]);
    }

    // Automatically open daily check-in if not claimed today
    if (lastCheckInDate !== today) {
      setIsDailyCheckInOpen(true);
      setCanClaimToday(true);
    }
  }, []);

  // Background Emojis
  const backgroundEmojis = useMemo(() => 
    ['🎄', '🎁', '🦌', '☃️', '🎅'].map((emoji, index) => (
      <div key={index} className="absolute text-4xl opacity-20" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}>
        {emoji}
      </div>
    )), []);

  // Daily Check-in Modal Component
  const DailyCheckInModal = () => {
    const christmasCalendar = generateChristmasCalendar();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-red-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border-4 border-green-700">
          <div className="text-center mb-4">
            <h2 className="text-4xl font-extrabold text-yellow-300 mb-2">🎄 Christmas Countdown 🎄</h2>
            <p className="text-white text-lg">Claim your daily festive rewards!</p>
          </div>
          
          {/* Christmas Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {christmasCalendar.map((entry, index) => (
              <div 
                key={index} 
                className={`
                  relative text-center p-2 rounded-lg 
                  ${entry.isClaimed ? 'bg-green-600 text-white' : 'bg-white text-red-900'}
                  transform transition-all 
                  ${entry.isClaimed ?
