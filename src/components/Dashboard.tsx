import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Info, TrendingUp, TrendingDown, Clock, CheckCircle2, Activity, Calendar } from 'lucide-react';
import { useKanbanStore } from '../store/useKanbanStore';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StatCard = ({ title, value, ratio, isUp, footer, children, icon: Icon }: any) => (
  <div className="bg-white dark:bg-[#2C2C2E] p-6 rounded-apple shadow-sm border border-apple-border/50 dark:border-white/5 flex flex-col gap-4 transition-colors">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-sm text-apple-gray flex items-center gap-1">
          {title} <Info size={14} className="cursor-help" />
        </p>
        <h3 className="text-2xl font-bold text-apple-text dark:text-white tracking-tight">{value}</h3>
      </div>
      <div className="p-2 bg-apple-light-gray dark:bg-white/5 rounded-lg text-apple-gray">
        <Icon size={20} />
      </div>
    </div>
    
    <div className="h-16 w-full -mx-2">
      {children}
    </div>

    <div className="space-y-1 pt-2 border-t border-apple-border/30 dark:border-white/10">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-apple-gray">Performance</span>
        <span className={isUp ? "text-green-500 flex items-center" : "text-red-500 flex items-center"}>
          {ratio} {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        </span>
      </div>
      <div className="text-sm text-apple-text dark:text-apple-border font-medium">{footer}</div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { tasks, isDarkMode, timePeriod, setTimePeriod, themeColor } = useKanbanStore();

  const filteredTasks = useMemo(() => {
    const now = Date.now();
    const periods = {
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      quarterly: 90 * 24 * 60 * 60 * 1000,
      semester: 180 * 24 * 60 * 60 * 1000,
      annual: 365 * 24 * 60 * 60 * 1000,
    };
    return tasks.filter(t => (now - t.createdAt) <= periods[timePeriod as keyof typeof periods]);
  }, [tasks, timePeriod]);

  const doneTasks = filteredTasks.filter(t => t.status === 'done');
  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'inprogress');

  const avgTimeMs = doneTasks.length > 0 
    ? doneTasks.reduce((acc, t) => acc + (t.completedAt! - t.createdAt), 0) / doneTasks.length 
    : 0;

  const avgTimeStr = avgTimeMs > 0 
    ? formatDistance(0, avgTimeMs, { locale: ptBR })
    : 'N/A';

  const priorityDistribution = useMemo(() => [
    { name: 'Baixa', tasks: filteredTasks.filter(t => t.priority === 'low').length, fill: '#8E8E93' },
    { name: 'Média', tasks: filteredTasks.filter(t => t.priority === 'medium').length, fill: '#D1D1D6' },
    { name: 'Alta', tasks: filteredTasks.filter(t => t.priority === 'high').length, fill: themeColor },
  ], [filteredTasks, themeColor]);

  const periods = [
    { id: 'weekly', label: 'Semanal' },
    { id: 'monthly', label: 'Mensal' },
    { id: 'quarterly', label: '3 Meses' },
    { id: 'semester', label: '6 Meses' },
    { id: 'annual', label: 'Anual' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-apple-bg dark:bg-[#1C1C1E] space-y-8 animate-fade-in uppercase transition-colors">
      <div className="flex justify-between items-center bg-white dark:bg-[#2C2C2E] p-4 rounded-apple-lg shadow-sm border border-apple-border/50 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-apple-blue" style={{ color: themeColor }} />
          <h2 className="font-bold text-apple-text dark:text-white">Período de Análise</h2>
        </div>
        <div className="flex gap-2">
          {periods.map(prd => (
            <button
              key={prd.id}
              onClick={() => setTimePeriod(prd.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                timePeriod === prd.id 
                  ? 'text-white shadow-lg' 
                  : 'bg-apple-light-gray dark:bg-white/5 text-apple-gray hover:text-apple-text'
              }`}
              style={{ backgroundColor: timePeriod === prd.id ? themeColor : undefined }}
            >
              {prd.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-indigo-900/20 dark:via-[#2C2C2E] dark:to-pink-900/20 p-6 rounded-apple shadow-sm border border-apple-border/50 dark:border-white/5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="flex justify-between items-start z-10">
            <h3 className="text-lg font-bold text-apple-text dark:text-white leading-tight">Prioritized<br/>tasks</h3>
            <div className="p-3 bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-sm border border-white/50">
               <Activity size={20} className="text-apple-text dark:text-white" />
            </div>
          </div>
          <div className="mt-8 z-10">
            <div className="text-5xl font-bold text-apple-text dark:text-white tracking-tighter">
              {Math.round((filteredTasks.filter(t => t.priority === 'high').length / (filteredTasks.length || 1)) * 100)}%
            </div>
            <p className="text-sm text-apple-gray mt-1">Alta Prioridade</p>
          </div>
        </div>

        <StatCard 
          title="Tarefas Concluídas" 
          value={doneTasks.length} 
          ratio="100%" 
          isUp={true} 
          footer="Total concluído"
          icon={CheckCircle2}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{val: 0}, {val: doneTasks.length}, {val: doneTasks.length * 1.2}]}>
              <Area type="monotone" dataKey="val" stroke={themeColor} fill={`${themeColor}10`} />
            </AreaChart>
          </ResponsiveContainer>
        </StatCard>

        <StatCard 
          title="Tempo Médio" 
          value={avgTimeStr} 
          ratio="P/ concluir" 
          isUp={false} 
          footer="Consistência"
          icon={Clock}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{val: 100}, {val: 200}, {val: 150}]}>
              <Area type="monotone" dataKey="val" stroke="#8E8E93" fill="#8E8E9310" />
            </AreaChart>
          </ResponsiveContainer>
        </StatCard>

        <div className="bg-white dark:bg-[#2C2C2E] p-6 rounded-apple shadow-sm border border-apple-border/50 dark:border-white/5 flex flex-col items-center justify-center text-center gap-2 transition-colors">
          <p className="text-sm text-apple-gray">Foco Total</p>
          <div className="relative w-24 h-24 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke={isDarkMode ? "#3A3A3C" : "#F2F2F7"} strokeWidth="8" fill="transparent" />
                <circle cx="48" cy="48" r="40" stroke={themeColor} strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - (doneTasks.length / (filteredTasks.length || 1)))} />
             </svg>
             <span className="absolute text-2xl font-bold text-apple-text dark:text-white">
               {Math.round((doneTasks.length / (filteredTasks.length || 1)) * 100)}%
             </span>
          </div>
          <Activity size={20} className="mt-2" style={{ color: themeColor }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#2C2C2E] p-6 rounded-apple shadow-sm border border-apple-border/50 dark:border-white/5 transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-bold text-lg text-apple-text dark:text-white">Análise por {periods.find(p => p.id === timePeriod)?.label}</h4>
            <div className="flex bg-apple-light-gray dark:bg-white/5 p-1 rounded-lg gap-2 text-xs font-medium">
              <span className="px-3 py-1 bg-white dark:bg-white/10 shadow-sm rounded-md" style={{ color: themeColor }}>Real-time Data</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#3A3A3C" : "#F2F2F7"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8E8E93', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: isDarkMode ? '#3A3A3C' : '#F2F2F7'}}
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#2C2C2E' : '#FFFFFF',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E'
                  }}
                />
                <Bar 
                  dataKey="tasks" 
                  radius={[8, 8, 0, 0]} 
                  barSize={60} 
                  label={{ position: 'top', fill: isDarkMode ? '#FFFFFF' : '#1C1C1E', fontSize: 14, fontWeight: 'bold' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2C2C2E] p-6 rounded-apple shadow-sm border border-apple-border/50 dark:border-white/5 transition-colors">
          <h4 className="font-bold text-lg text-apple-text dark:text-white mb-6">Status Ranking</h4>
          <div className="space-y-6">
            {[
              { id: 1, name: 'Concluídas', val: doneTasks.length },
              { id: 2, name: 'Em Progresso', val: inProgressTasks.length },
              { id: 3, name: 'A Fazer', val: todoTasks.length },
              { id: 4, name: 'Total Período', val: filteredTasks.length },
            ].map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white transition-colors`}
                    style={{ backgroundColor: idx === 0 ? themeColor : '#D1D1D6' }}
                  >
                    {item.id}
                  </span>
                  <span className="text-apple-text dark:text-apple-border font-medium">{item.name}</span>
                </div>
                <span className="text-apple-gray dark:text-apple-gray font-mono">{item.val}</span>
              </div>
            ))}
          </div>
          <div 
            className="mt-8 p-4 rounded-xl text-xs font-bold text-center"
            style={{ backgroundColor: `${themeColor}10`, color: themeColor, border: `1px solid ${themeColor}20` }}
          >
            Sincronizado com Firebase Cloud
          </div>
        </div>
      </div>
    </div>
  );
};
