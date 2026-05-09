import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, Status } from '../types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  id: Status;
  title: string;
  tasks: Task[];
}

export const Column: React.FC<ColumnProps> = ({ id, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-4 min-w-[320px] w-full max-w-[400px]">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-apple-gray">
            {title}
          </h2>
          <span className="flex items-center justify-center w-6 h-6 text-xs font-bold bg-apple-border/30 dark:bg-white/10 text-apple-gray rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 p-2 rounded-apple-lg transition-colors duration-200 min-h-[500px] ${
          isOver ? 'bg-apple-border/20 dark:bg-white/5' : 'bg-transparent'
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-apple-border/30 rounded-apple-lg p-8 text-center">
            <p className="text-xs font-bold text-apple-gray uppercase tracking-widest">Nenhuma tarefa aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};
