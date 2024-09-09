'use client'
import { useEffect, useState } from 'react'
import { CheckSquare, Gift, Trees, ExternalLink } from 'lucide-react'

interface Task {
  id: number;
  description: string;
  completed: boolean;
  link: string;
}

export default function Tasks() {
  const [initData, setInitData] = useState('')
  const [userId, setUserId] = useState('')
  const [startParam, setStartParam] = useState('')
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, description: "Follow us on Twitter", completed: false, link: "https://twitter.com/your_account" },
    { id: 2, description: "Follow us on Instagram", completed: false, link: "https://instagram.com/your_account" },
    { id: 3, description: "Subscribe to our YouTube", completed: false, link: "https://youtube.com/your_channel" },
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
  }, [])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-red-700 to-green-800">
      <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center text-red-700 flex items-center justify-center">
          <CheckSquare className="mr-2" />
          Christmas Tasks
        </h1>
        <p className="text-center mb-6 text-green-800">Complete these festive tasks to earn rewards!</p>
        <ul className="space-y-4">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleTask(task.id)} 
                  className="mr-3 form-checkbox h-5 w-5 text-green-600"
                />
                <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.description}
                </span>
              </div>
              <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <ExternalLink size={20} />
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <Gift className="text-red-700 mr-2" size={24} />
          <Trees className="text-green-800 ml-2" size={24} />
        </div>
      </div>
    </main>
  )
}
