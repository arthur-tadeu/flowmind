import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';
import type { Priority } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, priority: Priority, labels: string[]) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [labelsStr, setLabelsStr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const labels = labelsStr
      .split(',')
      .map(l => l.trim())
      .filter(l => l !== '');

    onSubmit(title, description, priority, labels);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setLabelsStr('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#2C2C2E] rounded-apple-lg shadow-2xl overflow-hidden transition-colors"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-apple-border/50 dark:border-white/10">
              <h2 className="text-lg font-semibold text-apple-text dark:text-white uppercase tracking-tight">Nova Tarefa</h2>
              <button
                onClick={onClose}
                className="p-1 text-apple-gray hover:text-apple-text dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-gray-400">
                  Título
                </label>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="O que precisa ser feito?"
                  className="w-full px-4 py-2 bg-apple-light-gray dark:bg-white/5 border border-apple-border/50 dark:border-white/10 rounded-apple dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-gray-400">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Adicione mais detalhes..."
                  rows={3}
                  className="w-full px-4 py-2 bg-apple-light-gray dark:bg-white/5 border border-apple-border/50 dark:border-white/10 rounded-apple dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-gray-400">
                  Etiquetas (separadas por vírgula)
                </label>
                <div className="relative">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray" />
                  <input
                    type="text"
                    value={labelsStr}
                    onChange={(e) => setLabelsStr(e.target.value)}
                    placeholder="Trabalho, Pessoal, Urgente"
                    className="w-full pl-10 pr-4 py-2 bg-apple-light-gray dark:bg-white/5 border border-apple-border/50 dark:border-white/10 rounded-apple dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-apple-gray dark:text-gray-400">
                  Prioridade
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 text-sm font-medium rounded-apple border transition-all ${
                        priority === p
                          ? 'bg-apple-blue text-white border-apple-blue shadow-lg shadow-apple-blue/20'
                          : 'bg-white dark:bg-white/5 text-apple-text dark:text-gray-300 border-apple-border/50 dark:border-white/10 hover:bg-apple-light-gray dark:hover:bg-white/10'
                      }`}
                    >
                      {p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary dark:bg-white/10 dark:text-white dark:border-transparent dark:hover:bg-white/20"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] btn-primary"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
