'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Gift } from 'lucide-react';

const SNOWFLAKE_COUNT = 50;
const SNOWFLAKE_SIZES = ['text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
const TAP_THRESHOLD = 5 + Math.floor(Math.random() * 8); // Random between 5 and 12
const COIN_AMOUNTS = [200, 300, 400, 500, 1000, 1500, 2000, 2500, 3000];

const SnowflakeElement = ({ onClick, id }: { onClick: (id: number) => void; id: number }) => {
  const size = SNOWFLAKE_SIZES[Math.floor(Math.random() * SNOWFLAKE_SIZES.length)];
  return (
    <div
      className={`absolute cursor-pointer ${size} text-white animate-fall`}
      style={{
        left: `${Math.random() * 100}%`,
        top: '-20px',
        animationDuration: `${Math.random() * 10 + 5}s`,
        animationDelay: `${Math.random() * -5}s`,
      }}
      onClick={() => onClick(id)}
    >
      ❄️
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
  const [coins, setCoins] = useState(0);
  const [snowflakesTapped, setSnowflakesTapped] = useState(0);
  const [taps, setTaps] = useState(0);
  const [showCoinBox, setShowCoinBox] = useState(false);
  const [coinAmount, setCoinAmount] = useState(0);
  const [snowflakes, setSnowflakes] = useState(Array.from({ length: SNOWFLAKE_COUNT }, (_, i) => ({ id: i, active: true })));

  const handleSnowflakeTap = useCallback((id: number) => {
    setSnowflakes(prev => prev.map(sf => sf.id === id ? { ...sf, active: false } : sf));
    setSnowflakesTapped(prev => prev + 1);
    setTaps((prevTaps) => {
      const newTaps = prevTaps + 1;
      if (newTaps >= TAP_THRESHOLD) {
        const amount = COIN_AMOUNTS[Math.floor(Math.random() * COIN_AMOUNTS.length)];
        setShowCoinBox(true);
        setCoinAmount(amount);
        setCoins((prevCoins) => prevCoins + amount);
        return 0;
      }
      return newTaps;
    });
  }, []);

  const handleCoinBoxComplete = useCallback(() => {
    setShowCoinBox(false);
    setCoinAmount(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnowflakes(prev => {
        const newSnowflakes = prev.filter(sf => sf.active);
        while (newSnowflakes.length < SNOWFLAKE_COUNT) {
          newSnowflakes.push({ id: Math.random(), active: true });
        }
        return newSnowflakes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 to-green-600 relative overflow-hidden">
      {/* Background Emojis */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {['🎄', '🎁', '🦌', '☃️', '🎅'].map((emoji, index) => (
          <div key={index} className="absolute text-4xl" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}>
            {emoji}
          </div>
        ))}
      </div>

      {/* Coin Counter */}
      <div className="absolute top-4 left-4 bg-yellow-400 rounded-full px-4 py-2 text-2xl font-bold text-white shadow-lg">
        🪙 {coins}
      </div>

      {/* Snowflakes Tapped Counter */}
      <div className="absolute top-4 right-4 bg-blue-400 rounded-full px-4 py-2 text-2xl font-bold text-white shadow-lg">
        ❄️ {snowflakesTapped}
      </div>

      {/* Snowflakes */}
      {snowflakes.filter(sf => sf.active).map((sf) => (
        <SnowflakeElement key={sf.id} id={sf.id} onClick={handleSnowflakeTap} />
      ))}

      {/* Coin Box */}
      {showCoinBox && (
        <CoinBox amount={coinAmount} onComplete={handleCoinBoxComplete} />
      )}
    </main>
  );
}