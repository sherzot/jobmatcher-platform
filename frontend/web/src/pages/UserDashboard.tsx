import { useState, useEffect } from "react";
import {
  ResponsiveLayout,
  ResponsiveCard,
  ResponsiveText,
  ResponsiveButton,
  ResponsiveForm,
} from "../components/responsive";
import { Container, Button } from "../app/ui";
import { useAuth } from "../app/auth/AuthProvider";
import {
  User,
  FileText,
  Search,
  Briefcase,
  Upload,
  Edit,
  Save,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  Award,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  Star,
  ArrowRight,
  Plus,
  Trash2,
  Download,
} from "lucide-react";

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
    nationality: string;
  };
  workExperience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: "beginner" | "intermediate" | "advanced" | "expert";
    category: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    level: "basic" | "conversational" | "fluent" | "native";
  }>;
  preferences: {
    desiredPosition: string;
    desiredLocation: string;
    desiredSalary: {
      min: number;
      max: number;
    };
    workType: "full-time" | "part-time" | "contract" | "internship";
    remoteWork: boolean;
  };
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  agent: string;
  status:
    | "applied"
    | "document-screening"
    | "first-interview"
    | "second-interview"
    | "final-interview"
    | "offer"
    | "rejected";
  appliedDate: string;
  lastUpdate: string;
  nextStep?: string;
  nextStepDate?: string;
}

