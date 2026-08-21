import { AuthLayout } from "@/core/auth/components/AuthLayout";
import { LoginForm } from "@/core/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your AxisOneDesk workspace.">
      <LoginForm />
    </AuthLayout>
  );
}

export { LoginPage as Component };
