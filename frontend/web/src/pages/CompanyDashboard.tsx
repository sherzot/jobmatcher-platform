import { useState, useEffect } from "react";
import {
  ResponsiveLayout,
  ResponsiveCard,
  ResponsiveText,
  ResponsiveButton,
  ResponsiveForm,
  ResponsiveTable,
} from "../components/responsive";
import { Container, Button } from "../app/ui";
import { useAuth } from "../app/auth/AuthProvider";
import {
  Building2,
  Briefcase,
  Users,
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  TrendingUp,
  Target,
  Calendar,
  MapPin,
  DollarSign,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  UserCheck,
  FileText,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: {
    min: number;
    max: number;
  };
  type: "full-time" | "part-time" | "contract" | "internship";
  status: "draft" | "published" | "closed" | "paused";
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  deadline: string;
  requirements: string[];
  benefits: string[];
  description: string;
  responsibilities: string[];
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected";
  appliedDate: string;
  resumeUrl: string;
  coverLetter: string;
  experience: string;
  skills: string[];
  education: string;
  expectedSalary: number;
  availability: string;
}

interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  logo: string;
  foundedYear: number;
  employeeCount: string;
  benefits: string[];
  culture: string;
  mission: string;
  vision: string;
}

export default function CompanyDashboard() {
  const { state } = useAuth();
  const currentUser = state.user;

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Check authentication
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "company") {
      window.location.href = "/register";
      return;
    }
  }, []);

  // Load company data from API
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        // Load company profile
        const profileResponse = await fetch(
          `${import.meta.env.VITE_API_COMPANY}/api/v1/company/profile`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setCompanyProfile(profileData);
        }

        // Load jobs
        const jobsResponse = await fetch(
          `${import.meta.env.VITE_API_JOB}/api/v1/jobs/company`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData);
        }

        // Load applications
        const applicationsResponse = await fetch(
          `${import.meta.env.VITE_API_OFFER}/api/v1/applications/company`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setApplications(applicationsData);
        }
      } catch (error) {
        console.error("Error loading company data:", error);
      }
    };

    if (currentUser) {
      loadCompanyData();
    }
  }, [currentUser, state.token]);

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
      paused: "bg-yellow-100 text-yellow-800",
      applied: "bg-blue-100 text-blue-800",
      screening: "bg-yellow-100 text-yellow-800",
      interview: "bg-purple-100 text-purple-800",
      offer: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      draft: "下書き",
      published: "公開中",
      closed: "終了",
      paused: "一時停止",
      applied: "応募済み",
      screening: "書類選考",
      interview: "面接",
      offer: "内定",
      rejected: "不採用",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const tabs = [
    { id: "overview", name: "概要", icon: Building2 },
    { id: "profile", name: "企業プロフィール", icon: FileText },
    { id: "jobs", name: "求人管理", icon: Briefcase },
    { id: "applications", name: "応募管理", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <ResponsiveText
                  as="h1"
                  size="xl"
                  weight="bold"
                  className="text-gray-900"
                >
                  企業ダッシュボード
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  こんにちは、{companyProfile?.name || currentUser?.name}さん
                </ResponsiveText>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ResponsiveButton
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "編集終了" : "編集"}
              </ResponsiveButton>
              <ResponsiveButton onClick={() => (window.location.href = "/")}>
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
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ResponsiveCard className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        投稿求人数
                      </ResponsiveText>
                      <ResponsiveText
                        as="p"
                        size="2xl"
                        weight="bold"
                        className="text-gray-900"
                      >
                        {jobs.length}
                      </ResponsiveText>
                    </div>
                  </div>
                </ResponsiveCard>

                <ResponsiveCard className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        総応募数
                      </ResponsiveText>
                      <ResponsiveText
                        as="p"
                        size="2xl"
                        weight="bold"
                        className="text-gray-900"
                      >
                        {applications.length}
                      </ResponsiveText>
                    </div>
                  </div>
                </ResponsiveCard>

                <ResponsiveCard className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Eye className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        総閲覧数
                      </ResponsiveText>
                      <ResponsiveText
                        as="p"
                        size="2xl"
                        weight="bold"
                        className="text-gray-900"
                      >
                        {jobs.reduce((sum, job) => sum + job.viewsCount, 0)}
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
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        採用成功数
                      </ResponsiveText>
                      <ResponsiveText
                        as="p"
                        size="2xl"
                        weight="bold"
                        className="text-gray-900"
                      >
                        {applications.filter((app) => app.status === "offer").length}
                      </ResponsiveText>
                    </div>
                  </div>
                </ResponsiveCard>
              </div>

              {/* Recent Jobs */}
              <ResponsiveCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <ResponsiveText
                    as="h3"
                    size="lg"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    最近の求人
                  </ResponsiveText>
                  <ResponsiveButton
                    variant="outline"
                    onClick={() => setActiveTab("jobs")}
                  >
                    すべて表示
                  </ResponsiveButton>
                </div>
                <div className="space-y-4">
                  {jobs.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <ResponsiveText
                            as="h4"
                            size="lg"
                            weight="medium"
                            className="text-gray-900"
                          >
                            {job.title}
                          </ResponsiveText>
                          {getStatusBadge(job.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.applicationsCount}件の応募</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ResponsiveCard>

              {/* Recent Applications */}
              <ResponsiveCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <ResponsiveText
                    as="h3"
                    size="lg"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    最近の応募
                  </ResponsiveText>
                  <ResponsiveButton
                    variant="outline"
                    onClick={() => setActiveTab("applications")}
                  >
                    すべて表示
                  </ResponsiveButton>
                </div>
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <ResponsiveText
                            as="h4"
                            size="lg"
                            weight="medium"
                            className="text-gray-900"
                          >
                            {application.candidateName}
                          </ResponsiveText>
                          {getStatusBadge(application.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{application.jobTitle}</span>
                          <span>•</span>
                          <span>{application.appliedDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ResponsiveCard>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <ResponsiveText
                  as="h2"
                  size="2xl"
                  weight="bold"
                  className="text-gray-900"
                >
                  企業プロフィール
                </ResponsiveText>
                <ResponsiveButton>
                  <Edit className="w-4 h-4 mr-2" />
                  編集
                </ResponsiveButton>
              </div>

              <ResponsiveCard className="p-6">
                <ResponsiveForm>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        企業名
                      </label>
                      <input
                        type="text"
                        value={companyProfile?.name || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        業界
                      </label>
                      <input
                        type="text"
                        value={companyProfile?.industry || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        所在地
                      </label>
                      <input
                        type="text"
                        value={companyProfile?.location || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        従業員数
                      </label>
                      <input
                        type="text"
                        value={companyProfile?.employeeCount || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ウェブサイト
                      </label>
                      <input
                        type="url"
                        value={companyProfile?.website || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        設立年
                      </label>
                      <input
                        type="number"
                        value={companyProfile?.foundedYear || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      企業説明
                    </label>
                    <textarea
                      value={companyProfile?.description || ""}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      disabled={!isEditing}
                    />
                  </div>
                </ResponsiveForm>
              </ResponsiveCard>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <ResponsiveText
                  as="h2"
                  size="2xl"
                  weight="bold"
                  className="text-gray-900"
                >
                  求人管理
                </ResponsiveText>
                <ResponsiveButton>
                  <Plus className="w-4 h-4 mr-2" />
                  求人を投稿
                </ResponsiveButton>
              </div>

              <ResponsiveTable>
                <thead>
                  <tr>
                    <th>求人タイトル</th>
                    <th>部署</th>
                    <th>勤務地</th>
                    <th>給与</th>
                    <th>応募数</th>
                    <th>閲覧数</th>
                    <th>ステータス</th>
                    <th>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">
                            {job.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.type === "full-time" ? "正社員" : 
                             job.type === "part-time" ? "パート" :
                             job.type === "contract" ? "契約社員" : "インターン"}
                          </div>
                        </div>
                      </td>
                      <td>{job.department}</td>
                      <td>{job.location}</td>
                      <td>
                        {job.salary.min.toLocaleString()}円〜{job.salary.max.toLocaleString()}円
                      </td>
                      <td>{job.applicationsCount}</td>
                      <td>{job.viewsCount}</td>
                      <td>{getStatusBadge(job.status)}</td>
                      <td>
                        <div className="flex space-x-2">
                          <ResponsiveButton variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </ResponsiveButton>
                          <ResponsiveButton variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </ResponsiveButton>
                          <ResponsiveButton
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </ResponsiveButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ResponsiveTable>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <ResponsiveText
                  as="h2"
                  size="2xl"
                  weight="bold"
                  className="text-gray-900"
                >
                  応募管理
                </ResponsiveText>
                <div className="flex space-x-3">
                  <ResponsiveButton variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    フィルター
                  </ResponsiveButton>
                  <ResponsiveButton variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    エクスポート
                  </ResponsiveButton>
                </div>
              </div>

              <ResponsiveTable>
                <thead>
                  <tr>
                    <th>応募者</th>
                    <th>求人</th>
                    <th>応募日</th>
                    <th>希望給与</th>
                    <th>ステータス</th>
                    <th>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">
                            {application.candidateName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.candidateEmail}
                          </div>
                        </div>
                      </td>
                      <td>{application.jobTitle}</td>
                      <td>{application.appliedDate}</td>
                      <td>{application.expectedSalary?.toLocaleString()}円</td>
                      <td>{getStatusBadge(application.status)}</td>
                      <td>
                        <div className="flex space-x-2">
                          <ResponsiveButton variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </ResponsiveButton>
                          <ResponsiveButton variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </ResponsiveButton>
                          <ResponsiveButton variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </ResponsiveButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ResponsiveTable>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
