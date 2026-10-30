import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, MessageSquare, History, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/chat', label: 'AI Assistant', icon: MessageSquare },
    { path: '/scan', label: 'Scan', icon: Camera, isPrimary: true },
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-2 left-3 right-3 z-50 pb-safe">
      <div className="bg-white/95 backdrop-blur-xl border border-[#E6E7E0] shadow-xl rounded-3xl px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -top-5 flex flex-col items-center group"
                aria-label="Scan Food Label"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#174B38] text-white flex items-center justify-center shadow-lg shadow-[#174B38]/30 border-4 border-[#F8F8F2] group-hover:scale-105 active:scale-95 transition-all duration-150">
                  <Icon className="w-6 h-6 text-[#D7EDB2]" />
                </div>
                <span className="text-[10px] font-bold text-[#174B38] mt-0.5 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-[#174B38] font-bold scale-105'
                  : 'text-[#78837B] hover:text-[#202923]'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#EEF8DC]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#174B38] stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold text-[#174B38]' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
