import { AuthLayout } from "@/core/auth/components/AuthLayout";
import { SignupForm } from "@/core/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start running your business on AxisOneDesk."
    >
      <SignupForm />
    </AuthLayout>
  );
}

export { SignupPage as Component };
