import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onNewTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewTask }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-apple-border/50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-sm" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-apple-text">FlowMind</h1>
      </div>
      <button 
        onClick={onNewTask}
        className="btn-primary flex items-center gap-2"
      >
        <Plus size={18} />
        Nova Tarefa
      </button>
    </header>
  );
};
