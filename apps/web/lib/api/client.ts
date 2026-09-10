const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export type ApiResponse<T> = { success: true; data: T };

export type ApiUser = {
  id: number;
  businessCode: string;
  email: string;
  role: "ADMIN" | "AGENT" | "COMPANY" | "CANDIDATE";
};

export type Job = {
  code?: string;
  jobCode?: string;
  status?: string;
  title: string;
  description: string;
  requirements?: string | null;
  benefits?: string | null;
  jobType: string;
  workLocation: string;
  country?: string | null;
  prefecture?: string | null;
  city?: string | null;
  salaryType: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  japaneseLevel?: string | null;
  visaSponsorship: boolean;
  minExperience?: number | null;
  skills: string[] | string;
  publishedAt?: string | null;
  closesAt?: string | null;
  company?: {
    companyCode: string;
    name: string;
    prefecture?: string | null;
  } | null;
};

export type JobSearchResult = {
  items: Job[];
  total: number;
  page: number;
  limit: number;
};

export type AdminStats = {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  pendingCompanies: number;
  pendingJobs: number;
};

export type AdminUserRecord = {
  id: number;
  code: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  profile?: { firstName: string; lastName: string } | null;
};

export type AdminCompanyRecord = {
  id: number;
  companyCode: string;
  name: string;
  industry?: string | null;
  prefecture?: string | null;
  employeeCount?: string | null;
  status: string;
  isActive: boolean;
  createdAt: string;
  user?: { email: string; status: string };
  agentCompanies?: Array<{ agent: { agentCode: string; displayName: string } }>;
};

export type AdminAgentRecord = {
  id: number;
  agentCode: string;
  displayName: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  user?: { email: string; status: string };
  agentCompanies?: Array<{ company: { companyCode: string; name: string } }>;
};

export type AgentCompanyRecord = {
  company: {
    id: number;
    companyCode: string;
    name: string;
    nameEn?: string | null;
    industry?: string | null;
    employeeCount?: string | null;
    prefecture?: string | null;
    businessRegNumber?: string | null;
    registrationNote?: string | null;
    status: string;
    rejectionReason?: string | null;
    createdAt: string;
    jobs?: Array<{
      jobCode: string;
      title: string;
      description?: string;
      status: string;
      jobType: string;
      workLocation?: string;
      prefecture?: string | null;
      salaryMin?: number | null;
      salaryMax?: number | null;
      japaneseLevel?: string | null;
      visaSponsorship?: boolean;
      skills?: string[] | string;
      viewCount?: number;
      closesAt?: string | null;
      applyCount: number;
      publishedAt?: string | null;
    }>;
  };
};
export type CompanyMeRecord = AgentCompanyRecord["company"];

export type AgentApplicationRecord = Application & {
  appCode?: string;
  user?: {
    email: string;
    candidate?: {
      userCode: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string | null;
      japaneseLevel?: string | null;
      yearsOfExperience?: number | null;
    } | null;
  };
  statusHistory?: Array<{
    fromStatus: string | null;
    toStatus: string;
    createdAt: string;
  }>;
};

export type Application = {
  applicationCode: string;
  status: string;
  coverLetter?: string | null;
  createdAt?: string;
  appliedAt?: string;
  job?: Job & { jobCode?: string };
};

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | { message?: string; error?: { message?: string } }
    | null;
  if (!response.ok) {
    const rawMessage =
      payload && "error" in payload
        ? payload.error?.message
        : payload && "message" in payload
          ? payload.message
          : undefined;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(", ")
      : (rawMessage ?? "API request failed");
    throw new ApiError(response.status, message);
  }
  return payload && "success" in payload ? payload.data : (payload as T);
}

export const api = {
  login: (email: string, password: string) =>
    request<ApiUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request<{ message: string }>("/auth/logout", { method: "POST" }),
  me: () => request<ApiUser>("/auth/me", { method: "POST" }),
  searchJobs: (params: URLSearchParams = new URLSearchParams()) =>
    request<JobSearchResult>(
      `/job${params.toString() ? `?${params.toString()}` : ""}`,
    ),
  getJob: (code: string) => request<Job>(`/job/${encodeURIComponent(code)}`),
  createJob: (data: Record<string, unknown>) =>
    request<Job>("/job", { method: "POST", body: JSON.stringify(data) }),
  applyToJob: (code: string, coverLetter?: string) =>
    request<Application>(`/application/job/${encodeURIComponent(code)}/apply`, {
      method: "POST",
      body: JSON.stringify(coverLetter ? { coverLetter } : {}),
    }),
  withdrawApplication: (code: string) =>
    request<Application>(`/application/${encodeURIComponent(code)}/withdraw`, {
      method: "PATCH",
    }),
  updateApplicationStatus: (code: string, status: string, note?: string) =>
    request<Application>(`/application/${encodeURIComponent(code)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    }),
  myApplications: async () => {
    const applications =
      await request<(Application & { appCode?: string })[]>("/application/me");
    return applications.map((application) => ({
      ...application,
      applicationCode: application.applicationCode ?? application.appCode ?? "",
      createdAt: application.createdAt ?? application.appliedAt,
    }));
  },
  adminStats: () => request<AdminStats>("/admin/stats"),
  adminUsers: (page = 1, limit = 50) =>
    request<{
      items: AdminUserRecord[];
      total: number;
      page: number;
      limit: number;
    }>(`/admin/users?page=${page}&limit=${limit}`),
  adminCompanies: (page = 1, limit = 50) =>
    request<{
      items: AdminCompanyRecord[];
      total: number;
      page: number;
      limit: number;
    }>(`/admin/companies?page=${page}&limit=${limit}`),
  adminAgents: () => request<AdminAgentRecord[]>("/admin/agents"),
  agentCompanies: () => request<AgentCompanyRecord[]>("/agent/me/companies"),
  companyMe: () => request<CompanyMeRecord>("/company/me"),
  agentJobApplications: (code: string) =>
    request<AgentApplicationRecord[]>(
      `/application/job/${encodeURIComponent(code)}`,
    ).then((applications) =>
      applications.map((application) => ({
        ...application,
        applicationCode:
          application.applicationCode ?? application.appCode ?? "",
      })),
    ),
  activateJob: (code: string) =>
    request<Job>(`/job/${encodeURIComponent(code)}/activate`, {
      method: "PATCH",
    }),
  pauseJob: (code: string) =>
    request<Job>(`/job/${encodeURIComponent(code)}/pause`, { method: "PATCH" }),
  updateJob: (code: string, data: Partial<Job>) =>
    request<Job>(`/job/${encodeURIComponent(code)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteJob: (code: string) =>
    request<Job>(`/job/${encodeURIComponent(code)}`, { method: "DELETE" }),
  createAdminAgent: (data: {
    email: string;
    password: string;
    displayName: string;
    phone?: string;
  }) =>
    request<AdminAgentRecord>("/admin/agents", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAdminUserStatus: (code: string, status: string) =>
    request<AdminUserRecord>(
      `/admin/users/${encodeURIComponent(code)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    ),
  reviewCompany: (
    code: string,
    action: "approve" | "reject",
    reason?: string,
  ) =>
    request<AdminCompanyRecord>(`/company/${encodeURIComponent(code)}/review`, {
      method: "PATCH",
      body: JSON.stringify({ action, ...(reason ? { reason } : {}) }),
    }),
};

export { ApiError };
