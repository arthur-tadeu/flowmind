import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { Clock, GripVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-orange-100 text-orange-700',
    high: 'bg-red-100 text-red-700',
  };

  const timeSpent = task.completedAt 
    ? formatDistanceToNow(task.createdAt, { addSuffix: false, locale: ptBR })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "card group p-4 flex flex-col gap-3 cursor-default select-none",
        isDragging && "opacity-50 scale-105 z-50 ring-2 ring-apple-blue/20",
        "hover:shadow-apple-hover"
      )}
    >
      <div className="flex items-start justify-between">
        <span className={cn(
          "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full",
          priorityColors[task.priority]
        )}>
          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
        </span>
        <div 
          {...attributes} 
          {...listeners} 
          className="p-1 -mr-1 text-apple-gray opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </div>
      </div>

      <h3 className="font-semibold text-[15px] leading-tight text-apple-text uppercase">
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-sm text-apple-gray line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5 text-xs text-apple-gray">
          <Clock size={14} />
          <span>
            {task.status === 'done' ? `Concluída em ${timeSpent}` : formatDistanceToNow(task.createdAt, { addSuffix: true, locale: ptBR })}
          </span>
        </div>
        
        {task.status === 'done' && (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
