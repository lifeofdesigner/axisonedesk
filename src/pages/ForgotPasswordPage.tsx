import { AuthLayout } from "@/core/auth/components/AuthLayout";
import { ForgotPasswordForm } from "@/core/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a link to get back in."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

export { ForgotPasswordPage as Component };
