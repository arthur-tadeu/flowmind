import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { TaskModal } from './components/TaskModal';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { useKanbanStore } from './store/useKanbanStore';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setTasks, activeTab, isDarkMode } = useKanbanStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as any[];
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user, setTasks]);

  const handleAddTask = async (title: string, description: string, priority: any, labels: string[]) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        priority,
        status: 'todo',
        labels,
        timeSpent: 0,
        isTimerRunning: false,
        userId: user.uid,
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-bg dark:bg-[#1C1C1E]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-apple-text dark:border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className={`flex bg-apple-bg dark:bg-[#1C1C1E] transition-colors duration-300 overflow-hidden animate-fade-in ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden dark:text-white">
        <Header onNewTask={() => setIsModalOpen(true)} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'dashboard' ? <Dashboard /> : <Board />}
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
};

export default App;
