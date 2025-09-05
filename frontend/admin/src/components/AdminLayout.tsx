import { useState } from 'react';
import { ResponsiveLayout, ResponsiveText, ResponsiveButton } from './responsive';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  UserCheck, 
  Building2, 
  Briefcase, 
  Settings, 
  BarChart3,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'ダッシュボード', href: '/admin', icon: Home, current: true },
    { name: 'ユーザー管理', href: '/admin/users', icon: Users, current: false },
    { name: 'エージェント管理', href: '/admin/agents', icon: UserCheck, current: false },
    { name: '企業管理', href: '/admin/companies', icon: Building2, current: false },
    { name: '求人管理', href: '/admin/jobs', icon: Briefcase, current: false },
    { name: '分析・レポート', href: '/admin/analytics', icon: BarChart3, current: false },
    { name: 'システム設定', href: '/admin/settings', icon: Settings, current: false },
  ];

  const userMenu = [
    { name: 'プロフィール', href: '/admin/profile' },
    { name: '設定', href: '/admin/settings' },
    { name: 'ログアウト', href: '/admin/logout' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <ResponsiveText as="h1" size="lg" weight="bold" className="text-gray-900">
            管理者パネル
          </ResponsiveText>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    item.current
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <ResponsiveText className="text-sm font-medium text-gray-900 truncate">
                管理者
              </ResponsiveText>
              <ResponsiveText className="text-xs text-gray-500 truncate">
                admin@jobmatcher.com
              </ResponsiveText>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                {title && (
                  <ResponsiveText as="h1" size="xl" weight="semibold" className="text-gray-900">
                    {title}
                  </ResponsiveText>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="検索..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                  <Bell className="w-6 h-6" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 border-b border-gray-200">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {breadcrumb.href ? (
                      <a
                        href={breadcrumb.href}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        {breadcrumb.label}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-gray-900">
                        {breadcrumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
