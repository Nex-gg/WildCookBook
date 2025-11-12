import { Home, ChefHat, Bookmark, UserCircle, MessageSquarePlus } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'recipes', icon: ChefHat, label: 'Recipes' },
  { id: 'requests', icon: MessageSquarePlus, label: 'Requests' },
  { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { id: 'profile', icon: UserCircle, label: 'Profile' },
];

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[400px]">
      <div className="bg-gradient-to-r from-red-400 to-pink-400 backdrop-blur-lg rounded-full shadow-2xl px-2 py-2 flex justify-between items-center">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative p-3 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-white/25 text-white scale-105'
                  : 'text-white/70 hover:bg-white/15 hover:text-white'
              }`}
              aria-label={tab.label}
            >
              <IconComponent className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
