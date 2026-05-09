import React, { useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { Clock, GripVertical, Play, Pause, Trash2, Tag } from 'lucide-react';
import { useKanbanStore } from '../store/useKanbanStore';
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
  const { themeColor, removeTask, toggleTimer, incrementTime } = useKanbanStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  useEffect(() => {
    let interval: any;
    if (task.isTimerRunning) {
      interval = setInterval(() => {
        incrementTime(task.id);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [task.isTimerRunning, task.id, incrementTime]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-orange-100 text-orange-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white dark:bg-[#2C2C2E] rounded-apple shadow-apple border border-apple-border/50 dark:border-white/5 transition-all duration-200 group p-4 flex flex-col gap-3 cursor-default select-none",
        isDragging && "opacity-50 scale-105 z-50 ring-2 ring-apple-blue/20",
        "hover:shadow-apple-hover"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          <span 
            className={cn(
              "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full",
              task.priority === 'high' ? "text-white" : priorityColors[task.priority]
            )}
            style={{ backgroundColor: task.priority === 'high' ? themeColor : undefined }}
          >
            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
          </span>
          {task.labels && task.labels.map(label => (
            <span key={label} className="px-2 py-0.5 text-[10px] font-medium bg-apple-light-gray dark:bg-white/10 text-apple-gray dark:text-gray-400 rounded-full flex items-center gap-1">
              <Tag size={10} />
              {label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => removeTask(task.id)}
            className="p-1 text-apple-gray hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={14} />
          </button>
          <div 
            {...attributes} 
            {...listeners} 
            className="p-1 -mr-1 text-apple-gray opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-[15px] leading-tight text-apple-text dark:text-white/90 uppercase">
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-sm text-apple-gray dark:text-gray-400 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-apple-gray dark:text-gray-500">
            <Clock size={14} />
            <span>
              {formatDistanceToNow(task.createdAt, { addSuffix: true, locale: ptBR })}
            </span>
          </div>
          {task.timeSpent > 0 || task.isTimerRunning ? (
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-mono",
              task.isTimerRunning ? "text-apple-blue font-bold" : "text-apple-gray dark:text-gray-500"
            )}>
              <span>{formatTime(task.timeSpent)}</span>
            </div>
          ) : null}
        </div>
        
        <div className="flex items-center gap-2">
          {task.status !== 'done' && (
            <button
              onClick={() => toggleTimer(task.id)}
              className={cn(
                "p-2 rounded-full transition-all active:scale-90",
                task.isTimerRunning 
                  ? "bg-red-100 text-red-600 hover:bg-red-200" 
                  : "bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20"
              )}
            >
              {task.isTimerRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            </button>
          )}

          {task.status === 'done' && (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
