'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confettiModule from 'canvas-confetti';

// Use type assertion to treat confettiModule as 'any'
const confetti = confettiModule as any;

export default function DailyChest() {
  const [coins, setCoins] = useState(0);
  const [chestOpened, setChestOpened] = useState(false);
  const [lastOpenedDate, setLastOpenedDate] = useState<string | null>(null);

  useEffect(() => {
    const storedCoins = localStorage.getItem('coins');
    if (storedCoins) setCoins(parseInt(storedCoins));

    const storedDate = localStorage.getItem('lastOpenedDate');
    if (storedDate) setLastOpenedDate(storedDate);
  }, []);

  const handleOpenChest = () => {
    const today = new Date().toDateString();
    if (lastOpenedDate === today) {
      alert("You've already opened the chest today. Come back tomorrow!");
      return;
    }

    const newCoins = Math.floor(Math.random() * 50) + 10; // Random between 10 and 59
    const updatedCoins = coins + newCoins;
    setCoins(updatedCoins);
    setChestOpened(true);
    setLastOpenedDate(today);

    localStorage.setItem('coins', updatedCoins.toString());
    localStorage.setItem('lastOpenedDate', today);

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Reset chest after animation
    setTimeout(() => setChestOpened(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Daily Christmas Chest</h1>
      
      <motion.div
        className="relative"
        animate={chestOpened ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={chestOpened ? "/open-chest.png" : "/closed-chest.png"}
          alt="Treasure Chest"
          className="w-64 h-64 object-contain"
        />
        {chestOpened && (
          <motion.div
            className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-6xl">🪙</span>
          </motion.div>
        )}
      </motion.div>

      <button
        onClick={handleOpenChest}
        className="mt-8 px-6 py-3 bg-yellow-500 text-white rounded-full font-bold text-xl shadow-lg hover:bg-yellow-600 transition duration-300"
      >
        Open Daily Chest
      </button>

      <div className="mt-8 text-2xl font-bold text-white">
        Total Coins: {coins} 🪙
      </div>

      {lastOpenedDate && (
        <div className="mt-4 text-lg text-white opacity-80">
          Last opened: {new Date(lastOpenedDate).toLocaleDateString()}
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white text-4xl animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            ❄️
          </div>
        ))}
      </div>
    </div>
  );
}