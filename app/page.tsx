'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Gift } from 'lucide-react';
import { useAdsgram } from '../hooks/useAdsgram';

const SNOWFLAKE_COUNT = 30;
const SNOWFLAKE_SIZES = ['text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'];
const TAP_THRESHOLD = 9 + Math.floor(Math.random() * 4); // Random between 9 and 12
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
  const [isLoading, setIsLoading] = useState(true);

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

      setIsLoading(false); // Set loading to false once music is loaded
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

  // Play sound effect
  const playSound = useCallback((buffer: AudioBuffer) => {
    if (audioContextRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    }
  }, []);

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        setTelegramId(WebApp.initDataUnsafe.user?.id.toString() || '');
        setTelegramUsername(WebApp.initDataUnsafe.user?.username || '');
      }
    };
    initWebApp();

    // Initialize snowflakes
    const initialSnowflakes = Array.from({ length: SNOWFLAKE_COUNT }, (_, i) => ({ 
      id: i, 
      x: Math.random() * 100, 
      y: Math.random() * -100 - 20, // Start above the screen
      size: SNOWFLAKE_SIZES[Math.floor(Math.random() * SNOWFLAKE_SIZES.length)]
    }));
    setSnowflakes(initialSnowflakes);

    // Start snowflake animation
    const animateSnowflakes = () => {
      setSnowflakes(prev => prev.map(sf => ({
        ...sf,
        y: sf.y <= 100 ? sf.y + 0.1 : -20 // Reset to top when it goes off-screen
      })));
    };

    const animationInterval = setInterval(animateSnowflakes, 50);

    return () => clearInterval(animationInterval);
  }, []);

  // Update localStorage whenever coins change
  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
  }, [coins]);

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

  // Adsgram integration
  const onReward = useCallback(() => {
    setCoins(prevCoins => prevCoins + 50); // Reward 50 coins for watching an ad
  }, []);

  const onError = useCallback((result: any) => {
    console.error('Ad error:', result);
  }, []);

  const showAd = useAdsgram({
    blockId: "your-block-id", // Replace with your actual block ID
    onReward,
    onError
  });

  const handleWatchAd = useCallback(async () => {
    await showAd();
  }, [showAd]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-green-900">
        <div className="text-white text-2xl">Loading game assets...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-green-900 to-green-600 relative overflow-hidden">
      {/* Impressive Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/winter_landscape.jpg')" }} />
      <div className="absolute inset-0 bg-green-900 bg-opacity-50" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundEmojis}
      </div>

      {/* Ad Watch Button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={handleWatchAd}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Watch Ad
        </button>
      </div>

      {/* Coin Counter */}
      <div className="absolute top-4 left-4 bg-red-900 rounded-full px-4 py-2 text-2xl font-bold text-white shadow-lg">
        <span className="text-yellow-400">🪙</span> {coins}
      </div>

      {/* Snowflakes Tapped Counter */}
      <div className="absolute top-4 right-4 bg-blue-400 rounded-full px-4 py-2 text-2xl font-bold text-white shadow-lg">
        ❄️ {snowflakesTapped}
      </div>

      {/* Snowflakes */}
      {snowflakes.map((sf) => (
        <SnowflakeElement key={sf.id} id={sf.id} x={sf.x} y={sf.y} size={sf.size} onClick={handleSnowflakeTap} />
      ))}

      {/* Burst Effects */}
      {burstEffects.map(burst => (
        <BurstEffect key={burst.id} x={burst.x} y={burst.y} />
      ))}

      {/* Coin Box */}
      {showCoinBox && (
        <CoinBox amount={coinAmount} onComplete={handleCoinBoxComplete} />
      )}
    </div>
  );
}
