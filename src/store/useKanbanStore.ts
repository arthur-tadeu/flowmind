import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Status, Priority } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

interface KanbanState {
  tasks: Task[];
  searchQuery: string;
  activeTab: 'dashboard' | 'tasks';
  isDarkMode: boolean;
  themeColor: string;
  timePeriod: 'weekly' | 'monthly' | 'quarterly' | 'semester' | 'annual';
  toggleDarkMode: () => void;
  setThemeColor: (color: string) => void;
  setTimePeriod: (period: 'weekly' | 'monthly' | 'quarterly' | 'semester' | 'annual') => void;
  setActiveTab: (tab: 'dashboard' | 'tasks') => void;
  setSearchQuery: (query: string) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (title: string, description: string, priority: Priority, labels: string[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: Status) => void;
  removeTask: (id: string) => void;
  moveTask: (activeId: string, overId: string) => void;
  toggleTimer: (id: string) => void;
  incrementTime: (id: string) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      tasks: [],
      searchQuery: '',
      activeTab: 'tasks',
      isDarkMode: false,
      themeColor: '#007AFF',
      timePeriod: 'monthly',
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setThemeColor: (themeColor) => set({ themeColor }),
      setTimePeriod: (timePeriod) => set({ timePeriod }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setTasks: (tasks) => set({ tasks }),
      
      addTask: (title, description, priority, labels) => {
        // Handled in App.tsx handleAddTask for Firestore context
      },

      updateTask: async (id, updates) => {
        try {
          const taskRef = doc(db, 'tasks', id);
          await updateDoc(taskRef, updates);
        } catch (error) {
          console.error('Erro ao atualizar tarefa:', error);
        }
      },

      updateTaskStatus: async (id, status) => {
        try {
          const taskRef = doc(db, 'tasks', id);
          await updateDoc(taskRef, {
            status,
            completedAt: status === 'done' ? Date.now() : null
          });
        } catch (error) {
          console.error('Erro ao atualizar status:', error);
        }
      },

      removeTask: async (id) => {
        try {
          const taskRef = doc(db, 'tasks', id);
          await deleteDoc(taskRef);
        } catch (error) {
          console.error('Erro ao remover tarefa:', error);
        }
      },

      moveTask: async (activeId, overId) => {
        const state = get();
        const activeTask = state.tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        const overTask = state.tasks.find((t) => t.id === overId);
        const newStatus = overTask ? overTask.status : (overId as Status);

        if (activeTask.status !== newStatus) {
          try {
            const taskRef = doc(db, 'tasks', activeId);
            await updateDoc(taskRef, {
              status: newStatus,
              completedAt: newStatus === 'done' && activeTask.status !== 'done' ? Date.now() : activeTask.completedAt
            });
          } catch (error) {
            console.error('Erro ao mover tarefa:', error);
          }
        }
      },

      toggleTimer: async (id) => {
        const state = get();
        const task = state.tasks.find(t => t.id === id);
        if (!task) return;
        
        try {
          const taskRef = doc(db, 'tasks', id);
          await updateDoc(taskRef, {
            isTimerRunning: !task.isTimerRunning
          });
        } catch (error) {
          console.error('Erro ao alternar timer:', error);
        }
      },

      incrementTime: async (id) => {
        // We increment locally for smooth UI and periodically sync or sync on stop
        // For now, let's just increment locally in the store
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id && task.isTimerRunning
              ? { ...task, timeSpent: (task.timeSpent || 0) + 1 }
              : task
          ),
        }));
      },
    }),
    {
      name: 'flowmind-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        themeColor: state.themeColor,
        timePeriod: state.timePeriod,
      }),
    }
  )
);
