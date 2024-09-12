'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StarBurst = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl animate-burst"
          style={{
            left: '50%',
            top: '50%',
            animation: `burst 1s ease-out forwards ${Math.random() * 0.5}s`,
            transform: `rotate(${i * 18}deg) translateY(-100px)`,
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  );
};

const Snowflakes = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute text-white text-4xl animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 10 + 5}s`,
          animationDelay: `${Math.random() * 5}s`,
          zIndex: 10
        }}
      >
        ❄️
      </div>
    ))}
  </div>
);

export default function DailyChest() {
  const [coins, setCoins] = useState(0);
  const [chestOpened, setChestOpened] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [newCoins, setNewCoins] = useState(0);

  useEffect(() => {
    const storedCoins = localStorage.getItem('coins');
    if (storedCoins) setCoins(parseInt(storedCoins));
  }, []);

  const handleOpenChest = () => {
    const coinsToAdd = Math.floor(Math.random() * 50) + 10; // Random between 10 and 59
    const updatedCoins = coins + coinsToAdd;
    setCoins(updatedCoins);
    setChestOpened(true);
    setShowStars(true);
    setNewCoins(coinsToAdd);

    localStorage.setItem('coins', updatedCoins.toString());

    // Reset chest and hide stars after animation
    setTimeout(() => {
      setChestOpened(false);
      setShowStars(false);
      setNewCoins(0);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 flex flex-col items-center justify-center p-4 relative">
      <Snowflakes />
      
      <h1 className="text-4xl font-bold text-white mb-8 text-center z-20">Daily Christmas Chest</h1>
      
      <motion.div
        className="relative z-20"
        animate={chestOpened ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={chestOpened ? "/open-chest.png" : "/closed-chest.png"}
          alt="Treasure Chest"
          className="w-64 h-64 object-contain"
        />
        <AnimatePresence>
          {chestOpened && (
            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-6xl">🪙</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <StarBurst isVisible={showStars} />

      <AnimatePresence>
        {newCoins > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute text-4xl font-bold text-yellow-300 z-30"
            style={{ top: '40%' }}
          >
            +{newCoins} 🪙
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleOpenChest}
        className="mt-8 px-12 py-6 bg-yellow-500 text-white rounded-full font-bold text-3xl shadow-lg hover:bg-yellow-600 transition duration-300 z-20"
      >
        Open Daily Chest
      </button>

      <div className="mt-8 text-2xl font-bold text-white z-20">
        Total Coins: {coins} 🪙
      </div>
    </div>
  );
}
