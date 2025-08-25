import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormError = any;
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

export default function Login() {
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
        `${import.meta.env.VITE_API_AUTH}/api/v1/auth/login`,
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
      const json = await res.json(); // {access_token, user, ...}
      login(json.access_token, json.user, "user");
      nav("/mypage");
    } catch (e: any) {
      setError("ログインに失敗しました。メールとパスワードをご確認ください。");
    }
  };

  return (
    <AuthLayout
      title="ログイン"
      subtitle="会員の方はこちらからログインしてください"
      side={
        <div className="space-y-2 text-sm text-slate-600">
          <p>AIが履歴書作成をサポートし、最適な求人をおすすめします。</p>
          <ul className="list-disc list-inside">
            <li>クイック応募</li>
            <li>進捗トラッキング</li>
            <li>PDF自動生成（履歴書）</li>
          </ul>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-md">
        {error && <Alert variant="error" message={error} />}
        <FormInput
          label="メールアドレス"
          name="email"
          type="email"
          register={register}
          error={errors.email as FormError}
          autoComplete="email"
        />
        <PasswordInput
          label="パスワード"
          name="password"
          register={register}
          error={errors.password as FormError}
          autoComplete="current-password"
        />
        <div className="flex items-center justify-between">
          <Checkbox
            label="ログイン状態を保持する"
            name="remember"
            register={register}
          />
          <Link to="/forgot" className="text-sm text-blue-700 hover:underline">
            パスワードをお忘れですか？
          </Link>
        </div>
        <Button className="w-full" type="submit">
          ログイン
        </Button>

        <Divider text="または" />
        <OAuthButtons />

        <p className="text-sm text-slate-600">
          アカウントをお持ちでないですか？{" "}
          <Link to="/register" className="text-blue-700 hover:underline">
            会員登録
          </Link>
        </p>

        <p className="text-xs text-slate-500">
          管理者の方は{" "}
          <Link to="/admin/login" className="underline">
            こちら
          </Link>
          、エージェントの方は{" "}
          <Link to="/agent/login" className="underline">
            こちら
          </Link>
          。
        </p>
      </form>
    </AuthLayout>
  );
}
