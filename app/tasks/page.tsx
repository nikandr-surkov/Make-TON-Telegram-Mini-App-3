'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaChevronRight, FaTimes, FaCheckCircle } from 'react-icons/fa';

interface Task {
  id: number;
  title: string;
  description: string;
  link: string;
  reward: number;
  status: 'Pending' | 'InProgress' | 'Completed';
  emoji: string;
}

export default function Task() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      const storedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      setTasks(
        data.map((task: Task) => ({
          ...task,
          status: storedCompletedTasks.includes(task.id) ? 'Completed' : 'Pending',
        }))
      );
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsBrowser(true);
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskClick = (task: Task) => {
    if (task.status === 'Completed') return;
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsVerifying(false);
    setCountdown(15);
    setError(null);
  };

  const handleGoClick = (task: Task) => {
    if (isBrowser) {
      window.open(task.link, '_blank');
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, status: 'InProgress' } : t
      ));
      setSelectedTask(prevTask => prevTask ? {...prevTask, status: 'InProgress'} : null);
      startVerification(task.id);
    }
  };

  const startVerification = (taskId: number) => {
    setIsVerifying(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVerifying(false);
          setTasks(tasks => tasks.map(t => 
            t.id === taskId ? { ...t, status: 'Completed' } : t
          ));
          setSelectedTask(prevTask => prevTask ? {...prevTask, status: 'Completed'} : null);
          saveCompletedTask(taskId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const saveCompletedTask = (taskId: number) => {
    const storedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    localStorage.setItem('completedTasks', JSON.stringify([...storedCompletedTasks, taskId]));
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full max-w-md bg-opacity-70 bg-gradient-to-br from-red-700 to-green-700 rounded-lg shadow-lg p-4 text-white">
          <div className="text-2xl font-bold mb-4">Loading festive tasks... ❄️</div>
          <div className="animate-pulse space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-white bg-opacity-30 rounded-lg"></div>
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full max-w-md bg-opacity-70 bg-gradient-to-br from-red-700 to-green-700 rounded-lg shadow-lg p-4 text-white">
          <div className="text-2xl font-bold mb-4">Error 🎅</div>
          <p>{error}</p>
          <button 
            className="mt-4 w-full py-2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded font-bold"
            onClick={fetchTasks}
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md bg-opacity-70 bg-gradient-to-br from-red-700 to-green-700 rounded-lg shadow-lg p-4 text-white">
        <div className="text-2xl font-bold mb-4">Christmas Tasks 🎄</div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li 
              key={task.id} 
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                task.status === 'Completed' ? 'bg-green-200' : 'bg-opacity-30 bg-white'
              }`}
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{task.emoji}</span>
                </div>
                <span className="font-semibold">{task.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                {task.status !== 'Completed' && (
                  <>
                    <span className="text-yellow-400">🪙</span>
                    <span>{task.reward.toLocaleString()}</span>
                    <FaChevronRight className="text-gray-400" />
                  </>
                )}
                {task.status === 'Completed' && (
                  <FaCheckCircle className="text-green-500" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <main className="p-4 flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-red-700 to-green-700">
      {renderContent()}
      {selectedTask && selectedTask.status !== 'Completed' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-red-700 to-green-700 p-6 rounded-lg w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{selectedTask.title}</h2>
              <FaTimes className="text-white cursor-pointer" onClick={closeModal} />
            </div>
            <p className="text-white mb-4">{selectedTask.description}</p>
            {isVerifying && (
              <p className="text-white mb-4">
                Make sure you&apos;ve completed the task. Santa&apos;s watching! ({countdown}s) 🎅
              </p>
            )}
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}
            <button 
              className="w-full py-2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded font-bold"
              onClick={() => {
                if (selectedTask.status === 'Pending') handleGoClick(selectedTask);
              }}
              disabled={isLoading || isVerifying}
            >
              {isLoading ? 'Processing...' :
               isVerifying ? `Verifying (${countdown}s)` :
               selectedTask.status === 'Pending' ? 'Go' : 'Claim'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
