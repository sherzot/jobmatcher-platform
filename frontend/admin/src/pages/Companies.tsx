import { useState, useEffect } from 'react';
import { ResponsiveLayout, ResponsiveCard, ResponsiveText, ResponsiveButton } from '../components/responsive';
import AdminLayout from '../components/AdminLayout';
import { 
  Building2, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  MapPin,
  Users,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  MoreVertical
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  location: string;
  description?: string;
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  rating: number;
  createdAt: string;
  lastActive?: string;
  contactPerson?: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');

  // Mock data
  useEffect(() => {
    const mockCompanies: Company[] = [
      {
        id: '1',
        name: '株式会社テクノロジー',
        email: 'contact@tech-company.com',
        phone: '03-1234-5678',
        website: 'https://tech-company.com',
        status: 'active',
        industry: 'IT・ソフトウェア',
        size: 'large',
        location: '東京都渋谷区',
        description: '最先端のAI技術を活用したソリューションを提供するIT企業',
        totalJobs: 45,
        activeJobs: 12,
        completedJobs: 33,
        rating: 4.7,
        createdAt: '2023-03-15',
        lastActive: '2024-01-20',
        contactPerson: '田中太郎'
      },
      {
        id: '2',
        name: 'グローバル商事株式会社',
        email: 'info@global-trading.com',
        phone: '06-2345-6789',
        website: 'https://global-trading.com',
        status: 'active',
        industry: '商社・貿易',
        size: 'enterprise',
        location: '大阪府大阪市',
        description: '世界各国との貿易取引を行う総合商社',
        totalJobs: 78,
        activeJobs: 23,
        completedJobs: 55,
        rating: 4.5,
        createdAt: '2023-01-20',
        lastActive: '2024-01-19',
        contactPerson: '佐藤花子'
      }
    ];
    setCompanies(mockCompanies);
    setFilteredCompanies(mockCompanies);
  }, []);

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

  const breadcrumbs = [
    { label: 'ダッシュボード', href: '/admin' },
    { label: '企業管理' }
  ];

  return (
    <AdminLayout title="企業管理" breadcrumbs={breadcrumbs}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <ResponsiveLayout>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <ResponsiveText as="h1" size="2xl" weight="bold" className="text-gray-900 mb-2">
                  企業管理
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  登録されている企業を管理し、求人活動を監視できます
                </ResponsiveText>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <ResponsiveButton variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>エクスポート</span>
                </ResponsiveButton>
                <ResponsiveButton className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>新規企業</span>
                </ResponsiveButton>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">総企業数</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {companies.length}
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
                    {companies.filter(c => c.status === 'active').length}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">総求人数</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {companies.reduce((sum, c) => sum + c.totalJobs, 0)}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">平均評価</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {(companies.reduce((sum, c) => sum + c.rating, 0) / companies.length).toFixed(1)}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <ResponsiveCard key={company.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900 truncate">
                        {company.name}
                      </ResponsiveText>
                      <ResponsiveText className="text-sm text-gray-500 truncate">
                        {company.email}
                      </ResponsiveText>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(company.status)}
                  </div>
                </div>

                {company.description && (
                  <ResponsiveText className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {company.description}
                  </ResponsiveText>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <ResponsiveText as="p" size="lg" weight="bold" className="text-gray-900">
                      {company.totalJobs}
                    </ResponsiveText>
                    <ResponsiveText className="text-xs text-gray-500">総求人数</ResponsiveText>
                  </div>
                  <div className="text-center">
                    <ResponsiveText as="p" size="lg" weight="bold" className="text-gray-900">
                      {company.activeJobs}
                    </ResponsiveText>
                    <ResponsiveText className="text-xs text-gray-500">アクティブ</ResponsiveText>
                  </div>
                  <div className="text-center">
                    <ResponsiveText as="p" size="lg" weight="bold" className="text-gray-900">
                      {company.completedJobs}
                    </ResponsiveText>
                    <ResponsiveText className="text-xs text-gray-500">完了</ResponsiveText>
                  </div>
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
        </ResponsiveLayout>
      </div>
    </AdminLayout>
  );
}