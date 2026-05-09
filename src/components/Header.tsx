import React, { useState } from 'react';
import { Plus, Search, Sun, Moon, Palette } from 'lucide-react';
import { useKanbanStore } from '../store/useKanbanStore';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onNewTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewTask }) => {
  const { searchQuery, setSearchQuery, isDarkMode, toggleDarkMode, themeColor, setThemeColor } = useKanbanStore();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const colors = [
    { name: 'Apple Blue', hex: '#007AFF' },
    { name: 'Pure Black', hex: '#1C1C1E' },
    { name: 'Silver', hex: '#8E8E93' },
    { name: 'Emerald', hex: '#34C759' },
    { name: 'Orange', hex: '#FF9500' },
    { name: 'Purple', hex: '#AF52DE' },
    { name: 'Pink', hex: '#FF2D55' },
  ];

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md border-b border-apple-border/50 dark:border-white/10 transition-colors">
      <div className="flex items-center gap-3 w-1/4">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        <h1 className="text-xl font-bold tracking-tighter text-apple-text dark:text-white uppercase">FlowMind</h1>
      </div>

      <div className="flex-1 max-w-md px-4">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray group-focus-within:text-apple-blue transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="PESQUISAR TAREFAS..."
            className="w-full pl-10 pr-4 py-2 bg-apple-light-gray dark:bg-white/5 border border-apple-border/50 dark:border-white/10 rounded-apple-lg focus:outline-none focus:ring-4 focus:ring-apple-blue/5 transition-all dark:text-white uppercase text-xs font-semibold"
            style={{ borderColor: isDarkMode ? undefined : `${themeColor}20` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsColorPickerOpen(true)}
          className="p-2 text-apple-gray hover:text-apple-text dark:hover:text-white transition-colors"
          style={{ color: themeColor }}
        >
          <Palette size={20} />
        </button>

        <button
          onClick={toggleDarkMode}
          className="relative w-12 h-6 rounded-full bg-apple-light-gray dark:bg-white/10 p-1 transition-colors duration-300 focus:outline-none"
        >
          <div className="flex items-center justify-between px-1 absolute inset-0 pointer-events-none opacity-40">
            <Sun size={10} className={isDarkMode ? 'text-apple-gray' : 'text-orange-500'} />
            <Moon size={10} className={isDarkMode ? 'text-apple-blue' : 'text-apple-gray'} />
          </div>
          <motion.div
            animate={{ 
              x: isDarkMode ? 24 : 0,
              rotate: isDarkMode ? 360 : 0
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-4 h-4 bg-[#D1D1D6] rounded-full shadow-md z-10 relative flex items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full bg-gradient-to-tr from-gray-400 to-gray-200" />
          </motion.div>
        </button>

        <button 
          onClick={onNewTask}
          className="btn-primary flex items-center gap-2"
          style={{ backgroundColor: themeColor }}
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nova Tarefa</span>
        </button>
        
        <div className="w-10 h-10 rounded-full border-2 border-apple-border/50 p-0.5 cursor-pointer hover:border-apple-blue transition-colors">
          <div 
            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: themeColor }}
          >
            AT
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isColorPickerOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsColorPickerOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-[#2C2C2E] p-6 rounded-apple-lg shadow-2xl w-full max-w-sm"
            >
              <h3 className="text-lg font-bold mb-4 dark:text-white uppercase tracking-tight">Personalizar Cor</h3>
              <div className="grid grid-cols-4 gap-4">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setThemeColor(c.hex);
                      setIsColorPickerOpen(false);
                    }}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${themeColor === c.hex ? 'border-white ring-2 ring-apple-blue shadow-lg' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
