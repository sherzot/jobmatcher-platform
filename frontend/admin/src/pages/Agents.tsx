import { useState, useEffect } from 'react';
import { ResponsiveLayout, ResponsiveCard, ResponsiveText, ResponsiveButton } from '../components/responsive';
import AdminLayout from '../components/AdminLayout';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  rating: number;
  totalJobs: number;
  completedJobs: number;
  successRate: number;
  specializations: string[];
  experience: number; // years
  location?: string;
  avatar?: string;
  createdAt: string;
  lastActive?: string;
  bio?: string;
  certifications?: string[];
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // Mock data
  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: '佐藤花子',
        email: 'sato@example.com',
        phone: '090-2345-6789',
        status: 'active',
        rating: 4.8,
        totalJobs: 156,
        completedJobs: 142,
        successRate: 91,
        specializations: ['IT', 'マーケティング', '営業'],
        experience: 5,
        location: '東京都',
        createdAt: '2023-06-15',
        lastActive: '2024-01-20',
        bio: 'IT業界での豊富な経験を持つキャリアコンサルタント',
        certifications: ['キャリアコンサルタント', 'ITパスポート']
      },
      {
        id: '2',
        name: '高橋美咲',
        email: 'takahashi@example.com',
        phone: '090-3456-7890',
        status: 'active',
        rating: 4.6,
        totalJobs: 89,
        completedJobs: 78,
        successRate: 88,
        specializations: ['金融', 'コンサルティング'],
        experience: 3,
        location: '大阪府',
        createdAt: '2023-08-20',
        lastActive: '2024-01-19',
        bio: '金融業界の専門知識を活かした転職支援',
        certifications: ['FP技能士', '中小企業診断士']
      },
      {
        id: '3',
        name: '鈴木一郎',
        email: 'suzuki@example.com',
        status: 'pending',
        rating: 0,
        totalJobs: 0,
        completedJobs: 0,
        successRate: 0,
        specializations: ['製造業', 'エンジニアリング'],
        experience: 8,
        location: '愛知県',
        createdAt: '2024-01-18',
        bio: '製造業での長年の経験を活かした転職支援',
        certifications: ['技術士補']
      },
      {
        id: '4',
        name: '山田次郎',
        email: 'yamada@example.com',
        phone: '090-4567-8901',
        status: 'suspended',
        rating: 3.2,
        totalJobs: 45,
        completedJobs: 38,
        successRate: 84,
        specializations: ['小売', 'サービス業'],
        experience: 4,
        location: '福岡県',
        createdAt: '2023-09-10',
        lastActive: '2024-01-05',
        bio: '小売・サービス業界での転職支援',
        certifications: ['販売士']
      },
      {
        id: '5',
        name: '田中太郎',
        email: 'tanaka@example.com',
        phone: '090-5678-9012',
        status: 'active',
        rating: 4.9,
        totalJobs: 203,
        completedJobs: 195,
        successRate: 96,
        specializations: ['医療', '介護', '福祉'],
        experience: 7,
        location: '神奈川県',
        createdAt: '2023-05-01',
        lastActive: '2024-01-20',
        bio: '医療・介護分野での専門的な転職支援',
        certifications: ['看護師', '介護支援専門員']
      }
    ];
    setAgents(mockAgents);
    setFilteredAgents(mockAgents);
  }, []);

  // Filter agents
  useEffect(() => {
    let filtered = agents;

    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.specializations.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(agent => agent.status === statusFilter);
    }

    if (specializationFilter !== 'all') {
      filtered = filtered.filter(agent => 
        agent.specializations.includes(specializationFilter)
      );
    }

    setFilteredAgents(filtered);
  }, [agents, searchTerm, statusFilter, specializationFilter]);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'アクティブ',
      inactive: '非アクティブ',
      pending: '承認待ち',
      suspended: '停止中'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const specializations = ['IT', 'マーケティング', '営業', '金融', 'コンサルティング', '製造業', 'エンジニアリング', '小売', 'サービス業', '医療', '介護', '福祉'];

  const breadcrumbs = [
    { label: 'ダッシュボード', href: '/admin' },
    { label: 'エージェント管理' }
  ];

  return (
    <AdminLayout title="エージェント管理" breadcrumbs={breadcrumbs}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <ResponsiveLayout>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <ResponsiveText as="h1" size="2xl" weight="bold" className="text-gray-900 mb-2">
                  エージェント管理
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  登録されているエージェントを管理し、パフォーマンスを監視できます
                </ResponsiveText>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <ResponsiveButton variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>エクスポート</span>
                </ResponsiveButton>
                <ResponsiveButton className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>新規エージェント</span>
                </ResponsiveButton>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">総エージェント数</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {agents.length}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">アクティブ</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {agents.filter(a => a.status === 'active').length}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">承認待ち</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {agents.filter(a => a.status === 'pending').length}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">平均評価</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {agents.filter(a => a.rating > 0).length > 0 
                      ? (agents.filter(a => a.rating > 0).reduce((sum, a) => sum + a.rating, 0) / agents.filter(a => a.rating > 0).length).toFixed(1)
                      : '0.0'
                    }
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>
          </div>

          {/* Filters */}
          <ResponsiveCard className="p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="名前、メール、専門分野で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">すべて</option>
                  <option value="active">アクティブ</option>
                  <option value="inactive">非アクティブ</option>
                  <option value="pending">承認待ち</option>
                  <option value="suspended">停止中</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">専門分野</label>
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">すべて</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <ResponsiveButton variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  フィルター適用
                </ResponsiveButton>
              </div>
            </div>
          </ResponsiveCard>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <ResponsiveCard key={agent.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-600">
                        {agent.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900">
                        {agent.name}
                      </ResponsiveText>
                      <ResponsiveText className="text-sm text-gray-500">
                        {agent.email}
                      </ResponsiveText>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(agent.status)}
                    {getStatusBadge(agent.status)}
                  </div>
                </div>

                {agent.bio && (
                  <ResponsiveText className="text-sm text-gray-600 mb-4">
                    {agent.bio}
                  </ResponsiveText>
                )}

                {/* Rating */}
                {agent.rating > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(agent.rating)}
                    </div>
                    <ResponsiveText className="text-sm text-gray-600">
                      {agent.rating}/5.0
                    </ResponsiveText>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <ResponsiveText as="p" size="lg" weight="bold" className="text-gray-900">
                      {agent.totalJobs}
                    </ResponsiveText>
                    <ResponsiveText className="text-xs text-gray-500">総案件数</ResponsiveText>
                  </div>
                  <div className="text-center">
                    <ResponsiveText as="p" size="lg" weight="bold" className="text-gray-900">
                      {agent.completedJobs}
                    </ResponsiveText>
                    <ResponsiveText className="text-xs text-gray-500">完了案件</ResponsiveText>
                  </div>
                  <div className="text-center">
                    <ResponsiveText as="p" size="lg" weight="bold" className="text-gray-900">
                      {agent.successRate}%
                    </ResponsiveText>
                    <ResponsiveText className="text-xs text-gray-500">成功率</ResponsiveText>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <ResponsiveText className="text-xs font-medium text-gray-500 mb-2">専門分野</ResponsiveText>
                  <div className="flex flex-wrap gap-1">
                    {agent.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience and Location */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>{agent.experience}年の経験</span>
                  </div>
                  {agent.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{agent.location}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <ResponsiveButton variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </ResponsiveButton>
                    <ResponsiveButton variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </ResponsiveButton>
                    <ResponsiveButton variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </ResponsiveButton>
                  </div>
                  <ResponsiveButton variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </ResponsiveButton>
                </div>
              </ResponsiveCard>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <ResponsiveCard className="text-center py-12">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <ResponsiveText as="h3" size="lg" weight="medium" className="mt-2 text-gray-900">
                エージェントが見つかりません
              </ResponsiveText>
              <ResponsiveText className="mt-1 text-gray-500">
                検索条件を変更してお試しください
              </ResponsiveText>
            </ResponsiveCard>
          )}
        </ResponsiveLayout>
      </div>
    </AdminLayout>
  );
}