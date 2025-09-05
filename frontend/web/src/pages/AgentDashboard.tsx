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
  UserCheck,
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
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  jobsCount: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  salary: {
    min: number;
    max: number;
  };
  type: "full-time" | "part-time" | "contract" | "internship";
  status: "draft" | "published" | "closed" | "paused";
  applicationsCount: number;
  createdAt: string;
  deadline: string;
  requirements: string[];
  benefits: string[];
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  candidateEmail: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected";
  appliedDate: string;
  resumeUrl: string;
  coverLetter: string;
  experience: string;
  skills: string[];
}

export default function AgentDashboard() {
  const { state } = useAuth();
  const currentUser = state.user;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Check authentication
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "agent") {
      window.location.href = "/agent/login";
      return;
    }
  }, []);

  // Load agent data from API
  useEffect(() => {
    const loadAgentData = async () => {
      try {
        // Load companies
        const companiesResponse = await fetch(
          `${import.meta.env.VITE_API_COMPANY}/api/v1/companies/agent`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setCompanies(companiesData);
        }

        // Load jobs
        const jobsResponse = await fetch(
          `${import.meta.env.VITE_API_JOB}/api/v1/jobs/agent`,
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
          `${import.meta.env.VITE_API_OFFER}/api/v1/applications/agent`,
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
        console.error("Error loading agent data:", error);
      }
    };

    if (currentUser) {
      loadAgentData();
    }
  }, [currentUser, state.token]);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
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
      active: "アクティブ",
      inactive: "非アクティブ",
      pending: "承認待ち",
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
    { id: "overview", name: "概要", icon: UserCheck },
    { id: "companies", name: "企業管理", icon: Building2 },
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
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <ResponsiveText
                  as="h1"
                  size="xl"
                  weight="bold"
                  className="text-gray-900"
                >
                  エージェントダッシュボード
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  こんにちは、{currentUser?.name}さん
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
                    ? "border-green-500 text-green-600"
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
                      <Building2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        管理企業数
                      </ResponsiveText>
                      <ResponsiveText
                        as="p"
                        size="2xl"
                        weight="bold"
                        className="text-gray-900"
                      >
                        {companies.length}
                      </ResponsiveText>
                    </div>
                  </div>
                </ResponsiveCard>

                <ResponsiveCard className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Briefcase className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        求人数
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
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        応募数
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
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        成功マッチング
                      </ResponsiveText>
                      <ResponsiveText
                        as="p"
                        size="2xl"
                        weight="bold"
                        className="text-gray-900"
                      >
                        {
                          applications.filter((app) => app.status === "offer")
                            .length
                        }
                      </ResponsiveText>
                    </div>
                  </div>
                </ResponsiveCard>
              </div>

              {/* Recent Companies */}
              <ResponsiveCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <ResponsiveText
                    as="h3"
                    size="lg"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    最近の企業
                  </ResponsiveText>
                  <ResponsiveButton
                    variant="outline"
                    onClick={() => setActiveTab("companies")}
                  >
                    すべて表示
                  </ResponsiveButton>
                </div>
                <div className="space-y-4">
                  {companies.slice(0, 3).map((company) => (
                    <div
                      key={company.id}
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
                            {company.name}
                          </ResponsiveText>
                          {getStatusBadge(company.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{company.industry}</span>
                          <span>•</span>
                          <span>{company.location}</span>
                          <span>•</span>
                          <span>{company.jobsCount}件の求人</span>
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
                          <span>{application.company}</span>
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

          {/* Companies Tab */}
          {activeTab === "companies" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <ResponsiveText
                  as="h2"
                  size="2xl"
                  weight="bold"
                  className="text-gray-900"
                >
                  企業管理
                </ResponsiveText>
                <ResponsiveButton>
                  <Plus className="w-4 h-4 mr-2" />
                  企業を追加
                </ResponsiveButton>
              </div>

              <ResponsiveTable>
                <thead>
                  <tr>
                    <th>企業名</th>
                    <th>業界</th>
                    <th>所在地</th>
                    <th>求人数</th>
                    <th>ステータス</th>
                    <th>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">
                            {company.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {company.contactPerson}
                          </div>
                        </div>
                      </td>
                      <td>{company.industry}</td>
                      <td>{company.location}</td>
                      <td>{company.jobsCount}</td>
                      <td>{getStatusBadge(company.status)}</td>
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
                    <th>企業</th>
                    <th>勤務地</th>
                    <th>給与</th>
                    <th>応募数</th>
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
                            {job.type === "full-time"
                              ? "正社員"
                              : job.type === "part-time"
                              ? "パート"
                              : job.type === "contract"
                              ? "契約社員"
                              : "インターン"}
                          </div>
                        </div>
                      </td>
                      <td>{job.company}</td>
                      <td>{job.location}</td>
                      <td>
                        {job.salary.min.toLocaleString()}円〜
                        {job.salary.max.toLocaleString()}円
                      </td>
                      <td>{job.applicationsCount}</td>
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
                    <th>企業</th>
                    <th>応募日</th>
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
                      <td>{application.company}</td>
                      <td>{application.appliedDate}</td>
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
