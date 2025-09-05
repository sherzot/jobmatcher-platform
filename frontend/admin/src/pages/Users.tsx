import { useState, useEffect } from 'react';
import { ResponsiveLayout, ResponsiveCard, ResponsiveText, ResponsiveButton, ResponsiveTable } from '../components/responsive';
import AdminLayout from '../components/AdminLayout';
import { 
  Users, 
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
  UserCheck,
  UserX,
  MoreVertical
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'agent' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  location?: string;
  avatar?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: '田中太郎',
        email: 'tanaka@example.com',
        phone: '090-1234-5678',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: '2024-01-20',
        location: '東京都'
      },
      {
        id: '2',
        name: '佐藤花子',
        email: 'sato@example.com',
        phone: '090-2345-6789',
        role: 'agent',
        status: 'active',
        createdAt: '2024-01-10',
        lastLogin: '2024-01-19',
        location: '大阪府'
      },
      {
        id: '3',
        name: '鈴木一郎',
        email: 'suzuki@example.com',
        role: 'user',
        status: 'pending',
        createdAt: '2024-01-18',
        location: '神奈川県'
      },
      {
        id: '4',
        name: '高橋美咲',
        email: 'takahashi@example.com',
        phone: '090-3456-7890',
        role: 'agent',
        status: 'inactive',
        createdAt: '2024-01-05',
        lastLogin: '2024-01-10',
        location: '愛知県'
      },
      {
        id: '5',
        name: '山田次郎',
        email: 'yamada@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-12',
        lastLogin: '2024-01-20',
        location: '福岡県'
      }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      active: 'アクティブ',
      inactive: '非アクティブ',
      pending: '承認待ち'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      user: 'bg-blue-100 text-blue-800',
      agent: 'bg-purple-100 text-purple-800',
      admin: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      user: 'ユーザー',
      agent: 'エージェント',
      admin: '管理者'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const breadcrumbs = [
    { label: 'ダッシュボード', href: '/admin' },
    { label: 'ユーザー管理' }
  ];

  return (
    <AdminLayout title="ユーザー管理" breadcrumbs={breadcrumbs}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <ResponsiveLayout>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <ResponsiveText as="h1" size="2xl" weight="bold" className="text-gray-900 mb-2">
                  ユーザー管理
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  システムに登録されているユーザーを管理できます
                </ResponsiveText>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <ResponsiveButton variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>エクスポート</span>
                </ResponsiveButton>
                <ResponsiveButton className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>新規ユーザー</span>
                </ResponsiveButton>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">総ユーザー数</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {users.length}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">アクティブ</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {users.filter(u => u.status === 'active').length}
                  </ResponsiveText>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserX className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <ResponsiveText className="text-sm font-medium text-gray-500">承認待ち</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {users.filter(u => u.status === 'pending').length}
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
                  <ResponsiveText className="text-sm font-medium text-gray-500">エージェント</ResponsiveText>
                  <ResponsiveText as="p" size="2xl" weight="bold" className="text-gray-900">
                    {users.filter(u => u.role === 'agent').length}
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
                    placeholder="名前またはメールで検索..."
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
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ロール</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">すべて</option>
                  <option value="user">ユーザー</option>
                  <option value="agent">エージェント</option>
                  <option value="admin">管理者</option>
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

          {/* Users Table */}
          <ResponsiveCard className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900">
                  ユーザー一覧 ({filteredUsers.length}件)
                </ResponsiveText>
                {selectedUsers.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <ResponsiveText className="text-sm text-gray-600">
                      {selectedUsers.length}件選択中
                    </ResponsiveText>
                    <ResponsiveButton variant="outline" size="sm">
                      一括操作
                    </ResponsiveButton>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ユーザー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ロール
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      登録日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最終ログイン
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <ResponsiveText as="h3" size="lg" weight="medium" className="mt-2 text-gray-900">
                  ユーザーが見つかりません
                </ResponsiveText>
                <ResponsiveText className="mt-1 text-gray-500">
                  検索条件を変更してお試しください
                </ResponsiveText>
              </div>
            )}
          </ResponsiveCard>
        </ResponsiveLayout>
      </div>
    </AdminLayout>
  );
}
