import { useState, useEffect } from 'react';
import { ResponsiveLayout, ResponsiveCard, ResponsiveText, ResponsiveButton } from '../components/responsive';
import AdminLayout from '../components/AdminLayout';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'inactive' | 'paused' | 'closed';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  deadline?: string;
  applications: number;
  views: number;
  agentId?: string;
  agentName?: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'フロントエンドエンジニア',
        company: '株式会社テクノロジー',
        companyId: '1',
        location: '東京都渋谷区',
        type: 'full-time',
        status: 'active',
        salary: {
          min: 5000000,
          max: 8000000,
          currency: 'JPY'
        },
        description: 'React、TypeScriptを使用したWebアプリケーション開発',
        requirements: ['React経験3年以上', 'TypeScript経験', 'Git経験'],
        benefits: ['リモートワーク可', 'フレックス制度', '研修制度'],
        postedAt: '2024-01-15',
        deadline: '2024-02-15',
        applications: 23,
        views: 156,
        agentId: '1',
        agentName: '佐藤花子'
      },
      {
        id: '2',
        title: 'マーケティングマネージャー',
        company: 'グローバル商事株式会社',
        companyId: '2',
        location: '大阪府大阪市',
        type: 'full-time',
        status: 'active',
        salary: {
          min: 6000000,
          max: 9000000,
          currency: 'JPY'
        },
        description: 'デジタルマーケティング戦略の立案・実行',
        requirements: ['マーケティング経験5年以上', 'デジタルマーケティング経験', '管理経験'],
        benefits: ['ボーナス制度', '研修制度', '健康診断'],
        postedAt: '2024-01-10',
        deadline: '2024-02-10',
        applications: 45,
        views: 234,
        agentId: '2',
        agentName: '高橋美咲'
      },
      {
        id: '3',
        title: 'バックエンドエンジニア（契約）',
        company: 'スタートアップ・イノベーション',
        companyId: '3',
        location: '神奈川県横浜市',
        type: 'contract',
        status: 'paused',
        salary: {
          min: 4000000,
          max: 6000000,
          currency: 'JPY'
        },
        description: 'Node.js、Pythonを使用したAPI開発',
        requirements: ['Node.js経験2年以上', 'Python経験', 'AWS経験'],
        benefits: ['リモートワーク可', 'フレキシブルな勤務時間'],
        postedAt: '2024-01-05',
        applications: 12,
        views: 89,
        agentId: '3',
        agentName: '鈴木一郎'
      }
    ];
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
  }, []);

  // Filter jobs
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter, typeFilter]);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    };
    const labels = {
      active: 'アクティブ',
      inactive: '非アクティブ',
      paused: '一時停止',
      closed: '終了'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-green-100 text-green-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800'
    };
    const labels = {
      'full-time': '正社員',
      'part-time': 'パート',
      'contract': '契約',
      'internship': 'インターン'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type as keyof typeof styles]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatSalary = (salary: Job['salary']) => {
    const min = (salary.min / 10000).toFixed(0);
    const max = (salary.max / 10000).toFixed(0);
    return `¥${min}万 - ¥${max}万`;
  };

  const breadcrumbs = [
    { label: 'ダッシュボード', href: '/admin' },
    { label: '求人管理' }
  ];

  return (
    <AdminLayout title="求人管理" breadcrumbs={breadcrumbs}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <ResponsiveLayout>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <ResponsiveText as="h1" size="2xl" weight="bold" className="text-gray-900 mb-2">
                  求人管理
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  システムに投稿されている求人を管理し、応募状況を監視できます
                </ResponsiveText>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <ResponsiveButton variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>エクスポート</span>
                </ResponsiveButton>
                <ResponsiveButton className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>新規求人</span>
                </ResponsiveButton>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">総求人数</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {jobs.length}
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
                    {jobs.filter(j => j.status === 'active').length}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">総応募数</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {jobs.reduce((sum, j) => sum + j.applications, 0)}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">総閲覧数</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {jobs.reduce((sum, j) => sum + j.views, 0)}
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
                    placeholder="求人タイトル、企業名で検索..."
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
                  <option value="paused">一時停止</option>
                  <option value="closed">終了</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">雇用形態</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">すべて</option>
                  <option value="full-time">正社員</option>
                  <option value="part-time">パート</option>
                  <option value="contract">契約</option>
                  <option value="internship">インターン</option>
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

          {/* Jobs List */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <ResponsiveCard key={job.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <ResponsiveText as="h3" size="xl" weight="semibold" className="text-gray-900">
                        {job.title}
                      </ResponsiveText>
                      {getStatusIcon(job.status)}
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{job.postedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTypeBadge(job.type)}
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <ResponsiveText className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {job.description}
                </ResponsiveText>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <ResponsiveText as="p" size="lg" weight="bold" className="text-gray-900">
                      {job.applications}
                    </ResponsiveText>
                    <ResponsiveText className="text-xs text-gray-500">応募数</ResponsiveText>
                  </div>
                  <div className="text-center">
                    <ResponsiveText as="p" size="lg" weight="bold" className="text-gray-900">
                      {job.views}
                    </ResponsiveText>
                    <ResponsiveText className="text-xs text-gray-500">閲覧数</ResponsiveText>
                  </div>
                  <div className="text-center">
                    <ResponsiveText as="p" size="lg" weight="bold" className="text-gray-900">
                      {job.deadline || 'なし'}
                    </ResponsiveText>
                    <ResponsiveText className="text-xs text-gray-500">締切</ResponsiveText>
                  </div>
                </div>

                {/* Agent Info */}
                {job.agentName && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Users className="w-4 h-4" />
                    <span>担当エージェント: {job.agentName}</span>
                  </div>
                )}

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

          {filteredJobs.length === 0 && (
            <ResponsiveCard className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <ResponsiveText as="h3" size="lg" weight="medium" className="mt-2 text-gray-900">
                求人が見つかりません
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