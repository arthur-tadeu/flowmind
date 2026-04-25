import { create } from 'zustand';
import type { Task, Status, Priority } from '../types';

interface KanbanState {
  tasks: Task[];
  addTask: (title: string, description: string, priority: Priority) => void;
  updateTaskStatus: (id: string, status: Status) => void;
  removeTask: (id: string) => void;
  moveTask: (activeId: string, overId: string) => void;
}

export const useKanbanStore = create<KanbanState>((set) => ({
  tasks: [
    {
      id: '1',
      title: 'Configurar ambiente do projeto',
      description: 'Instalar dependências e configurar TailwindCSS.',
      priority: 'high',
      status: 'done',
      createdAt: Date.now() - 3600000,
      completedAt: Date.now() - 1800000,
    },
    {
      id: '2',
      title: 'Desenvolver componentes UI',
      description: 'Criar Header, Column e TaskCard.',
      priority: 'medium',
      status: 'inprogress',
      createdAt: Date.now() - 1800000,
    },
    {
      id: '3',
      title: 'Implementar Drag and Drop',
      description: 'Configurar dnd-kit e animações.',
      priority: 'low',
      status: 'todo',
      createdAt: Date.now(),
    },
  ],
  addTask: (title, description, priority) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Math.random().toString(36).substring(2, 9),
          title,
          description,
          priority,
          status: 'todo',
          createdAt: Date.now(),
        },
      ],
    })),
  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
              completedAt: status === 'done' ? Date.now() : undefined,
            }
          : task
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  moveTask: (activeId, overId) =>
    set((state) => {
      // Logic for reordering or moving between columns
      const activeTask = state.tasks.find((t) => t.id === activeId);
      if (!activeTask) return state;

      // Handle the case where overId is a column ID or another task ID
      const overTask = state.tasks.find((t) => t.id === overId);
      const newStatus = overTask ? overTask.status : (overId as Status);

      return {
        tasks: state.tasks.map((task) =>
          task.id === activeId
            ? {
                ...task,
                status: newStatus,
                completedAt: newStatus === 'done' && task.status !== 'done' ? Date.now() : task.completedAt,
              }
            : task
        ),
      };
    }),
}));
