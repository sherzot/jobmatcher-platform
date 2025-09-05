import { useState } from 'react';
import { ResponsiveLayout, ResponsiveCard, ResponsiveText, ResponsiveButton, ResponsiveForm } from '../components/responsive';
import AdminLayout from '../components/AdminLayout';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw,
  Database,
  Mail,
  Shield,
  Bell,
  Globe,
  Key,
  Users,
  Building2,
  Briefcase,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    timezone: string;
    language: string;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    allowedDomains: string[];
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    adminNotifications: boolean;
  };
  limits: {
    maxUsers: number;
    maxAgents: number;
    maxCompanies: number;
    maxJobs: number;
    maxFileSize: number;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'JobMatcher Platform',
      siteDescription: '求人マッチングプラットフォーム',
      siteUrl: 'https://jobmatcher.com',
      timezone: 'Asia/Tokyo',
      language: 'ja'
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'noreply@jobmatcher.com',
      smtpPassword: '********',
      fromEmail: 'noreply@jobmatcher.com',
      fromName: 'JobMatcher'
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowedDomains: ['jobmatcher.com', 'admin.jobmatcher.com']
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      adminNotifications: true
    },
    limits: {
      maxUsers: 10000,
      maxAgents: 1000,
      maxCompanies: 5000,
      maxJobs: 50000,
      maxFileSize: 10
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('設定が保存されました');
    }, 1000);
  };

  const handleReset = () => {
    if (confirm('設定をリセットしますか？')) {
      // Reset to default values
      alert('設定がリセットされました');
    }
  };

  const tabs = [
    { id: 'general', name: '一般設定', icon: SettingsIcon },
    { id: 'email', name: 'メール設定', icon: Mail },
    { id: 'security', name: 'セキュリティ', icon: Shield },
    { id: 'notifications', name: '通知設定', icon: Bell },
    { id: 'limits', name: '制限設定', icon: Database }
  ];

  const breadcrumbs = [
    { label: 'ダッシュボード', href: '/admin' },
    { label: 'システム設定' }
  ];

  return (
    <AdminLayout title="システム設定" breadcrumbs={breadcrumbs}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <ResponsiveLayout>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <ResponsiveText as="h1" size="2xl" weight="bold" className="text-gray-900 mb-2">
                  システム設定
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  プラットフォームの設定を管理し、システムの動作を制御できます
                </ResponsiveText>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <ResponsiveButton variant="outline" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  リセット
                </ResponsiveButton>
                <ResponsiveButton onClick={handleSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? '保存中...' : '保存'}
                </ResponsiveButton>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ResponsiveCard className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mr-3" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </ResponsiveCard>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <ResponsiveCard className="p-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div>
                    <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900 mb-6">
                      一般設定
                    </ResponsiveText>
                    <ResponsiveForm>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            サイト名
                          </label>
                          <input
                            type="text"
                            value={settings.general.siteName}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, siteName: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            サイトURL
                          </label>
                          <input
                            type="url"
                            value={settings.general.siteUrl}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, siteUrl: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            サイト説明
                          </label>
                          <textarea
                            value={settings.general.siteDescription}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, siteDescription: e.target.value }
                            }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            タイムゾーン
                          </label>
                          <select
                            value={settings.general.timezone}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, timezone: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="Asia/Tokyo">Asia/Tokyo</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New_York</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            言語
                          </label>
                          <select
                            value={settings.general.language}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, language: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="ja">日本語</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>
                    </ResponsiveForm>
                  </div>
                )}

                {/* Email Settings */}
                {activeTab === 'email' && (
                  <div>
                    <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900 mb-6">
                      メール設定
                    </ResponsiveText>
                    <ResponsiveForm>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTPホスト
                          </label>
                          <input
                            type="text"
                            value={settings.email.smtpHost}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, smtpHost: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTPポート
                          </label>
                          <input
                            type="number"
                            value={settings.email.smtpPort}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, smtpPort: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTPユーザー名
                          </label>
                          <input
                            type="text"
                            value={settings.email.smtpUsername}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, smtpUsername: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTPパスワード
                          </label>
                          <input
                            type="password"
                            value={settings.email.smtpPassword}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, smtpPassword: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            送信者メール
                          </label>
                          <input
                            type="email"
                            value={settings.email.fromEmail}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, fromEmail: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            送信者名
                          </label>
                          <input
                            type="text"
                            value={settings.email.fromName}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, fromName: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </ResponsiveForm>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div>
                    <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900 mb-6">
                      セキュリティ設定
                    </ResponsiveText>
                    <ResponsiveForm>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            セッションタイムアウト（分）
                          </label>
                          <input
                            type="number"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            最大ログイン試行回数
                          </label>
                          <input
                            type="number"
                            value={settings.security.maxLoginAttempts}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            パスワード最小長
                          </label>
                          <input
                            type="number"
                            value={settings.security.passwordMinLength}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.security.requireTwoFactor}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              security: { ...prev.security, requireTwoFactor: e.target.checked }
                            }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-700">
                            二要素認証を必須にする
                          </label>
                        </div>
                      </div>
                    </ResponsiveForm>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div>
                    <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900 mb-6">
                      通知設定
                    </ResponsiveText>
                    <ResponsiveForm>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <ResponsiveText className="text-sm font-medium text-gray-700">
                              メール通知
                            </ResponsiveText>
                            <ResponsiveText className="text-sm text-gray-500">
                              重要なイベントをメールで通知
                            </ResponsiveText>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                            }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <ResponsiveText className="text-sm font-medium text-gray-700">
                              プッシュ通知
                            </ResponsiveText>
                            <ResponsiveText className="text-sm text-gray-500">
                              ブラウザでプッシュ通知を表示
                            </ResponsiveText>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications.pushNotifications}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, pushNotifications: e.target.checked }
                            }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <ResponsiveText className="text-sm font-medium text-gray-700">
                              SMS通知
                            </ResponsiveText>
                            <ResponsiveText className="text-sm text-gray-500">
                              緊急時のみSMSで通知
                            </ResponsiveText>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications.smsNotifications}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, smsNotifications: e.target.checked }
                            }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <ResponsiveText className="text-sm font-medium text-gray-700">
                              管理者通知
                            </ResponsiveText>
                            <ResponsiveText className="text-sm text-gray-500">
                              システム管理者に通知を送信
                            </ResponsiveText>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications.adminNotifications}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, adminNotifications: e.target.checked }
                            }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </ResponsiveForm>
                  </div>
                )}

                {/* Limits Settings */}
                {activeTab === 'limits' && (
                  <div>
                    <ResponsiveText as="h3" size="lg" weight="semibold" className="text-gray-900 mb-6">
                      制限設定
                    </ResponsiveText>
                    <ResponsiveForm>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            最大ユーザー数
                          </label>
                          <input
                            type="number"
                            value={settings.limits.maxUsers}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              limits: { ...prev.limits, maxUsers: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            最大エージェント数
                          </label>
                          <input
                            type="number"
                            value={settings.limits.maxAgents}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              limits: { ...prev.limits, maxAgents: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            最大企業数
                          </label>
                          <input
                            type="number"
                            value={settings.limits.maxCompanies}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              limits: { ...prev.limits, maxCompanies: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            最大求人数
                          </label>
                          <input
                            type="number"
                            value={settings.limits.maxJobs}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              limits: { ...prev.limits, maxJobs: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            最大ファイルサイズ（MB）
                          </label>
                          <input
                            type="number"
                            value={settings.limits.maxFileSize}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              limits: { ...prev.limits, maxFileSize: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </ResponsiveForm>
                  </div>
                )}
              </ResponsiveCard>
            </div>
          </div>
        </ResponsiveLayout>
      </div>
    </AdminLayout>
  );
}
