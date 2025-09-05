import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import {
  ResponsiveCard,
  ResponsiveText,
  ResponsiveButton,
} from "../components/responsive";
import { Container } from "../app/ui";
import {
  Users,
  Building2,
  Briefcase,
  UserCheck,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
} from "lucide-react";

interface User {
  role: "guest" | "user" | "agent" | "admin" | "company";
  name?: string;
  email?: string;
}

export default function UnifiedHome() {
  const [user, setUser] = useState<User>({ role: "guest" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking user authentication
    const checkAuth = async () => {
      setIsLoading(true);
      // Simulate API call to check user role
      setTimeout(() => {
        // For demo, we'll check localStorage or get from auth context
        const savedRole = localStorage.getItem("userRole") || "guest";
        setUser({ role: savedRole as User["role"] });
        setIsLoading(false);
      }, 500);
    };

    checkAuth();
  }, []);

  const handleRoleLogin = (role: "user" | "agent" | "admin" | "company") => {
    // Navigate to appropriate login page
    switch (role) {
      case "admin":
        window.location.href = "http://localhost:3001/admin/login";
        break;
      case "agent":
        window.location.href = "http://localhost:3001/agent/login";
        break;
      case "company":
        window.location.href = "http://localhost:3001/register";
        break;
      case "user":
        window.location.href = "http://localhost:3001/login";
        break;
    }
  };

  const features = [
    {
      icon: Users,
      title: "求職者向け",
      description: "履歴書作成から求人検索まで、就職活動をサポート",
      role: "user",
      color: "blue",
      benefits: [
        "履歴書・職務経歴書作成",
        "求人検索・応募",
        "エージェントサポート",
        "面接対策",
      ],
    },
    {
      icon: UserCheck,
      title: "エージェント向け",
      description: "求職者と企業をマッチングし、転職をサポート",
      role: "agent",
      color: "green",
      benefits: ["求職者管理", "企業との連携", "マッチング支援", "成果報酬"],
    },
    {
      icon: Building2,
      title: "企業向け",
      description: "優秀な人材を効率的に採用し、企業成長をサポート",
      role: "company",
      color: "purple",
      benefits: ["求人投稿", "応募者管理", "エージェント連携", "採用分析"],
    },
    {
      icon: Shield,
      title: "管理者向け",
      description: "プラットフォーム全体を管理し、システムを最適化",
      role: "admin",
      color: "red",
      benefits: [
        "ユーザー管理",
        "システム設定",
        "データ分析",
        "セキュリティ管理",
      ],
    },
  ];

  const stats = [
    { label: "登録ユーザー数", value: "1,247,000+", icon: Users },
    { label: "登録企業数", value: "15,600+", icon: Building2 },
    { label: "成功マッチング", value: "89,200+", icon: CheckCircle },
    { label: "満足度", value: "98.5%", icon: Star },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <ResponsiveText className="text-gray-600">
            読み込み中...
          </ResponsiveText>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            {/* ここはロゴのリンク部分です */}
            <a href="/">
              <div className="flex items-center space-x-4">
                <Logo />
              </div>
            </a>

            <div className="flex items-center space-x-4">
              {user.role === "guest" ? (
                <div className="flex items-center space-x-3">
                  <ResponsiveButton
                    variant="outline"
                    onClick={() => handleRoleLogin("user")}
                  >
                    求職者として開始
                  </ResponsiveButton>
                  <ResponsiveButton
                    variant="outline"
                    onClick={() => handleRoleLogin("agent")}
                  >
                    エージェントとして開始
                  </ResponsiveButton>
                  <ResponsiveButton
                    variant="outline"
                    onClick={() => handleRoleLogin("company")}
                  >
                    企業として開始
                  </ResponsiveButton>
                  <ResponsiveButton onClick={() => handleRoleLogin("admin")}>
                    管理者として開始
                  </ResponsiveButton>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <ResponsiveText className="text-sm text-gray-600">
                    こんにちは、
                    {user.role === "user"
                      ? "求職者"
                      : user.role === "agent"
                      ? "エージェント"
                      : user.role === "company"
                      ? "企業"
                      : "管理者"}
                    さん
                  </ResponsiveText>
                  <ResponsiveButton
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("userRole");
                      setUser({ role: "guest" });
                    }}
                  >
                    ログアウト
                  </ResponsiveButton>
                </div>
              )}
            </div>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <ResponsiveText
              as="h1"
              size="4xl"
              weight="bold"
              className="text-gray-900 mb-6"
            >
              採用・転職の未来を
              <span className="text-blue-600"> つなぐ</span>
            </ResponsiveText>
            <ResponsiveText size="xl" className="text-gray-600 mb-8">
              求職者、エージェント、企業、管理者が一体となって働く新しい採用プラットフォーム
            </ResponsiveText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ResponsiveButton
                size="lg"
                onClick={() => handleRoleLogin("user")}
              >
                求職者として始める
                <ArrowRight className="w-5 h-5 ml-2" />
              </ResponsiveButton>
              <ResponsiveButton
                variant="outline"
                size="lg"
                onClick={() => handleRoleLogin("company")}
              >
                企業として始める
                <ArrowRight className="w-5 h-5 ml-2" />
              </ResponsiveButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <ResponsiveText
                  as="p"
                  size="2xl"
                  weight="bold"
                  className="text-gray-900 mb-2"
                >
                  {stat.value}
                </ResponsiveText>
                <ResponsiveText className="text-gray-600">
                  {stat.label}
                </ResponsiveText>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="text-center mb-16">
            <ResponsiveText
              as="h2"
              size="3xl"
              weight="bold"
              className="text-gray-900 mb-4"
            >
              あなたの役割に合わせた
              <span className="text-blue-600"> 最適な体験</span>
            </ResponsiveText>
            <ResponsiveText size="lg" className="text-gray-600">
              求職者、エージェント、企業、管理者それぞれに特化した機能を提供
            </ResponsiveText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <ResponsiveCard
                key={index}
                className="p-8 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="text-center">
                  <div
                    className={`w-16 h-16 bg-${feature.color}-100 rounded-lg flex items-center justify-center mx-auto mb-6`}
                  >
                    <feature.icon
                      className={`w-8 h-8 text-${feature.color}-600`}
                    />
                  </div>
                  <ResponsiveText
                    as="h3"
                    size="xl"
                    weight="semibold"
                    className="text-gray-900 mb-4"
                  >
                    {feature.title}
                  </ResponsiveText>
                  <ResponsiveText className="text-gray-600 mb-6">
                    {feature.description}
                  </ResponsiveText>

                  <div className="space-y-3 mb-8">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div
                        key={benefitIndex}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <ResponsiveButton
                    className={`w-full bg-${feature.color}-600 hover:bg-${feature.color}-700`}
                    onClick={() => handleRoleLogin(feature.role as any)}
                  >
                    {feature.title}として開始
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </ResponsiveButton>
                </div>
              </ResponsiveCard>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <Container>
          <div className="text-center text-white">
            <ResponsiveText as="h2" size="3xl" weight="bold" className="mb-4">
              今すぐ始めましょう
            </ResponsiveText>
            <ResponsiveText size="lg" className="mb-8 opacity-90">
              あなたの役割に合わせて、最適な体験を提供します
            </ResponsiveText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ResponsiveButton
                variant="outline"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50"
                onClick={() => handleRoleLogin("user")}
              >
                求職者として始める
              </ResponsiveButton>
              <ResponsiveButton
                variant="outline"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50"
                onClick={() => handleRoleLogin("company")}
              >
                企業として始める
              </ResponsiveButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo className="text-white" />
              </div>
              <ResponsiveText className="text-gray-400">
                採用・転職の未来をつなぐプラットフォーム
              </ResponsiveText>
            </div>

            <div>
              <ResponsiveText
                as="h4"
                size="lg"
                weight="semibold"
                className="mb-4"
              >
                求職者向け
              </ResponsiveText>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    履歴書作成
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    求人検索
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    エージェント
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    サポート
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ResponsiveText
                as="h4"
                size="lg"
                weight="semibold"
                className="mb-4"
              >
                企業向け
              </ResponsiveText>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    求人投稿
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    人材検索
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    採用支援
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    分析ツール
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ResponsiveText
                as="h4"
                size="lg"
                weight="semibold"
                className="mb-4"
              >
                サポート
              </ResponsiveText>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    ヘルプセンター
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    お問い合わせ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    プライバシーポリシー
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    利用規約
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <ResponsiveText>
              © 2024 JobMatcher Platform. All rights reserved.
            </ResponsiveText>
          </div>
        </Container>
      </footer>
    </div>
  );
}
