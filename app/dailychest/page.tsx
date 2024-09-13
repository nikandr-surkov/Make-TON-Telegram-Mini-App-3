'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarBurstProps {
  isVisible: boolean;
}

const StarBurst: React.FC<StarBurstProps> = ({ isVisible }) => {
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

const DailyChest: React.FC = () => {
  const [coins, setCoins] = useState<number>(0);
  const [chestOpened, setChestOpened] = useState<boolean>(false);
  const [showStars, setShowStars] = useState<boolean>(false);
  const [newCoins, setNewCoins] = useState<number>(0);
  const [openCount, setOpenCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedCoins = localStorage.getItem('coins');
    const storedOpenCount = localStorage.getItem('openCount');
    if (storedCoins) setCoins(parseInt(storedCoins));
    if (storedOpenCount) setOpenCount(parseInt(storedOpenCount));
  }, []);

  const playAudio = (filename: string) => {
    const audio = new Audio(filename);
    audio.play();
  };

  const handleOpenChest = () => {
    if (openCount >= 10) return;

    setIsLoading(true);
    setTimeout(() => {
      const coinsToAdd = Math.floor(Math.random() * 50) + 10;
      const updatedCoins = coins + coinsToAdd;
      const updatedOpenCount = openCount + 1;

      setCoins(updatedCoins);
      setChestOpened(true);
      setShowStars(true);
      setNewCoins(coinsToAdd);
      setOpenCount(updatedOpenCount);
      setIsLoading(false);

      localStorage.setItem('coins', updatedCoins.toString());
      localStorage.setItem('openCount', updatedOpenCount.toString());

      if (updatedOpenCount === 10) {
        playAudio('/congratulations.mp3');
      } else {
        playAudio('/goodresult.mp3');
      }

      setTimeout(() => {
        setChestOpened(false);
        setShowStars(false);
        setNewCoins(0);
      }, 2000);
    }, 2000); // 2 second delay for dramatic effect
  };

  return (
    <div className="h-screen bg-gradient-to-b from-red-700 to-green-700 flex flex-col items-center justify-between p-8 relative">
      <div className="text-2xl font-bold text-white z-20">
        Total Coins: {coins} 🪙
      </div>
      
      <div className="flex flex-col items-center z-20">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Daily Christmas Mystery Box</h1>
        
        <motion.div
          className="relative"
          animate={chestOpened ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={chestOpened ? "/open-chest.png" : "/closed-chest.png"}
            alt="Mystery Box"
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
              className="mt-4 text-4xl font-bold text-white z-30"
            >
              +{newCoins} 🪙
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleOpenChest}
          disabled={openCount >= 10 || isLoading}
          className={`mt-8 px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold text-xl shadow-lg transition duration-300 ${
            openCount >= 10 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
          }`}
        >
          {isLoading ? 'Opening...' : 'Open Mystery Box'}
        </button>

        <div className="mt-4 text-xl font-bold text-white">
          Opens remaining: {10 - openCount}
        </div>
      </div>

      <div className="h-8"></div> {/* Spacer */}
    </div>
  );
}

export default DailyChest;
