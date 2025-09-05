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

export default function AgentLogin() {
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
        `${import.meta.env.VITE_API_AUTH}/api/v1/auth/agent/login`,
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
      login(json.access_token, json.user, "agent");
      localStorage.setItem("userRole", "agent");
      nav("/agent");
    } catch (e: any) {
      setError("ログインに失敗しました。メールとパスワードをご確認ください。");
    }
  };

  return (
    <AuthLayout
      title="エージェントログイン"
      subtitle="エージェントの方はこちらからログインしてください"
      side={
        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-600">
          <p>企業と求職者をマッチングし、転職をサポートします。</p>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2">
            <li>企業管理</li>
            <li>求人管理</li>
            <li>応募者管理</li>
            <li>マッチング支援</li>
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
          placeholder="agent@example.com"
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
          <Checkbox label="ログイン状態を保持" {...register("remember")} />
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            パスワードを忘れた方
          </Link>
        </div>
        <Button type="submit" className="w-full">
          エージェントとしてログイン
        </Button>
        <Divider text="または" />
        <OAuthButtons />
        <div className="text-center">
          <span className="text-sm text-gray-600">
            アカウントをお持ちでない方は{" "}
          </span>
          <Link
            to="/agent/register"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            こちらから登録
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
