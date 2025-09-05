import { ReactNode } from 'react';
import { Container } from '../app/ui';
import { ResponsiveText, ResponsiveButton } from './responsive';
import { Edit, LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  user: {
    name?: string;
    role: string;
  };
  onEdit?: () => void;
  onLogout?: () => void;
  isEditing?: boolean;
  children: ReactNode;
  tabs: Array<{
    id: string;
    name: string;
    icon: any;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  color: 'blue' | 'green' | 'purple' | 'red';
}

export default function DashboardLayout({
  title,
  subtitle,
  user,
  onEdit,
  onLogout,
  isEditing = false,
  children,
  tabs,
  activeTab,
  onTabChange,
  color
}: DashboardLayoutProps) {
  const colorClasses = {
    blue: {
      icon: 'bg-blue-100 text-blue-600',
      border: 'border-blue-500 text-blue-600',
      hover: 'hover:border-blue-300'
    },
    green: {
      icon: 'bg-green-100 text-green-600',
      border: 'border-green-500 text-green-600',
      hover: 'hover:border-green-300'
    },
    purple: {
      icon: 'bg-purple-100 text-purple-600',
      border: 'border-purple-500 text-purple-600',
      hover: 'hover:border-purple-300'
    },
    red: {
      icon: 'bg-red-100 text-red-600',
      border: 'border-red-500 text-red-600',
      hover: 'hover:border-red-300'
    }
  };

  const currentColor = colorClasses[color];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 ${currentColor.icon} rounded-full flex items-center justify-center`}>
                <div className="w-6 h-6" />
              </div>
              <div>
                <ResponsiveText
                  as="h1"
                  size="xl"
                  weight="bold"
                  className="text-gray-900"
                >
                  {title}
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  {subtitle} {user.name}さん
                </ResponsiveText>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {onEdit && (
                <ResponsiveButton
                  variant="outline"
                  onClick={onEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? '編集終了' : '編集'}
                </ResponsiveButton>
              )}
              <ResponsiveButton 
                variant="outline"
                onClick={onLogout || (() => window.location.href = '/')}
              >
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </ResponsiveButton>
            </div>
          </div>
        </Container>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <Container>
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? `${currentColor.border}`
                    : `border-transparent text-gray-500 ${currentColor.hover}`
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        <Container>
          {children}
        </Container>
      </main>
    </div>
  );
}
