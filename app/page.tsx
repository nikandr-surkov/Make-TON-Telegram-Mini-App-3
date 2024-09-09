'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Gift } from 'lucide-react';

const SNOWFLAKE_COUNT = 30;
const SNOWFLAKE_SIZES = ['text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'];
const TAP_THRESHOLD = 5 + Math.floor(Math.random() * 8); // Random between 5 and 12
const COIN_AMOUNTS = [200, 300, 400, 500, 1000, 1500, 2000, 2500, 3000];

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
  const [coins, setCoins] = useState(0);
  const [snowflakesTapped, setSnowflakesTapped] = useState(0);
  const [taps, setTaps] = useState(0);
  const [showCoinBox, setShowCoinBox] = useState(false);
  const [coinAmount, setCoinAmount] = useState(0);
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; x: number; y: number; size: string }>>([]);
  const [burstEffects, setBurstEffects] = useState<{id: number; x: number; y: number}[]>([]);
  const [telegramId, setTelegramId] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');

  const updateUserData = async (telegram_id: string, telegram_username: string, referrer_id: string | null, coin_balance: number) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_id, telegram_username, referrer_id, coin_balance }),
      });
      const data = await response.json();
      if (!data.success) {
        console.error('Failed to update user data:', data.error);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        setTelegramId(WebApp.initDataUnsafe.user?.id.toString() || '');
        setTelegramUsername(WebApp.initDataUnsafe.user?.username || '');
        const startParam = WebApp.initDataUnsafe.start_param || '';
        
        // Load coins from localStorage
        const storedCoins = localStorage.getItem('coins');
        const localCoins = storedCoins ? parseInt(storedCoins, 10) : 0;
        setCoins(localCoins);
  
        // Fetch user data from the database
        const response = await fetch(`/api/user?telegram_id=${WebApp.initDataUnsafe.user?.id}`);
        const userData = await response.json();
  
        if (userData.success && userData.coinBalance) {
          const dbCoins = parseInt(userData.coinBalance, 10);
          
          // Update localStorage if database value is higher
          if (dbCoins > localCoins) {
            localStorage.setItem('coins', dbCoins.toString());
            setCoins(dbCoins);
          }
  
          // Check if it's time to sync with the database
          const lastUpdate = localStorage.getItem('lastCoinUpdate');
          const now = new Date().getTime();
          if (!lastUpdate || now - parseInt(lastUpdate) > 3 * 24 * 60 * 60 * 1000) {
            await updateUserData(WebApp.initDataUnsafe.user?.id.toString() || '', WebApp.initDataUnsafe.user?.username || '', startParam, Math.max(localCoins, dbCoins));
            localStorage.setItem('lastCoinUpdate', now.toString());
          }
        }
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

  useEffect(() => {
    // Update coin balance in database periodically
    const updateCoins = async () => {
      const lastUpdate = localStorage.getItem('lastCoinUpdate');
      const now = new Date().getTime();
      if (!lastUpdate || now - parseInt(lastUpdate) > 3 * 24 * 60 * 60 * 1000) {
        await updateUserData(telegramId, telegramUsername, null, coins);
        localStorage.setItem('lastCoinUpdate', now.toString());
      }
    };
    updateCoins();
  }, [coins, telegramId, telegramUsername]);

  // New useEffect to update localStorage whenever coins change
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-600 relative">
      {/* Impressive Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/winter_landscape.jpg')" }} />
      <div className="absolute inset-0 bg-green-900 bg-opacity-50" /> {/* Overlay to maintain green tint */}

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundEmojis}
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