export default function UserDashboard() {
  const { state } = useAuth();
  const currentUser = state.user;

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: "",
      address: "",
      birthDate: "",
      nationality: "",
    },
    workExperience: [],
    education: [],
    skills: [],
    languages: [],
    preferences: {
      desiredPosition: "",
      desiredLocation: "",
      desiredSalary: { min: 0, max: 0 },
      workType: "full-time",
      remoteWork: false,
    },
  });

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Check authentication
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "user") {
      window.location.href = "/login";
      return;
    }
  }, []);

  // Load user data from API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load resume data from API
        const resumeResponse = await fetch(`${import.meta.env.VITE_API_RESUME}/api/v1/resume`, {
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (resumeResponse.ok) {
          const resumeData = await resumeResponse.json();
          setResumeData(resumeData);
          calculateCompletionPercentage(resumeData);
        } else {
          // If no resume data exists, initialize with user's basic info
          setResumeData(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              name: currentUser?.name || "",
              email: currentUser?.email || "",
            }
          }));
        }

        // Load applications from API
        const applicationsResponse = await fetch(`${import.meta.env.VITE_API_OFFER}/api/v1/applications`, {
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setApplications(applicationsData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Initialize with basic user info if API fails
        setResumeData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            name: currentUser?.name || "",
            email: currentUser?.email || "",
          }
        }));
      }
    };

    if (currentUser) {
      loadUserData();
    }
  }, [currentUser, state.token]);

  const calculateCompletionPercentage = (data: ResumeData) => {
    let completed = 0;
    let total = 0;

    // Personal info
    total += 6;
    completed += Object.values(data.personalInfo).filter(
      (value) => value !== ""
    ).length;

    // Work experience
    total += 1;
    if (data.workExperience.length > 0) completed += 1;

    // Education
    total += 1;
    if (data.education.length > 0) completed += 1;

    // Skills
    total += 1;
    if (data.skills.length > 0) completed += 1;

    // Languages
    total += 1;
    if (data.languages.length > 0) completed += 1;

    // Preferences
    total += 4;
    if (data.preferences.desiredPosition) completed += 1;
    if (data.preferences.desiredLocation) completed += 1;
    if (data.preferences.desiredSalary.min > 0) completed += 1;
    if (data.preferences.workType) completed += 1;

    setCompletionPercentage(Math.round((completed / total) * 100));
  };

  const saveResumeData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_RESUME}/api/v1/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resumeData)
      });

      if (response.ok) {
        alert('履歴書が保存されました');
        calculateCompletionPercentage(resumeData);
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('保存中にエラーが発生しました');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      applied: "bg-blue-100 text-blue-800",
      "document-screening": "bg-yellow-100 text-yellow-800",
      "first-interview": "bg-purple-100 text-purple-800",
      "second-interview": "bg-indigo-100 text-indigo-800",
      "final-interview": "bg-orange-100 text-orange-800",
      offer: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      applied: "応募済み",
      "document-screening": "書類選考",
      "first-interview": "1次面接",
      "second-interview": "2次面接",
      "final-interview": "最終面接",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "offer":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const tabs = [
    { id: "overview", name: "概要", icon: User },
    { id: "resume", name: "履歴書", icon: FileText },
    { id: "jobs", name: "求人検索", icon: Search },
    { id: "applications", name: "応募状況", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <ResponsiveText
                  as="h1"
                  size="xl"
                  weight="bold"
                  className="text-gray-900"
                >
                  ユーザーダッシュボード
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  こんにちは、{currentUser?.name || resumeData.personalInfo.name}さん
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
                    ? "border-blue-500 text-blue-600"
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
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        履歴書完成度
                      </ResponsiveText>
                      <ResponsiveText
                        as="p"
                        size="2xl"
                        weight="bold"
                        className="text-gray-900"
                      >
                        {completionPercentage}%
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
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <ResponsiveText className="text-sm font-medium text-gray-500">
                        進行中
                      </ResponsiveText>
                      <ResponsiveText
                        as="p"
                        size="2xl"
                        weight="bold"
                        className="text-gray-900"
                      >
                        {
                          applications.filter(
                            (app) => !["offer", "rejected"].includes(app.status)
                          ).length
                        }
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
                        内定数
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

              {/* Resume Completion Progress */}
              <ResponsiveCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <ResponsiveText
                    as="h3"
                    size="lg"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    履歴書完成度
                  </ResponsiveText>
                  <ResponsiveText className="text-sm text-gray-500">
                    {completionPercentage}% 完了
                  </ResponsiveText>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        resumeData.personalInfo.name
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>基本情報</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        resumeData.workExperience.length > 0
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>職歴</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        resumeData.education.length > 0
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>学歴</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        resumeData.skills.length > 0
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span>スキル</span>
                  </div>
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
                    最近の応募状況
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
                            {application.jobTitle}
                          </ResponsiveText>
                          {getStatusIcon(application.status)}
                          {getStatusBadge(application.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{application.company}</span>
                          <span>•</span>
                          <span>担当: {application.agent}</span>
                          <span>•</span>
                          <span>{application.appliedDate}</span>
                        </div>
                        {application.nextStep && (
                          <div className="mt-2 text-sm text-blue-600">
                            次のステップ: {application.nextStep} (
                            {application.nextStepDate})
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ResponsiveCard>
            </div>
          )}

          {/* Resume Tab */}
          {activeTab === "resume" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <ResponsiveText
                  as="h2"
                  size="2xl"
                  weight="bold"
                  className="text-gray-900"
                >
                  履歴書・職務経歴書
                </ResponsiveText>
                <div className="flex space-x-3">
                  <ResponsiveButton variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    アップロード
                  </ResponsiveButton>
                  <ResponsiveButton variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    ダウンロード
                  </ResponsiveButton>
                  <ResponsiveButton onClick={saveResumeData}>
                    <Save className="w-4 h-4 mr-2" />
                    保存
                  </ResponsiveButton>
                </div>
              </div>

              {/* Personal Information */}
              <ResponsiveCard className="p-6">
                <ResponsiveText
                  as="h3"
                  size="lg"
                  weight="semibold"
                  className="text-gray-900 mb-6"
                >
                  基本情報
                </ResponsiveText>
                <ResponsiveForm>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        氏名
                      </label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.name}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              name: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              email: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        電話番号
                      </label>
                      <input
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              phone: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        住所
                      </label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.address}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              address: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </ResponsiveForm>
              </ResponsiveCard>

              {/* Work Experience */}
              <ResponsiveCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <ResponsiveText
                    as="h3"
                    size="lg"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    職歴
                  </ResponsiveText>
                  {isEditing && (
                    <ResponsiveButton variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      追加
                    </ResponsiveButton>
                  )}
                </div>
                <div className="space-y-4">
                  {resumeData.workExperience.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <ResponsiveText
                          as="h4"
                          size="lg"
                          weight="medium"
                          className="text-gray-900"
                        >
                          {exp.position}
                        </ResponsiveText>
                        {isEditing && (
                          <div className="flex space-x-2">
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
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            会社名
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            期間
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={exp.startDate}
                              placeholder="開始月"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={!isEditing}
                            />
                            <span className="px-2 py-2 text-gray-500">〜</span>
                            <input
                              type="text"
                              value={exp.endDate}
                              placeholder="終了月"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          職務内容
                        </label>
                        <textarea
                          value={exp.description}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ResponsiveCard>

              {/* Skills */}
              <ResponsiveCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <ResponsiveText
                    as="h3"
                    size="lg"
                    weight="semibold"
                    className="text-gray-900"
                  >
                    スキル
                  </ResponsiveText>
                  {isEditing && (
                    <ResponsiveButton variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      追加
                    </ResponsiveButton>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resumeData.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <ResponsiveText
                          as="h4"
                          size="lg"
                          weight="medium"
                          className="text-gray-900"
                        >
                          {skill.name}
                        </ResponsiveText>
                        {isEditing && (
                          <ResponsiveButton
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </ResponsiveButton>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {skill.category}
                        </span>
                        <span className="text-sm text-gray-300">•</span>
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            skill.level === "expert"
                              ? "bg-green-100 text-green-800"
                              : skill.level === "advanced"
                              ? "bg-blue-100 text-blue-800"
                              : skill.level === "intermediate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {skill.level === "expert"
                            ? "エキスパート"
                            : skill.level === "advanced"
                            ? "上級"
                            : skill.level === "intermediate"
                            ? "中級"
                            : "初級"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
                  求人検索
                </ResponsiveText>
                <ResponsiveButton>
                  <Search className="w-4 h-4 mr-2" />
                  検索
                </ResponsiveButton>
              </div>

              {/* Search Filters */}
              <ResponsiveCard className="p-6">
                <ResponsiveForm>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        職種
                      </label>
                      <input
                        type="text"
                        placeholder="フロントエンドエンジニア"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        勤務地
                      </label>
                      <input
                        type="text"
                        placeholder="東京都"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        年収
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>選択してください</option>
                        <option>300万円〜500万円</option>
                        <option>500万円〜700万円</option>
                        <option>700万円〜1000万円</option>
                        <option>1000万円以上</option>
                      </select>
                    </div>
                  </div>
                </ResponsiveForm>
              </ResponsiveCard>

              {/* Job Listings */}
              <div className="space-y-6">
                {[1, 2, 3].map((job) => (
                  <ResponsiveCard
                    key={job}
                    className="p-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <ResponsiveText
                            as="h3"
                            size="xl"
                            weight="semibold"
                            className="text-gray-900"
                          >
                            シニアフロントエンドエンジニア
                          </ResponsiveText>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            正社員
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>株式会社テクノロジー</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>東京都渋谷区</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>600万円〜900万円</span>
                          </div>
                        </div>
                        <ResponsiveText className="text-gray-600 mb-4">
                          React、TypeScriptを使用したWebアプリケーション開発を行います。最新の技術スタックを活用し、ユーザーエクスペリエンスの向上に貢献していただきます。
                        </ResponsiveText>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>担当エージェント: 佐藤花子</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>2024-01-20 投稿</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <ResponsiveButton>
                          応募する
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </ResponsiveButton>
                        <ResponsiveButton variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          詳細
                        </ResponsiveButton>
                      </div>
                    </div>
                  </ResponsiveCard>
                ))}
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-8">
              <ResponsiveText
                as="h2"
                size="2xl"
                weight="bold"
                className="text-gray-900"
              >
                応募状況
              </ResponsiveText>

              <div className="space-y-6">
                {applications.map((application) => (
                  <ResponsiveCard key={application.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <ResponsiveText
                            as="h3"
                            size="xl"
                            weight="semibold"
                            className="text-gray-900"
                          >
                            {application.jobTitle}
                          </ResponsiveText>
                          {getStatusIcon(application.status)}
                          {getStatusBadge(application.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span>{application.company}</span>
                          <span>•</span>
                          <span>担当エージェント: {application.agent}</span>
                          <span>•</span>
                          <span>応募日: {application.appliedDate}</span>
                        </div>
                        {application.nextStep && (
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="w-5 h-5 text-blue-600" />
                              <ResponsiveText className="font-medium text-blue-900">
                                次のステップ
                              </ResponsiveText>
                            </div>
                            <ResponsiveText className="text-blue-800">
                              {application.nextStep} -{" "}
                              {application.nextStepDate}
                            </ResponsiveText>
                          </div>
                        )}
                      </div>
                    </div>
                  </ResponsiveCard>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
