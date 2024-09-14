'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Simulating Adsgram integration
const showAd = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://adsgram.com/api/show-ad'); // Adsgram's API endpoint
    return response.ok; // Returns true if ad successfully shown
  } catch (error) {
    console.error('Failed to load ad:', error);
    return false; // In case of failure
  }
};
type GiftCard = {
  id: number;
  name: string;
  description: string;
};

const giftCards = [
  { id: 1, name: "Santa's Magic", description: "May Santa bring joy and light with a tree full of Christmas magic!" },
  { id: 2, name: "Snowflake Joy", description: "Unwrap the holiday cheer as snowflakes and presents brighten your heart!" },
  { id: 3, name: "Santa's Bounty", description: "Let Santa fill your world with gifts, warmth, and endless joy this season!" },
  { id: 4, name: "Frosty's Cheer", description: "Embrace the holiday spirit with a snowman, bringing frosty fun and smiles!" },
  { id: 5, name: "Stocking Wonder", description: "Stockings full of love and festive surprises await to make your Christmas bright!" },
  { id: 6, name: "Jingle Delight", description: "Ring the bells of joy and unwrap the wonders of Christmas with festive delight!" }
];


// Component for displaying collected gift cards
const GiftCardModal: React.FC<{ isOpen: boolean; onClose: () => void; collectedCards: Record<number, number> }> = ({ isOpen, onClose, collectedCards }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg p-4 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-red-700">Your Festive Collection</h2>
        <div className="grid grid-cols-3 gap-2">
          {giftCards.map((card) => (
            <div key={card.id} className="flex flex-col items-center bg-green-100 p-2 rounded-lg">
              <Image
                src={`/giftcards/${card.id}.jpg`}
                alt={card.name}
                width={60}
                height={60}
                className="rounded-lg shadow-md"
              />
              <p className="mt-1 text-xs font-semibold text-green-800 text-center">{card.name}</p>
              <p className="text-lg font-bold text-red-600">{collectedCards[card.id] || 0}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

// Main component for daily chest with ads
const DailyChest: React.FC = () => {
  const [coins, setCoins] = useState<number>(0);
  const [chestOpened, setChestOpened] = useState<boolean>(false);
  const [showStars, setShowStars] = useState<boolean>(false);
  const [newCoins, setNewCoins] = useState<number>(0);
  const [openCount, setOpenCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [giftCard, setGiftCard] = useState<{ id: number; name: string; description: string } | null>(null);
  const [collectedCards, setCollectedCards] = useState<Record<number, number>>({});
  const [isGiftCardModalOpen, setIsGiftCardModalOpen] = useState<boolean>(false);
  const [adsWatched, setAdsWatched] = useState<number>(0); // Tracking ads watched for this page

  // Random numbers for ad display between 3rd and 8th attempt
  const [adTriggers, setAdTriggers] = useState<number[]>([]);

  // Daily reset at midnight
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.setHours(24, 0, 0, 0)); // Next midnight

    const timeUntilMidnight = midnight.getTime() - now.getTime();

    const resetDaily = () => {
      setOpenCount(0);
      setAdsWatched(0);
      localStorage.setItem('openCount', '0');
      localStorage.setItem('adsWatched', '0');
      generateRandomAdTriggers(); // Generate new ad triggers daily
    };

    // Set timeout to reset at midnight
    const timeoutId = setTimeout(resetDaily, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  // Load data from localStorage and initialize ad triggers
  useEffect(() => {
    const storedCoins = localStorage.getItem('coins');
    const storedOpenCount = localStorage.getItem('openCount');
    const storedCards = localStorage.getItem('collectedCards');
    const storedAdsWatched = localStorage.getItem('adsWatched');

    if (storedCoins) setCoins(parseInt(storedCoins));
    if (storedOpenCount) setOpenCount(parseInt(storedOpenCount));
    if (storedCards) setCollectedCards(JSON.parse(storedCards));
    if (storedAdsWatched) setAdsWatched(parseInt(storedAdsWatched));

    generateRandomAdTriggers(); // Generate the ad triggers for the session
  }, []);

  // Function to generate random ad trigger points (between 3rd and 8th)
  const generateRandomAdTriggers = () => {
    const triggers: number[] = []; // Explicitly define the type as an array of numbers
    while (triggers.length < 5) {
      const randomAttempt = Math.floor(Math.random() * 6) + 3; // Generate number between 3 and 8
      if (!triggers.includes(randomAttempt)) {
        triggers.push(randomAttempt);
      }
    }
    setAdTriggers(triggers);
  };

  // Play audio function
  const playAudio = (filename: string) => {
    const audio = new Audio(filename);
    audio.play().catch((error) => console.error('Audio playback failed', error));
  };

  // Handle opening the chest
  const handleOpenChest = async () => {
    if (openCount >= 10) return;

    setIsLoading(true);
    playAudio('/openingsound.mp3');

    // Simulate suspense effect
    setTimeout(async () => {
      const isGiftCard = Math.random() < 0.3; // 30% chance of getting a gift card
      const updatedOpenCount = openCount + 1;

      // Check if an ad should be shown
      let adShown = false;
      if (adTriggers.includes(updatedOpenCount) && adsWatched < 5) {
        adShown = await showAd(); // Show ad and capture success/failure
        if (adShown) {
          setAdsWatched(adsWatched + 1);
          localStorage.setItem('adsWatched', (adsWatched + 1).toString());
        }
      }

      if (isGiftCard) {
        const randomGiftCard = giftCards[Math.floor(Math.random() * giftCards.length)];
        setGiftCard(randomGiftCard);
        setNewCoins(0);
        const updatedCollectedCards = {
          ...collectedCards,
          [randomGiftCard.id]: (collectedCards[randomGiftCard.id] || 0) + 1,
        };
        setCollectedCards(updatedCollectedCards);
        localStorage.setItem('collectedCards', JSON.stringify(updatedCollectedCards));
      } else {
        const coinsToAdd = Math.floor(Math.random() * 901) + 100; // Random between 100 and 1000 coins
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
      } else if (!adShown) {
        playAudio('/goodresult.mp3');
      }

      setTimeout(() => {
        setChestOpened(false);
        setShowStars(false);
        setNewCoins(0);
        setGiftCard(null);
      }, 5000);
    }, 3000); // 3 second delay for suspense
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-700 flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/snowflakes.png')] opacity-30 pointer-events-none"></div>

      {/* Display stars and collected cards modal */}
      {showStars && (
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          {/* Stars or reward display */}
        </motion.div>
      )}

      {/* Gift cards modal */}
      <GiftCardModal
        isOpen={isGiftCardModalOpen}
        onClose={() => setIsGiftCardModalOpen(false)}
        collectedCards={collectedCards}
      />

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-green-800 mb-4">Open Your Daily Festive Chest!</h1>
        <p className="text-green-600 mb-2">You have {10 - openCount} attempts left today.</p>

        {/* Chest and coin count */}
        <div className="relative">
          <Image src="/chestclosed.png" alt="Chest" width={150} height={150} className="cursor-pointer" onClick={handleOpenChest} />
          {isLoading && <div className="absolute inset-0 flex items-center justify-center">Loading...</div>}
        </div>

        <p className="mt-4 text-lg text-green-800 font-semibold">Coins: {coins}</p>
        <button
          onClick={() => setIsGiftCardModalOpen(true)}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
        >
          View Your Festive Collection
        </button>
      </div>
    </div>
  );
};

export default DailyChest;
