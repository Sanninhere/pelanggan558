import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
  shadowColor: string;
  subtitle?: string;
}

export default function StatCard({ title, value, icon: Icon, gradient, shadowColor, subtitle }: Props) {
  return (
    <div className={`relative overflow-hidden bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] group`}>
      {/* Background glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
          {subtitle && <p className="text-gray-600 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg ${shadowColor} shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
