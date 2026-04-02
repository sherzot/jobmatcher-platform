export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type WorkLocation = 'ONSITE' | 'REMOTE' | 'HYBRID';
export type JapaneseLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'BUSINESS' | 'NATIVE' | 'NONE';

export interface MockJob {
  id: string;
  code: string;
  title: string;
  company: {
    id: string;
    name: string;
    nameEn: string;
    logoInitial: string;
    logoColor: string;
    industry: string;
    employeeCount: string;
    prefecture: string;
  };
  jobType: JobType;
  workLocation: WorkLocation;
  prefecture: string;
  city: string;
  salaryMin: number;
  salaryMax: number;
  japaneseLevel: JapaneseLevel;
  visaSponsorship: boolean;
  minExperience: number;
  skills: string[];
  description: string;
  requirements: string;
  benefits: string;
  publishedAt: string;
  applyCount: number;
  viewCount: number;
}

export const MOCK_JOBS: MockJob[] = [
  {
    id: '1',
    code: 'J0000001',
    title: 'フロントエンドエンジニア（React/TypeScript）',
    company: {
      id: '1',
      name: '楽天グループ株式会社',
      nameEn: 'Rakuten Group, Inc.',
      logoInitial: 'R',
      logoColor: 'bg-red-600',
      industry: 'IT・インターネット',
      employeeCount: '10,000名以上',
      prefecture: '東京都',
    },
    jobType: 'FULL_TIME',
    workLocation: 'HYBRID',
    prefecture: '東京都',
    city: '品川区',
    salaryMin: 600,
    salaryMax: 1000,
    japaneseLevel: 'NONE',
    visaSponsorship: true,
    minExperience: 3,
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'TailwindCSS'],
    description: `楽天グループのECプラットフォームチームで、フロントエンド開発をリードするエンジニアを募集しています。

数億ユーザーが利用するプロダクトの設計・開発に携わり、技術的な挑戦をしたい方を求めています。チームは英語・日本語のバイリンガル環境で、グローバルなエンジニアと共に働きます。

【業務内容】
・楽天市場のフロントエンド設計・実装
・パフォーマンス最適化（Core Web Vitals改善）
・デザインシステムの構築・維持
・コードレビュー、技術メンタリング
・新技術の調査・導入提案`,
    requirements: `【必須要件】
・React + TypeScriptの実務経験3年以上
・Next.jsを使ったSSR/SSGの実装経験
・チーム開発（Git, PR review）の経験

【歓迎要件】
・GraphQLの経験
・パフォーマンス計測・改善の経験
・英語でのコミュニケーション能力`,
    benefits: `・年収：600万〜1,000万円（経験・スキルに応じて決定）
・フレックスタイム制（コアタイム11:00〜15:00）
・リモートワーク週3日可
・家賃補助（月3万円）
・書籍・学習費用全額補助
・英語学習サポート`,
    publishedAt: '2025-03-28',
    applyCount: 47,
    viewCount: 1240,
  },
  {
    id: '2',
    code: 'J0000002',
    title: 'バックエンドエンジニア（NestJS/TypeScript）',
    company: {
      id: '2',
      name: 'メルカリ',
      nameEn: 'Mercari, Inc.',
      logoInitial: 'M',
      logoColor: 'bg-red-500',
      industry: 'IT・インターネット',
      employeeCount: '2,000〜5,000名',
      prefecture: '東京都',
    },
    jobType: 'FULL_TIME',
    workLocation: 'REMOTE',
    prefecture: '東京都',
    city: '港区',
    salaryMin: 700,
    salaryMax: 1200,
    japaneseLevel: 'NONE',
    visaSponsorship: true,
    minExperience: 4,
    skills: ['NestJS', 'TypeScript', 'MySQL', 'Redis', 'AWS', 'Docker'],
    description: `メルカリのバックエンドチームで、フリマアプリの核となるAPIを設計・開発するエンジニアを募集。

日本・米国・英国でサービスを展開するグローバル企業で、スケールする分散システムの設計に挑戦できます。

【業務内容】
・マイクロサービスのAPI設計・実装
・データベース設計・最適化
・CI/CDパイプラインの改善
・セキュリティレビュー・脆弱性対応
・オンコール対応（ローテーション制）`,
    requirements: `【必須要件】
・バックエンド開発経験4年以上
・TypeScript or Javaの実務経験
・RDBMSの設計・チューニング経験
・RESTful API設計の知識

【歓迎要件】
・マイクロサービスアーキテクチャの経験
・Kubernetes, Istioの経験
・決済・金融系システムの経験`,
    benefits: `・年収：700万〜1,200万円
・フルリモート勤務可（全国どこからでもOK）
・ストックオプション制度
・ウェルネス手当（月3万円）
・育児・介護支援制度充実
・副業・兼業OK`,
    publishedAt: '2025-03-30',
    applyCount: 89,
    viewCount: 2180,
  },
  {
    id: '3',
    code: 'J0000003',
    title: 'Webエンジニア（フルスタック）- 日本語不問',
    company: {
      id: '3',
      name: 'LINE株式会社',
      nameEn: 'LY Corporation',
      logoInitial: 'L',
      logoColor: 'bg-green-500',
      industry: 'IT・インターネット',
      employeeCount: '5,000〜10,000名',
      prefecture: '東京都',
    },
    jobType: 'FULL_TIME',
    workLocation: 'HYBRID',
    prefecture: '東京都',
    city: '新宿区',
    salaryMin: 550,
    salaryMax: 900,
    japaneseLevel: 'NONE',
    visaSponsorship: true,
    minExperience: 2,
    skills: ['React', 'Node.js', 'Python', 'MySQL', 'Kubernetes'],
    description: `LINEのプロダクト開発チームで、フルスタックエンジニアを募集。日本語不問・英語環境での業務です。

月間9,500万人が使うメッセージングプラットフォームの開発に携わり、大規模システムの課題に取り組みます。

【業務内容】
・LINEアプリ内各種機能の開発
・フロントエンド/バックエンド両面での実装
・パフォーマンス・スケーラビリティ改善
・グローバルチームとのコラボレーション`,
    requirements: `【必須要件】
・Webフロントエンド or バックエンドの経験2年以上
・JavaScriptまたはPythonの実務経験
・Gitを用いたチーム開発経験

【言語】
・英語（業務レベル）— 日本語は不問`,
    benefits: `・年収：550万〜900万円
・フレックスタイム制
・リモートワーク可（週2〜3日）
・社員割引・各種福利厚生`,
    publishedAt: '2025-04-01',
    applyCount: 134,
    viewCount: 3450,
  },
  {
    id: '4',
    code: 'J0000004',
    title: 'Pythonエンジニア（AI/ML）',
    company: {
      id: '4',
      name: 'ソフトバンク株式会社',
      nameEn: 'SoftBank Corp.',
      logoInitial: 'S',
      logoColor: 'bg-blue-600',
      industry: '通信・IT',
      employeeCount: '10,000名以上',
      prefecture: '東京都',
    },
    jobType: 'FULL_TIME',
    workLocation: 'HYBRID',
    prefecture: '東京都',
    city: '港区',
    salaryMin: 650,
    salaryMax: 1100,
    japaneseLevel: 'N2',
    visaSponsorship: false,
    minExperience: 3,
    skills: ['Python', 'FastAPI', 'PyTorch', 'LLM', 'AWS', 'Docker'],
    description: `ソフトバンクのAI推進チームで、LLM・生成AIを活用したプロダクト開発エンジニアを募集。

【業務内容】
・社内AI基盤の設計・開発
・LLMを活用したアプリケーション開発（RAG、Agentなど）
・MLパイプラインの構築・運用
・データエンジニアリング`,
    requirements: `【必須要件】
・Python実務経験3年以上
・機械学習・深層学習の基礎知識
・日本語ビジネスレベル（N2以上）

【歓迎要件】
・LLM（GPT-4, Claude, Geminiなど）の活用経験
・FastAPIを用いたAPI開発経験
・AWS SageMakerの使用経験`,
    benefits: `・年収：650万〜1,100万円
・各種社会保険完備
・社員持株会制度
・テレワーク可（週2日）`,
    publishedAt: '2025-03-25',
    applyCount: 62,
    viewCount: 1890,
  },
  {
    id: '5',
    code: 'J0000005',
    title: 'インフラエンジニア（AWS/Kubernetes）',
    company: {
      id: '5',
      name: 'DeNA Co., Ltd.',
      nameEn: 'DeNA Co., Ltd.',
      logoInitial: 'D',
      logoColor: 'bg-purple-600',
      industry: 'ゲーム・IT',
      employeeCount: '2,000〜5,000名',
      prefecture: '東京都',
    },
    jobType: 'FULL_TIME',
    workLocation: 'HYBRID',
    prefecture: '東京都',
    city: '渋谷区',
    salaryMin: 600,
    salaryMax: 1000,
    japaneseLevel: 'N3',
    visaSponsorship: true,
    minExperience: 3,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Docker'],
    description: `DeNAのSREチームで、ゲーム・ヘルスケアプロダクトのインフラを支えるエンジニアを募集。

【業務内容】
・AWS上でのKubernetesクラスタ設計・運用
・Terraformを用いたInfrastructure as Code
・監視・アラート体制の構築改善
・障害対応・ポストモーテム`,
    requirements: `【必須要件】
・AWSを用いたインフラ構築・運用経験3年以上
・Linuxシステム管理の知識
・日本語N3以上

【歓迎要件】
・Kubernetes CKA/CKAD資格保有
・Terraform実務経験
・大規模トラフィックの処理経験`,
    benefits: `・年収：600万〜1,000万円
・フレックスタイム制
・書籍・資格費用全額補助
・社内勉強会・ハッカソン`,
    publishedAt: '2025-03-20',
    applyCount: 38,
    viewCount: 980,
  },
  {
    id: '6',
    code: 'J0000006',
    title: 'モバイルエンジニア（Flutter）',
    company: {
      id: '6',
      name: 'freee株式会社',
      nameEn: 'freee K.K.',
      logoInitial: 'F',
      logoColor: 'bg-orange-500',
      industry: 'SaaS・フィンテック',
      employeeCount: '1,000〜2,000名',
      prefecture: '東京都',
    },
    jobType: 'FULL_TIME',
    workLocation: 'REMOTE',
    prefecture: '東京都',
    city: '品川区',
    salaryMin: 580,
    salaryMax: 950,
    japaneseLevel: 'N2',
    visaSponsorship: false,
    minExperience: 2,
    skills: ['Flutter', 'Dart', 'iOS', 'Android', 'Firebase', 'REST API'],
    description: `日本最大のクラウド会計ソフト「freee」のモバイルアプリ開発エンジニアを募集。

【業務内容】
・iOS/Androidアプリの設計・開発（Flutter）
・既存ネイティブコードのFlutter移行
・ユーザビリティ改善
・QA・リリース管理`,
    requirements: `【必須要件】
・FlutterまたはiOS/Android開発経験2年以上
・REST APIとの連携経験
・日本語N2以上

【歓迎要件】
・会計・税務の基礎知識
・CI/CD（Bitrise, Fastlane）経験`,
    benefits: `・年収：580万〜950万円
・完全リモートワーク
・在宅勤務手当（月1万円）
・健康診断・メンタルヘルスサポート`,
    publishedAt: '2025-04-01',
    applyCount: 55,
    viewCount: 1560,
  },
];

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: '正社員',
  PART_TIME: 'パートタイム',
  CONTRACT: '契約社員',
  INTERNSHIP: 'インターン',
};

export const WORK_LOCATION_LABELS: Record<WorkLocation, string> = {
  ONSITE: 'オフィス',
  REMOTE: 'リモート',
  HYBRID: 'ハイブリッド',
};

export const JAPANESE_LEVEL_LABELS: Record<JapaneseLevel, string> = {
  N1: 'JLPT N1', N2: 'JLPT N2', N3: 'JLPT N3',
  N4: 'JLPT N4', N5: 'JLPT N5',
  BUSINESS: 'ビジネスレベル',
  NATIVE: 'ネイティブ',
  NONE: '不問',
};
