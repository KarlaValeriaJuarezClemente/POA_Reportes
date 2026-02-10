//scr\components\layout\Sidebar.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  AlertTriangle, 
  MapPin, 
  Calendar,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type View = 'dashboard' | 'projects' | 'risks' | 'territory' | 'timeline' | 'transparency' | 'reports' | 'settings';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'reports' as View, label: 'Reportes', icon: FileText },
];

export function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out",
        "bg-sidebar text-sidebar-foreground",
        isCollapsed ? "w-20" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-fade-in">
                <span className="font-display font-bold text-lg">POA 2026</span>
                <span className="text-xs text-sidebar-foreground/70">Plan Operativo Anual</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    !isActive && "text-sidebar-foreground/80"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-ring")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Settings & Collapse */}
          <div className="p-4 border-t border-sidebar-border space-y-1">
            <button
              onClick={() => onViewChange('settings')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                currentView === 'settings' && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                currentView !== 'settings' && "text-sidebar-foreground/80"
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Configuración</span>}
            </button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hidden md:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
