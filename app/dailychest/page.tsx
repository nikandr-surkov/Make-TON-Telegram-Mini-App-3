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

const giftCards = [
  { id: 1, description: "May Santa bring joy and light with a tree full of Christmas magic!" },
  { id: 2, description: "Unwrap the holiday cheer as snowflakes and presents brighten your heart!" },
  { id: 3, description: "Let Santa fill your world with gifts, warmth, and endless joy this season!" },
  { id: 4, description: "Embrace the holiday spirit with a snowman, bringing frosty fun and smiles!" },
  { id: 5, description: "Stockings full of love and festive surprises await to make your Christmas bright!" },
  { id: 6, description: "Ring the bells of joy and unwrap the wonders of Christmas with festive delight!" }
];

const DailyChest: React.FC = () => {
  const [coins, setCoins] = useState<number>(0);
  const [chestOpened, setChestOpened] = useState<boolean>(false);
  const [showStars, setShowStars] = useState<boolean>(false);
  const [newCoins, setNewCoins] = useState<number>(0);
  const [openCount, setOpenCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [giftCard, setGiftCard] = useState<{ id: number, description: string } | null>(null);

  useEffect(() => {
    const storedCoins = localStorage.getItem('coins');
    const storedOpenCount = localStorage.getItem('openCount');
    if (storedCoins) setCoins(parseInt(storedCoins));
    if (storedOpenCount) setOpenCount(parseInt(storedOpenCount));
  }, []);

  const playAudio = (filename: string) => {
    const audio = new Audio(filename);
    audio.play().catch(error => console.error('Audio playback failed', error));
  };

  const handleOpenChest = () => {
    if (openCount >= 10) return;

    setIsLoading(true);
    playAudio('/openingsound.mp3');

    setTimeout(() => {
      const isGiftCard = Math.random() < 0.3; // 30% chance of getting a gift card
      const updatedOpenCount = openCount + 1;

      if (isGiftCard) {
        const randomGiftCard = giftCards[Math.floor(Math.random() * giftCards.length)];
        setGiftCard(randomGiftCard);
        setNewCoins(0);
      } else {
        const coinsToAdd = Math.floor(Math.random() * 901) + 100; // Random between 100 and 1000
        const updatedCoins = coins + coinsToAdd;
        setCoins(updatedCoins);
        setNewCoins(coinsToAdd);
        setGiftCard(null);
        localStorage.setItem('coins', updatedCoins.toString());
      }

      setChestOpened(true);
      setShowStars(true);
      setOpenCount(updatedOpenCount);
      setIsLoading(false);

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
        setGiftCard(null);
      }, 5000);
    }, 3000); // 3 second delay for dramatic effect
  };

  return (
    <div className="h-screen bg-gradient-to-b from-red-700 to-green-700 flex flex-col items-center justify-between p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/snowflakes.png')] opacity-30 animate-fall"></div>
      
      <div className="flex flex-col items-center z-20">
        <h1 className="text-5xl font-bold text-white mb-8 text-center text-shadow-lg">
          🎄 Mystery Box 🎁
        </h1>
        
        <motion.div
          className="relative"
          animate={chestOpened ? { scale: 1.1, rotate: 360 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100 }}
        >
          <img
            src={chestOpened ? "/open-chest.png" : "/closed-chest.png"}
            alt="Mystery Box"
            className="w-80 h-80 object-contain filter drop-shadow-2xl"
          />
          <AnimatePresence>
            {chestOpened && !giftCard && (
              <motion.div
                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-8xl animate-bounce">🪙</span>
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
              className="mt-4 text-5xl font-bold text-yellow-300 z-30 text-shadow-lg"
            >
              +{newCoins} 🪙
            </motion.div>
          )}
          {giftCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              transition={{ duration: 1, type: 'spring', stiffness: 100 }}
              className="mt-4 flex flex-col items-center"
            >
              <img
                src={`/giftcards/${giftCard.id}.jpg`}
                alt="Gift Card"
                className="w-64 h-64 object-cover rounded-lg shadow-2xl"
              />
              <p className="mt-4 text-xl text-white text-center max-w-md italic text-shadow-lg">
                "{giftCard.description}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleOpenChest}
          disabled={openCount >= 10 || isLoading}
          className={`mt-8 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full font-bold text-2xl shadow-lg transition duration-300 transform hover:scale-105 ${
            openCount >= 10 ? 'opacity-50 cursor-not-allowed' : 'hover:from-yellow-500 hover:to-yellow-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Unwrapping Magic...
            </span>
          ) : (
            'Open Enchanted Box'
          )}
        </button>

        <div className="mt-6 text-2xl font-bold text-white text-shadow-lg">
          <span className="text-yellow-300">✨</span> Magical Surprises Remaining: {10 - openCount} <span className="text-yellow-300">✨</span>
        </div>
      </div>

      <div className="text-3xl font-bold text-white z-20 text-shadow-lg">
        Total Coins: {coins} 🪙
      </div>
    </div>
  );
}

export default DailyChest;
