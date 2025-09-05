import { useState, useEffect } from 'react';
import { ResponsiveLayout, ResponsiveCard, ResponsiveText, ResponsiveButton } from '../components/responsive';
import { 
  Users, 
  Building2, 
  Briefcase, 
  UserCheck, 
  TrendingUp, 
  Activity,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalAgents: number;
  totalCompanies: number;
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  monthlyRevenue: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    totalAgents: 89,
    totalCompanies: 156,
    totalJobs: 2341,
    activeJobs: 892,
    completedJobs: 1449,
    monthlyRevenue: 125000,
    systemHealth: 'excellent'
  });

  const [isLoading, setIsLoading] = useState(false);

  const refreshStats = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
        totalJobs: prev.totalJobs + Math.floor(Math.random() * 5)
      }));
      setIsLoading(false);
    }, 1000);
  };

  const statCards = [
    {
      title: '総ユーザー数',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'アクティブエージェント',
      value: stats.totalAgents.toLocaleString(),
      change: '+5%',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'green'
    },
    {
      title: '登録企業数',
      value: stats.totalCompanies.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Building2,
      color: 'purple'
    },
    {
      title: '求人総数',
      value: stats.totalJobs.toLocaleString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: Briefcase,
      color: 'orange'
    },
    {
      title: 'アクティブ求人',
      value: stats.activeJobs.toLocaleString(),
      change: '+3%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'emerald'
    },
    {
      title: '月間収益',
      value: `¥${stats.monthlyRevenue.toLocaleString()}`,
      change: '+22%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'red'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'user', message: '新しいユーザーが登録しました', time: '2分前', user: '田中太郎' },
    { id: 2, type: 'job', message: '新しい求人が投稿されました', time: '15分前', user: '株式会社ABC' },
    { id: 3, type: 'agent', message: 'エージェントが承認されました', time: '1時間前', user: '佐藤花子' },
    { id: 4, type: 'company', message: '新しい企業が登録しました', time: '2時間前', user: '株式会社XYZ' },
    { id: 5, type: 'system', message: 'システムメンテナンスが完了しました', time: '3時間前', user: 'システム' }
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthText = (health: string) => {
    switch (health) {
      case 'excellent': return '優秀';
      case 'good': return '良好';
      case 'warning': return '注意';
      case 'critical': return '危険';
      default: return '不明';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <ResponsiveText 
                as="h1" 
                size="xl" 
                weight="bold" 
                className="text-gray-900"
              >
                管理者ダッシュボード
              </ResponsiveText>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(stats.systemHealth)}`}>
                {getHealthText(stats.systemHealth)}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ResponsiveButton
                variant="outline"
                size="sm"
                onClick={refreshStats}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>更新</span>
              </ResponsiveButton>
              <ResponsiveButton
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>エクスポート</span>
              </ResponsiveButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <ResponsiveLayout>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
            {statCards.map((card, index) => (
              <ResponsiveCard key={index} className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <ResponsiveText 
                      as="p" 
                      size="sm" 
                      className="text-gray-600 mb-1"
                    >
                      {card.title}
                    </ResponsiveText>
                    <ResponsiveText 
                      as="p" 
                      size="2xl" 
                      weight="bold" 
                      className="text-gray-900 mb-2"
                    >
                      {card.value}
                    </ResponsiveText>
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs font-medium ${
                        card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {card.change}
                      </span>
                      <span className="text-xs text-gray-500">先月比</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                    <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                  </div>
                </div>
              </ResponsiveCard>
            ))}
          </div>

          {/* Charts and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <ResponsiveCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900">
                    収益トレンド
                  </ResponsiveText>
                  <div className="flex items-center space-x-2">
                    <ResponsiveButton variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4" />
                    </ResponsiveButton>
                    <ResponsiveButton variant="outline" size="sm">
                      <PieChart className="w-4 h-4" />
                    </ResponsiveButton>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <ResponsiveText className="text-gray-500">
                    チャートコンポーネント（実装予定）
                  </ResponsiveText>
                </div>
              </ResponsiveCard>
            </div>

            {/* System Status */}
            <div>
              <ResponsiveCard className="p-6">
                <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900 mb-4">
                  システム状況
                </ResponsiveText>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CPU使用率</span>
                    <span className="text-sm font-medium text-green-600">23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">メモリ使用率</span>
                    <span className="text-sm font-medium text-yellow-600">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ディスク使用率</span>
                    <span className="text-sm font-medium text-green-600">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </ResponsiveCard>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900">
                  最近のアクティビティ
                </ResponsiveText>
                <ResponsiveButton variant="outline" size="sm">
                  すべて表示
                </ResponsiveButton>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bell className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <ResponsiveText className="text-sm text-gray-900">
                        {activity.message}
                      </ResponsiveText>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ResponsiveCard>

            {/* Quick Actions */}
            <ResponsiveCard className="p-6">
              <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900 mb-6">
                クイックアクション
              </ResponsiveText>
              <div className="grid grid-cols-2 gap-4">
                <ResponsiveButton 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm">ユーザー管理</span>
                </ResponsiveButton>
                <ResponsiveButton 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <UserCheck className="w-6 h-6" />
                  <span className="text-sm">エージェント管理</span>
                </ResponsiveButton>
                <ResponsiveButton 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Building2 className="w-6 h-6" />
                  <span className="text-sm">企業管理</span>
                </ResponsiveButton>
                <ResponsiveButton 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Settings className="w-6 h-6" />
                  <span className="text-sm">システム設定</span>
                </ResponsiveButton>
              </div>
            </ResponsiveCard>
          </div>
        </ResponsiveLayout>
      </div>
    </div>
  );
}
