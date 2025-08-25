import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./FormInput";
import { Button, Card } from "../app/ui";
import { useState } from "react";
import Divider from "../components/Divider";
import OAuthButtons from "../components/OAuthButtons";
const loginSchema = z.object({
  email: z.string().email("無効なメールアドレス"),
  password: z.string().min(6, "少なくとも6文字"),
});
const registerSchema = z.object({
  name: z.string().min(2, "少なくとも2文字"),
  email: z.string().email("無効なメールアドレス"),
  password: z.string().min(6, "少なくとも6文字"),
});
const agentloginSchema = z.object({
  email: z.string().email("無効なメールアドレス"),
  password: z.string().min(6, "少なくとも6文字"),
});
export function LoginCard() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      // TODO: backend ulanishi (keyingi bosqich)
      await new Promise((r) => setTimeout(r, 600));
      alert(`ログイン OK:\n${JSON.stringify(data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="ログイン" subtitle="アカウントをお持ちですか？ログイン">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormInput
          label="メール"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          autoComplete="email"
        />
        <FormInput
          label="パスワード"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          autoComplete="current-password"
        />
        <Button className="w-full" loading={loading} type="submit">
          ログイン
        </Button>
        <Divider text="または" />
        <OAuthButtons />
      </form>
    </Card>
  );
}

export function RegisterCard() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    try {
      // TODO: backend ulanishi (keyingi bosqich)
      await new Promise((r) => setTimeout(r, 800));
      alert(`登録完了:\n${JSON.stringify(data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="会員登録" subtitle="新しいアカウントを作成する">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormInput
          label="お名前"
          name="name"
          register={register}
          error={errors.name}
          placeholder="山田"
          autoComplete="name"
        />
        <FormInput
          label="メール"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          autoComplete="email"
        />
        <FormInput
          label="パスワード"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          autoComplete="new-password"
        />
        <Button className="w-full" loading={loading} type="submit">
          登録する
        </Button>
        <Divider text="または" />
        <OAuthButtons />
      </form>
    </Card>
  );
}

export function AgentLoginCard() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof agentloginSchema>>({
    resolver: zodResolver(agentloginSchema),
  });

  const onSubmit = async (data: z.infer<typeof agentloginSchema>) => {
    setLoading(true);
    try {
      // TODO: backend ulanishi (keyingi bosqich)
      await new Promise((r) => setTimeout(r, 600));
      alert(`ログイン OK:\n${JSON.stringify(data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="エージェントログイン"
      subtitle="アカウントをお持ちですか？ログイン"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormInput
          label="メール"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          autoComplete="email"
        />
        <FormInput
          label="パスワード"
          name="password"
          type="password"
          register={register}
          error={
            errors.password && "type" in errors.password
              ? errors.password
              : undefined
          }
          autoComplete="current-password"
        />
        <Button className="w-full" loading={loading} type="submit">
          ログイン
        </Button>
        <Divider text="または" />
        <OAuthButtons />
      </form>
    </Card>
  );
}
