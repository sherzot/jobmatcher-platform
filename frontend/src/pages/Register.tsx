import { useState, useMemo } from "react";
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

const schema = z
  .object({
    name: z.string().min(2, "2文字以上で入力してください"),
    email: z.string().email("メール形式が正しくありません"),
    password: z.string().min(8, "8文字以上で入力してください"),
    confirm: z.string(),
    terms: z
      .boolean()
      .refine((v) => v, "利用規約とプライバシーに同意してください"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "パスワードが一致しません",
    path: ["confirm"],
  });

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4); // 0..4
}

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({ resolver: zodResolver(schema) });

  const pw = watch("password") || "";
  const score = useMemo(() => strength(pw), [pw]);
  const bars = Array.from({ length: 4 });

    const onSubmit = async (data: any) => {
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_AUTH}/api/v1/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.name,
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
        setError("登録に失敗しました。時間を置いて再度お試しください。");
      }
    };


  return (
    <AuthLayout
      title="会員登録"
      subtitle="無料でアカウントを作成しましょう"
      side={
        <div className="space-y-2 text-sm text-slate-600">
          <p>最短で履歴書を作成し、あなたに合う求人にスピード応募。</p>
          <ul className="list-disc list-inside">
            <li>AIガイドで項目を埋める</li>
            <li>履歴書PDFで印刷も簡単</li>
            <li>エージェントへ即オファー</li>
          </ul>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-md">
        {error && <Alert variant="error" message={error} />}

        <FormInput
          label="氏名"
          name="name"
          register={register}
          error={errors.name}
          autoComplete="name"
        />
        <FormInput
          label="メールアドレス"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          autoComplete="email"
        />
        <PasswordInput
          label="パスワード"
          name="password"
          register={register}
          error={errors.password}
          autoComplete="new-password"
        />
        {/* strength meter */}
        <div className="h-2 w-full rounded bg-slate-200 overflow-hidden">
          <div
            className={`h-2 transition-all ${
              ["w-0", "w-1/4", "w-2/4", "w-3/4", "w-full"][score]
            } ${
              [
                "bg-red-500",
                "bg-red-500",
                "bg-amber-500",
                "bg-blue-500",
                "bg-emerald-500",
              ][score]
            }`}
          />
        </div>
        <PasswordInput
          label="パスワード（確認）"
          name="confirm"
          register={register}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <Checkbox
          label={
            (
              <span>
                {" "}
                <a className="underline" href="#">
                  利用規約
                </a>{" "}
                と{" "}
                <a className="underline" href="#">
                  プライバシーポリシー
                </a>{" "}
                に同意します
              </span>
            ) as unknown as string
          }
          name="terms"
          register={register}
          required
        />

        <Button className="w-full" type="submit">
          登録する
        </Button>

        <Divider text="または" />
        <OAuthButtons />

        <p className="text-sm text-slate-600">
          すでにアカウントをお持ちですか？{" "}
          <Link to="/login" className="text-blue-700 hover:underline">
            ログイン
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
