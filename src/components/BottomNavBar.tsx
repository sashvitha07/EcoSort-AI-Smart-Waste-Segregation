import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  Trash2,
  MapPin,
  Bell,
  BarChart3,
} from 'lucide-react';
import { NavScreen } from '../types';

interface BottomNavBarProps {
  currentScreen: NavScreen;
  onSelectScreen: (screen: NavScreen) => void;
  activeAlertCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onSelectScreen,
  activeAlertCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavScreen,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'scan' as NavScreen,
      label: 'Scan Waste',
      icon: ScanLine,
      isPrimary: true,
    },
    {
      id: 'dustbins' as NavScreen,
      label: 'Dustbins',
      icon: Trash2,
    },
    {
      id: 'remote' as NavScreen,
      label: 'Remote',
      icon: MapPin,
    },
    {
      id: 'alerts' as NavScreen,
      label: 'Alerts',
      icon: Bell,
      badge: activeAlertCount > 0 ? activeAlertCount : null,
    },
    {
      id: 'reports' as NavScreen,
      label: 'Reports',
      icon: BarChart3,
    },
  ];

  return (
    <nav className="bg-white border-t border-emerald-100 shadow-lg px-2 py-1.5 flex items-center justify-around z-20 select-none">
      {navItems.map((item) => {
        const isSelected = currentScreen === item.id;
        const Icon = item.icon;

        if (item.isPrimary) {
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectScreen(item.id)}
              className={`flex flex-col items-center justify-center -mt-4 transition-transform active:scale-95 group focus:outline-none`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 ring-offset-1'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <Icon className="w-6 h-6 animate-pulse" />
              </div>
              <span
                className={`text-[11px] font-semibold mt-1 transition-colors ${
                  isSelected ? 'text-emerald-800' : 'text-emerald-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            id={`nav-item-${item.id}`}
            onClick={() => onSelectScreen(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all relative ${
              isSelected
                ? 'text-emerald-800 font-bold'
                : 'text-gray-500 hover:text-emerald-700'
            }`}
          >
            <div
              className={`p-1 rounded-full transition-all ${
                isSelected ? 'bg-emerald-100 text-emerald-800 scale-110' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Badge for Alerts */}
            {item.badge && item.badge > 0 && (
              <span className="absolute top-0.5 right-1 sm:right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {item.badge}
              </span>
            )}

            <span className="text-[10px] sm:text-[11px] mt-0.5 whitespace-nowrap leading-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
