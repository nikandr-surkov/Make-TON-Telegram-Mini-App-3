'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckSquare, Gift, Trees, ExternalLink, Snowflake, Bell } from 'lucide-react'

interface Task {
  id: number;
  description: string;
  completed: boolean;
  link: string;
  reward: number;
}

export default function Tasks() {
  const [initData, setInitData] = useState('')
  const [userId, setUserId] = useState('')
  const [startParam, setStartParam] = useState('')
  const [verifyingTask, setVerifyingTask] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, description: "Follow us on Twitter", completed: false, link: "https://twitter.com/your_account", reward: 100 },
    { id: 2, description: "Follow us on Instagram", completed: false, link: "https://instagram.com/your_account", reward: 150 },
    { id: 3, description: "Subscribe to our YouTube", completed: false, link: "https://youtube.com/your_channel", reward: 200 },
  ])

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        setInitData(WebApp.initData);
        setUserId(WebApp.initDataUnsafe.user?.id.toString() || '');
        setStartParam(WebApp.initDataUnsafe.start_param || '');
      }
    };
    initWebApp();

    // Load completed tasks from localStorage
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    setTasks(prevTasks => prevTasks.map(task => ({
      ...task,
      completed: completedTasks.includes(task.id)
    })));
  }, [])

  const verifyTask = (id: number) => {
    setVerifyingTask(id);
  }

  const completeTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Update local state
    setTasks(prevTasks => prevTasks.map(t => t.id === id ? { ...t, completed: true } : t));
    
    // Update localStorage
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    localStorage.setItem('completedTasks', JSON.stringify([...completedTasks, id]));

    // Update coins in localStorage
    const currentCoins = parseInt(localStorage.getItem('coins') || '0', 10);
    const newCoins = currentCoins + task.reward;
    localStorage.setItem('coins', newCoins.toString());

    // Update database
    try {
      const response = await fetch('/api/updateCoins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, coins: newCoins, completedTask: id }),
      });
      if (!response.ok) {
        throw new Error('Failed to update coins in database');
      }
    } catch (error) {
      console.error('Error updating coins:', error);
    }

    setVerifyingTask(null);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-red-700 to-green-800 relative overflow-hidden">
      {/* Christmas decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Snowflake
            key={i}
            size={24}
            className="text-white opacity-50 absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-xl max-w-md w-full relative">
        <h1 className="text-4xl font-bold mb-8 text-center text-red-700 flex items-center justify-center">
          <CheckSquare className="mr-2" />
          Christmas Tasks
        </h1>
        <p className="text-center mb-6 text-green-800">Complete these festive tasks to earn rewards!</p>
        <ul className="space-y-4">
          {tasks.map(task => (
            <li key={task.id} className="relative">
              <div className={`flex items-center justify-between p-4 ${task.completed ? 'bg-green-100' : 'bg-red-100'} rounded-lg transition-all duration-300 hover:shadow-md`}>
                <div className="flex items-center">
                  {task.completed ? (
                    <Gift className="text-green-600 mr-3" size={24} />
                  ) : (
                    <Trees className="text-red-600 mr-3" size={24} />
                  )}
                  <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.description}
                  </span>
                </div>
                {task.completed ? (
                  <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <ExternalLink size={20} />
                  </a>
                ) : (
                  <button
                    onClick={() => verifyTask(task.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors duration-200"
                  >
                    Complete
                  </button>
                )}
              </div>
              {verifyingTask === task.id && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <p className="mb-4">Are you sure you have completed this task?</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => completeTask(task.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-200"
                      >
                        Yes, complete
                      </button>
                      <button
                        onClick={() => setVerifyingTask(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center items-center space-x-4">
          <Gift className="text-red-700" size={24} />
          <Bell className="text-green-700" size={24} />
          <Gift className="text-red-700" size={24} />
        </div>
      </div>
    </main>
  )
}