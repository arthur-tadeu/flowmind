import React from 'react';
import { Layout, CheckSquare, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useKanbanStore } from '../store/useKanbanStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeTab, setActiveTab, themeColor } = useKanbanStore();

  const menuItems = [
    { id: 'dashboard', icon: Layout, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tarefas' },
    { id: 'settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className={cn(
      "h-screen bg-white dark:bg-[#2C2C2E] border-r border-apple-border/50 dark:border-white/5 flex flex-col transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
        {!isCollapsed && <span className="font-bold text-lg tracking-tight dark:text-white">FlowMind</span>}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.id as any)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-apple transition-colors group",
              activeTab === item.id 
                ? "" 
                : "text-apple-gray hover:bg-apple-light-gray dark:hover:bg-white/5 hover:text-apple-text dark:hover:text-white"
            )}
            style={{ 
              backgroundColor: activeTab === item.id ? `${themeColor}15` : undefined,
              color: activeTab === item.id ? themeColor : undefined 
            }}
          >
            <item.icon size={20} className={cn(
              "flex-shrink-0 transition-colors",
              activeTab === item.id ? "" : "group-hover:text-apple-text"
            )} 
            style={{ color: activeTab === item.id ? themeColor : undefined }}
            />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-apple-border/30 dark:border-white/10">
        <button className={cn(
          "w-full flex items-center gap-3 px-3 py-2 text-apple-gray hover:text-apple-text dark:hover:text-white transition-colors",
          isCollapsed ? "justify-center" : ""
        )}>
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Sair</span>}
        </button>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-[#3A3A3C] border border-apple-border dark:border-white/20 shadow-sm rounded-full flex items-center justify-center text-apple-gray hover:text-apple-text dark:hover:text-white transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};
