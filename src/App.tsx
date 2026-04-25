import React, { useState } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { TaskModal } from './components/TaskModal';
import { useKanbanStore } from './store/useKanbanStore';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addTask } = useKanbanStore();

  return (
    <div className="flex flex-col h-screen bg-apple-bg overflow-hidden animate-fade-in uppercase">
      <Header onNewTask={() => setIsModalOpen(true)} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Board />
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTask}
      />
    </div>
  );
};

export default App;
