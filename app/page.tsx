'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Snowflake, Gift } from 'lucide-react';

const SNOWFLAKE_COUNT = 50;
const SNOWFLAKE_SIZES = ['text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
const TAP_THRESHOLD = 15;
const COIN_AMOUNTS = [200, 300, 400, 500, 1000, 1500, 2000, 2500, 3000];

const Snowflake = ({ onClick }: { onClick: () => void }) => {
  const size = SNOWFLAKE_SIZES[Math.floor(Math.random() * SNOWFLAKE_SIZES.length)];
  return (
    <div
      className={`absolute cursor-pointer ${size} text-white animate-fall`}
      style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 10 + 5}s`,
        animationDelay: `${Math.random() * 5}s`,
      }}
      onClick={onClick}
    >
      ❄️
    </div>
  );
};

const CoinBox = ({ amount, onComplete }: { amount: number; onComplete: () => void }) => {
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
  const [taps, setTaps] = useState(0);
  const [showCoinBox, setShowCoinBox] = useState(false);
  const [coinAmount, setCoinAmount] = useState(0);

  const handleSnowflakeTap = useCallback(() => {
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 relative overflow-hidden">
      {/* Santa Hat */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[64px] border-t-red-600 border-l-[64px] border-l-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-16 bg-red-600 rounded-b-full"></div>
        <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full transform translate-x-2 translate-y-2"></div>
      </div>

      {/* Coin Counter */}
      <div className="absolute top-4 left-4 bg-yellow-400 rounded-full px-4 py-2 text-2xl font-bold text-white shadow-lg">
        🪙 {coins}
      </div>

      {/* Snowflakes */}
      {[...Array(SNOWFLAKE_COUNT)].map((_, index) => (
        <Snowflake key={index} onClick={handleSnowflakeTap} />
      ))}

      {/* Coin Box */}
      {showCoinBox && (
        <CoinBox amount={coinAmount} onComplete={handleCoinBoxComplete} />
      )}
    </main>
  );
}