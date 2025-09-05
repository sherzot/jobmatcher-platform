import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import PasswordInput from "../components/PasswordInput";
import Checkbox from "../components/Checkbox";
import Divider from "../components/Divider";
import OAuthButtons from "../components/OAuthButtons";
import Alert from "../components/Alert";
import { Button } from "../app/ui";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../app/auth/AuthProvider";

const schema = z.object({
  email: z.string().email("メール形式が正しくありません"),
  password: z.string().min(6, "6文字以上で入力してください"),
  remember: z.boolean().optional(),
});

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_AUTH}/api/v1/auth/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const json = await res.json();
      login(json.access_token, json.user, "admin");
      localStorage.setItem("userRole", "admin");
      nav("/admin");
    } catch (e: any) {
      setError("ログインに失敗しました。メールとパスワードをご確認ください。");
    }
  };

  return (
    <AuthLayout
      title="管理者ログイン"
      subtitle="管理者の方はこちらからログインしてください"
      side={
        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-600">
          <p>プラットフォーム全体を管理し、システムを最適化します。</p>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2">
            <li>ユーザー管理</li>
            <li>エージェント管理</li>
            <li>企業管理</li>
            <li>システム設定</li>
            <li>データ分析</li>
          </ul>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6 max-w-md w-full"
      >
        {error && <Alert variant="error" message={error} />}
        <FormInput
          label="メールアドレス"
          type="email"
          placeholder="admin@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <PasswordInput
          label="パスワード"
          placeholder="パスワードを入力"
          {...register("password")}
          error={errors.password?.message}
        />
        <div className="flex items-center justify-between">
          <Checkbox
            label="ログイン状態を保持"
            {...register("remember")}
          />
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            パスワードを忘れた方
          </Link>
        </div>
        <Button type="submit" className="w-full">
          管理者としてログイン
        </Button>
        <Divider text="または" />
        <OAuthButtons />
        <div className="text-center">
          <span className="text-sm text-gray-600">
            管理者アカウントが必要な場合は{" "}
          </span>
          <Link to="/contact" className="text-sm text-blue-600 hover:text-blue-500">
            お問い合わせ
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
