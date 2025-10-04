import React from 'react';
import { ShoppingCart, Package, Clock, BarChart3, Building2, LogOut, User, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount: number;
  user: any;
  onSignOut: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  cartItemCount,
  user,
  onSignOut
}) => {
  const tabs = [
    { id: 'pos', name: 'POS', icon: ShoppingCart, badge: cartItemCount > 0 ? cartItemCount : undefined },
    { id: 'masters', name: 'Masters', icon: Settings },
    { id: 'history', name: 'Sale Reports', icon: Clock },
    { id: 'profile', name: 'Business', icon: Building2 },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Msoft-POS" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-800">Msoft-POS</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
            </div>
            
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.displayName || user?.email}</span>
              </div>
              <button
                onClick={onSignOut}
                className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};