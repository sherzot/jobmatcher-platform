'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const INDUSTRIES = [
  'IT・ソフトウェア',
  'メーカー・製造',
  '商社・貿易',
  '金融・保険',
  '医療・介護',
  '教育・学習支援',
  '建設・不動産',
  '小売・流通',
  'サービス業',
  'コンサルティング',
  'その他',
];

const PREFECTURES = [
  '東京都', '大阪府', '神奈川県', '愛知県', '福岡県',
  '北海道', '宮城県', '埼玉県', '千葉県', '京都府',
  '兵庫県', '広島県', '静岡県', '茨城県', '栃木県',
  'その他（海外含む）',
];

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1
  email: string;
  password: string;
  confirmPassword: string;
  // Step 2
  companyName: string;
  companyNameEn: string;
  industry: string;
  prefecture: string;
  // Step 3
  businessRegNumber: string;
  registrationNote: string;
  agreed: boolean;
}

const INITIAL: FormData = {
  email: '', password: '', confirmPassword: '',
  companyName: '', companyNameEn: '', industry: '', prefecture: '',
  businessRegNumber: '', registrationNote: '', agreed: false,
};

const STEP_LABELS: Record<Step, string> = {
  1: 'アカウント',
  2: '会社情報',
  3: '申請内容',
};

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  // ── Validation ──────────────────────────────────────────────

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.email) e.email = 'メールアドレスを入力してください';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = '有効なメールアドレスを入力してください';
    if (!form.password) e.password = 'パスワードを入力してください';
    else if (form.password.length < 8) e.password = '8文字以上で入力してください';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      e.password = '大文字・小文字・数字をそれぞれ含めてください';
    if (!form.confirmPassword) e.confirmPassword = 'パスワードを再入力してください';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'パスワードが一致しません';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!form.companyName.trim()) e.companyName = '会社名を入力してください';
    if (!form.industry) e.industry = '業種を選択してください';
    if (!form.prefecture) e.prefecture = '都道府県を選択してください';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => (s + 1) as Step);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep((s) => (s - 1) as Step);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) {
      setErrors({ agreed: '利用規約への同意が必要です' });
      return;
    }
    setIsSubmitting(true);

    // TODO: call POST /api/auth/register/company
    await new Promise((r) => setTimeout(r, 1200)); // mock API delay

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  // ── Success screen ─────────────────────────────────────────

  if (isSuccess) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900">申請が完了しました</h1>
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-left">
          <p className="mb-4 text-sm font-semibold text-blue-800">次のステップ</p>
          <ol className="space-y-3 text-sm text-blue-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">1</span>
              担当エージェントが会社情報（法人番号・登録内容）を確認します。
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">2</span>
              審査完了後、登録メール（<strong>{form.email}</strong>）に通知が届きます。
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">3</span>
              承認されるとログインできるようになります。通常1〜2営業日かかります。
            </li>
          </ol>
        </div>
        <p className="mb-6 text-sm text-gray-500">
          ご不明な点がございましたら、サポートまでお問い合わせください。
        </p>
        <Link
          href="/"
          className="block w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          ホームに戻る
        </Link>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
          企
        </div>
        <h1 className="text-2xl font-bold text-gray-900">企業アカウント登録</h1>
        <p className="mt-1 text-sm text-gray-500">
          審査完了後、担当エージェントと連携して採用活動を開始できます
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-0">
        {([1, 2, 3] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step > s
                  ? 'bg-blue-600 text-white'
                  : step === s
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : s}
              </div>
              <span className={`text-xs font-medium ${step === s ? 'text-blue-600' : 'text-gray-400'}`}>
                {STEP_LABELS[s]}
              </span>
            </div>
            {i < 2 && (
              <div className={`mb-5 h-0.5 w-16 transition-colors ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* ── Step 1: Account ── */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="mb-5 text-sm font-semibold text-gray-700">ログイン情報</p>

            <Field label="メールアドレス" required error={errors.email}>
              <input type="email" value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="hr@company.com"
                className={inputCls(!!errors.email)} />
            </Field>

            <Field label="パスワード" required error={errors.password}
              hint="大文字・小文字・数字をそれぞれ含む8文字以上">
              <input type="password" value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="••••••••"
                className={inputCls(!!errors.password)} />
            </Field>

            <Field label="パスワード（確認）" required error={errors.confirmPassword}>
              <input type="password" value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className={inputCls(!!errors.confirmPassword)} />
            </Field>

            <button onClick={handleNext} className={btnPrimary}>
              次へ → 会社情報
            </button>
          </div>
        )}

        {/* ── Step 2: Company info ── */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="mb-5 text-sm font-semibold text-gray-700">会社の基本情報</p>

            <Field label="会社名（法人名）" required error={errors.companyName}>
              <input type="text" value={form.companyName}
                onChange={(e) => set('companyName', e.target.value)}
                placeholder="株式会社〇〇"
                className={inputCls(!!errors.companyName)} />
            </Field>

            <Field label="会社名（英語）" error={errors.companyNameEn}>
              <input type="text" value={form.companyNameEn}
                onChange={(e) => set('companyNameEn', e.target.value)}
                placeholder="Company Name Inc."
                className={inputCls(false)} />
            </Field>

            <Field label="業種" required error={errors.industry}>
              <select value={form.industry}
                onChange={(e) => set('industry', e.target.value)}
                className={inputCls(!!errors.industry)}>
                <option value="">選択してください</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </Field>

            <Field label="本社所在地（都道府県）" required error={errors.prefecture}>
              <select value={form.prefecture}
                onChange={(e) => set('prefecture', e.target.value)}
                className={inputCls(!!errors.prefecture)}>
                <option value="">選択してください</option>
                {PREFECTURES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>

            <div className="flex gap-3 pt-2">
              <button onClick={handleBack} className={btnSecondary}>戻る</button>
              <button onClick={handleNext} className={`${btnPrimary} flex-1`}>
                次へ → 申請内容
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Registration note & submit ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="mb-5 text-sm font-semibold text-gray-700">審査に必要な情報</p>

            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-semibold">⚠️ 審査について</p>
              <p className="mt-1 text-xs text-amber-700">
                エージェントが会社の実在性・適法性を確認します。法人番号や会社概要を正確にご記入ください。
              </p>
            </div>

            <Field label="法人番号・登録番号" hint="日本の法人番号（13桁）またはウズベキスタンの法人登録番号">
              <input type="text" value={form.businessRegNumber}
                onChange={(e) => set('businessRegNumber', e.target.value)}
                placeholder="1234567890123"
                className={inputCls(false)} />
            </Field>

            <Field
              label="エージェントへのメッセージ"
              hint="会社の概要・採用目的・採用予定人数など、審査に役立つ情報をご記入ください"
            >
              <textarea value={form.registrationNote}
                onChange={(e) => set('registrationNote', e.target.value)}
                rows={5}
                placeholder="例：ITコンサルティング企業で、エンジニア採用を強化するために登録申請しました。年間10名程度の採用を計画しています。"
                className={`${inputCls(false)} resize-none`} />
            </Field>

            {/* Summary */}
            <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-700 text-sm mb-2">登録内容確認</p>
              <p><span className="text-gray-400">メール：</span>{form.email}</p>
              <p><span className="text-gray-400">会社名：</span>{form.companyName}</p>
              <p><span className="text-gray-400">業種：</span>{form.industry}</p>
              <p><span className="text-gray-400">所在地：</span>{form.prefecture}</p>
            </div>

            {/* Agreement */}
            <div>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input type="checkbox" checked={form.agreed}
                  onChange={(e) => set('agreed', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600" />
                <span className="text-xs text-gray-500">
                  <Link href="#" className="text-blue-600 hover:underline">利用規約</Link>および
                  <Link href="#" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
                  に同意します
                </span>
              </label>
              {errors.agreed && <p className="mt-1 text-xs text-red-500">{errors.agreed}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleBack} className={btnSecondary}>戻る</button>
              <button type="submit" disabled={isSubmitting}
                className={`${btnPrimary} flex-1 bg-blue-600 hover:bg-blue-700`}>
                {isSubmitting ? '申請中...' : '登録申請を送信する'}
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        すでにアカウントをお持ちの方は{' '}
        <Link href="/login" className="text-blue-600 hover:underline">ログイン</Link>
      </p>
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────

function Field({
  label, required, hint, error, children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  `w-full rounded-lg border px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
  }`;

const btnPrimary =
  'w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60';

const btnSecondary =
  'rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50';
